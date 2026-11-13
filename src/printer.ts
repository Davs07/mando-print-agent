import * as net from 'net'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execFile } from 'child_process'
import type { PrintAgentConfig } from './config'
import {
  CODIGO_CSHARP,
  ErrorDeImpresora,
  HostDePowerShell,
  HostNoDisponible,
} from './windows-host'

export interface Printer {
  print(bytes: Uint8Array): Promise<void>
  /**
   * Paga por adelantado lo que tarda el primer ticket (arrancar PowerShell,
   * abrir el puerto…). Nunca lanza: si no se puede, el primer ticket lo intenta
   * por su cuenta y falla con su propio error.
   */
  warmUp?(): Promise<void>
  /** Libera lo que la impresora tenga abierto (procesos, puertos). Idempotente. */
  close?(): void
}

// ---------------------------------------------------------------------------
// Impresora de red (Ethernet / WiFi) — TCP puerto 9100
// ---------------------------------------------------------------------------
export class NetworkPrinter implements Printer {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly timeoutMs = 5000,
  ) {}

  print(bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(
        { host: this.host, port: this.port },
        () => {
          socket.write(Buffer.from(bytes), (err) => {
            if (err) {
              socket.destroy()
              reject(err)
            } else {
              socket.end()
              resolve()
            }
          })
        },
      )

      socket.setTimeout(this.timeoutMs)
      socket.on('timeout', () => {
        socket.destroy()
        reject(
          new Error(
            `Tiempo de espera agotado conectando a ${this.host}:${this.port}`,
          ),
        )
      })
      socket.on('error', reject)
    })
  }
}

// ---------------------------------------------------------------------------
// Impresora serie / USB-Serie (COM3, /dev/usb/lp0, etc.)
// ---------------------------------------------------------------------------
export class SerialPrinter implements Printer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sp: any

  constructor(
    private readonly path: string,
    private readonly baudRate: number,
  ) {}

  async init(): Promise<void> {
    let SerialPort: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      ;({ SerialPort } = require('serialport'))
    } catch {
      throw new Error(
        'El paquete "serialport" no está instalado. Ejecuta: npm install serialport',
      )
    }
    this.sp = new SerialPort({ path: this.path, baudRate: this.baudRate })
    await new Promise<void>((resolve, reject) => {
      this.sp.on('open', resolve)
      this.sp.on('error', reject)
    })
  }

  /** Sin esto, reiniciar el agente dejaba el puerto abierto y el reinicio fallaba con «acceso denegado». */
  close(): void {
    try {
      if (this.sp?.isOpen) this.sp.close()
    } catch {
      // ya estaba cerrado
    }
  }

  print(bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sp.write(Buffer.from(bytes), (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          this.sp.drain((drainErr: Error | null) => {
            if (drainErr) reject(drainErr)
            else resolve()
          })
        }
      })
    })
  }
}

// ---------------------------------------------------------------------------
// Impresora de archivo (útil para pruebas o impresoras /dev/usb/lp0 en Linux)
// ---------------------------------------------------------------------------
export class FilePrinter implements Printer {
  constructor(private readonly filePath: string) {}

  async print(bytes: Uint8Array): Promise<void> {
    fs.appendFileSync(this.filePath, Buffer.from(bytes))
  }
}

// ---------------------------------------------------------------------------
// Impresora instalada en Windows — spooler, datos crudos
// ---------------------------------------------------------------------------

/**
 * Script que manda bytes crudos a una impresora de Windows.
 *
 * ⚠️ POR QUÉ ESTO Y NO UN MÓDULO NATIVO:
 * La mayoría de las térmicas USB baratas no se presentan como puerto COM: se
 * instalan como una impresora normal de Windows con su driver. Para esas, ni
 * `network` ni `serial` sirven. La vía correcta es el spooler con tipo de datos
 * **RAW**, que entrega los bytes al dispositivo sin que el driver los
 * reinterprete — justo lo que necesita ESC/POS.
 *
 * Se hace con P/Invoke a `winspool.drv` desde PowerShell en vez de con un
 * módulo nativo (`node-printer` y similares) porque esos exigen recompilar
 * contra el ABI de Electron en cada actualización, que es una fuente constante
 * de builds rotos. Esto no necesita compilar nada y no obliga a compartir la
 * impresora en red, que es el otro truco habitual (`copy /b \\\\host\\share`).
 *
 * ⚠️ El here-string de PowerShell (`@'` … `'@`) exige que el cierre esté en la
 * columna 0, así que este literal NO se puede indentar.
 */
const SCRIPT_IMPRESION_CRUDA = `param([string]$PrinterName, [string]$FilePath)
$ErrorActionPreference = 'Stop'
# Sin esto PowerShell emite en la codificacion OEM de la consola (cp850 en un
# Windows en espanol) y Node la lee como UTF-8: el mensaje llega con mojibake
# ("Excepcion" -> "Excepci?n"). Ese texto acaba en la UI y viaja al backend en
# print:result, asi que tiene que ser legible.
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -TypeDefinition @'
${CODIGO_CSHARP}
'@
try {
  [MandoRawPrinter]::SendBytes($PrinterName, [System.IO.File]::ReadAllBytes($FilePath))
} catch {
  # Solo la causa raiz. Sin esto PowerShell adjunta su propio stack trace
  # ("En C:\\...\\mando-print-raw.ps1: 62 Caracter: 1" y cuatro lineas mas), que
  # sepulta el unico dato util: por que no se pudo imprimir.
  [Console]::Error.WriteLine($_.Exception.GetBaseException().Message)
  exit 1
}
`

export interface OpcionesWindowsPrinter {
  /**
   * `true` (por defecto): un PowerShell residente que compila una vez y recibe
   * los tickets por stdin. `false`: el camino de siempre, un PowerShell por
   * ticket — el respaldo cuando el residente no se puede usar.
   */
  residente?: boolean
  /** Para probar sin PowerShell. */
  host?: HostDePowerShell
}

export class WindowsPrinter implements Printer {
  private scriptPath: string | null = null
  private host: HostDePowerShell | null
  /** Pasa a `false` si el residente no arranca: desde ahí todo va por el camino de siempre. */
  private usarHost: boolean

  constructor(
    private readonly printerName: string,
    private readonly timeoutMs = 20_000,
    opciones: OpcionesWindowsPrinter = {},
  ) {
    this.usarHost = opciones.residente !== false
    this.host = this.usarHost ? (opciones.host ?? new HostDePowerShell()) : null
  }

  /** El script se escribe una vez y se reutiliza en cada ticket. */
  private asegurarScript(): string {
    if (this.scriptPath && fs.existsSync(this.scriptPath)) return this.scriptPath

    const ruta = path.join(os.tmpdir(), 'mando-print-raw.ps1')
    fs.writeFileSync(ruta, SCRIPT_IMPRESION_CRUDA, 'utf-8')
    this.scriptPath = ruta
    return ruta
  }

  /**
   * Arranca PowerShell y abre la impresora ahora, no con el primer ticket. Medido,
   * ese arranque cuesta de 1 a 4 s en frío y se lo comía el primer cliente.
   */
  async warmUp(): Promise<void> {
    if (process.platform !== 'win32' || !this.usarHost || !this.host) return
    try {
      await this.host.probar(this.printerName, this.timeoutMs)
    } catch (err) {
      // Un nombre de impresora mal escrito también llega aquí: no es motivo para
      // dejar de usar el residente (el primer ticket dirá el error de verdad).
      if (err instanceof HostNoDisponible) this.usarHost = false
    }
  }

  close(): void {
    this.host?.cerrar()
  }

  async print(bytes: Uint8Array): Promise<void> {
    if (process.platform !== 'win32') {
      throw new Error('El modo de impresora "windows" solo funciona en Windows.')
    }

    // Los bytes van por archivo y no por stdin: PowerShell reinterpretaría la
    // codificación de stdin y corrompería el binario de ESC/POS.
    const datos = path.join(
      os.tmpdir(),
      `mando-ticket-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.bin`,
    )
    fs.writeFileSync(datos, Buffer.from(bytes))

    try {
      if (this.usarHost && this.host) {
        try {
          await this.host.imprimir(this.printerName, datos, this.timeoutMs)
          return
        } catch (err) {
          if (err instanceof HostNoDisponible) {
            // El trabajo NO llegó a enviarse: es seguro probar por el camino de
            // siempre, y no se vuelve a intentar el residente en esta sesión
            // (cada intento fallido costaría su tiempo de espera).
            this.usarHost = false
          } else if (err instanceof ErrorDeImpresora) {
            throw new Error(`No se pudo imprimir en "${this.printerName}": ${err.message}`)
          } else {
            // El host se colgó o murió con el trabajo ya enviado: no se
            // reintenta por otro camino, podría duplicarse el ticket.
            throw new Error(
              `No se pudo imprimir en "${this.printerName}": ${err instanceof Error ? err.message : String(err)}`,
            )
          }
        }
      }
      await this.imprimirUnaVez(datos)
    } finally {
      try {
        fs.unlinkSync(datos)
      } catch {
        // Un temporal huérfano no debe tumbar una impresión correcta.
      }
    }
  }

  /** El camino de siempre: un `powershell.exe` por ticket. Lento, pero no depende de un proceso vivo. */
  private imprimirUnaVez(datos: string): Promise<void> {
    const script = this.asegurarScript()
    return new Promise<void>((resolve, reject) => {
      execFile(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          // El equipo del local puede tener la ejecución de scripts restringida
          // por directiva; sin esto fallaría en muchas instalaciones.
          '-ExecutionPolicy', 'Bypass',
          '-File', script,
          '-PrinterName', this.printerName,
          '-FilePath', datos,
        ],
        { timeout: this.timeoutMs, windowsHide: true },
        (err, _stdout, stderr) => {
          if (err) {
            const detalle = String(stderr || '').trim() || err.message
            reject(new Error(`No se pudo imprimir en "${this.printerName}": ${detalle}`))
            return
          }
          resolve()
        },
      )
    })
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export async function createPrinter(config: PrintAgentConfig): Promise<Printer> {
  switch (config.printerType) {
    case 'network': {
      if (!config.printerHost) {
        throw new Error(
          'PRINTER_HOST es requerido para el modo de impresora de red',
        )
      }
      return new NetworkPrinter(config.printerHost, config.printerPort)
    }
    case 'serial': {
      if (!config.serialPath) {
        throw new Error(
          'SERIAL_PATH es requerido para el modo de impresora serial',
        )
      }
      const printer = new SerialPrinter(config.serialPath, config.serialBaudRate)
      await printer.init()
      return printer
    }
    case 'windows': {
      if (!config.printerName) {
        throw new Error(
          'PRINTER_NAME es requerido para el modo de impresora de Windows ' +
            '(el nombre exacto con el que aparece en Dispositivos e impresoras)',
        )
      }
      const impresora = new WindowsPrinter(config.printerName)
      // Sin esperar: la app no debe tardar en abrir porque PowerShell compila. Si
      // algo sale mal, el primer ticket lo vuelve a intentar y dice el error.
      void impresora.warmUp()
      return impresora
    }
    case 'file': {
      if (!config.filePath) {
        throw new Error(
          'PRINTER_FILE_PATH es requerido para el modo de impresora de archivo',
        )
      }
      return new FilePrinter(config.filePath)
    }
    default: {
      const exhaustive: never = config.printerType
      throw new Error(`Tipo de impresora desconocido: ${exhaustive}`)
    }
  }
}
