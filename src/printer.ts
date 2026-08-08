import * as net from 'net'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { execFile } from 'child_process'
import type { PrintAgentConfig } from './config'

export interface Printer {
  print(bytes: Uint8Array): Promise<void>
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
using System;
using System.Runtime.InteropServices;

public class MandoRawPrinter {
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
  public class DOCINFOW {
    [MarshalAs(UnmanagedType.LPWStr)] public string pDocName;
    [MarshalAs(UnmanagedType.LPWStr)] public string pOutputFile;
    [MarshalAs(UnmanagedType.LPWStr)] public string pDataType;
  }

  [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
  public static extern bool OpenPrinter(string src, out IntPtr hPrinter, IntPtr pd);
  [DllImport("winspool.drv", SetLastError = true)]
  public static extern bool ClosePrinter(IntPtr hPrinter);
  [DllImport("winspool.drv", CharSet = CharSet.Unicode, SetLastError = true)]
  public static extern bool StartDocPrinter(IntPtr hPrinter, int level, [In, MarshalAs(UnmanagedType.LPStruct)] DOCINFOW di);
  [DllImport("winspool.drv", SetLastError = true)]
  public static extern bool EndDocPrinter(IntPtr hPrinter);
  [DllImport("winspool.drv", SetLastError = true)]
  public static extern bool StartPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.drv", SetLastError = true)]
  public static extern bool EndPagePrinter(IntPtr hPrinter);
  [DllImport("winspool.drv", SetLastError = true)]
  public static extern bool WritePrinter(IntPtr hPrinter, IntPtr pBytes, int dwCount, out int dwWritten);

  public static void SendBytes(string printerName, byte[] bytes) {
    IntPtr hPrinter;
    if (!OpenPrinter(printerName, out hPrinter, IntPtr.Zero)) {
      int codigo = Marshal.GetLastWin32Error();
      // 1801 = ERROR_INVALID_PRINTER_NAME. Es con diferencia el fallo mas
      // frecuente: el nombre tiene que coincidir EXACTAMENTE con el instalado.
      string pista = codigo == 1801
        ? " - ese nombre no coincide con ninguna impresora instalada"
        : "";
      throw new Exception("No se pudo abrir la impresora '" + printerName + "' (codigo " + codigo + ")" + pista);
    }
    try {
      DOCINFOW di = new DOCINFOW();
      di.pDocName = "Mando Ticket";
      di.pDataType = "RAW";
      if (!StartDocPrinter(hPrinter, 1, di))
        throw new Exception("StartDocPrinter fallo (codigo " + Marshal.GetLastWin32Error() + ")");
      try {
        if (!StartPagePrinter(hPrinter))
          throw new Exception("StartPagePrinter fallo (codigo " + Marshal.GetLastWin32Error() + ")");
        IntPtr buffer = Marshal.AllocCoTaskMem(bytes.Length);
        try {
          Marshal.Copy(bytes, 0, buffer, bytes.Length);
          int escritos;
          if (!WritePrinter(hPrinter, buffer, bytes.Length, out escritos))
            throw new Exception("WritePrinter fallo (codigo " + Marshal.GetLastWin32Error() + ")");
        } finally {
          Marshal.FreeCoTaskMem(buffer);
        }
        EndPagePrinter(hPrinter);
      } finally {
        EndDocPrinter(hPrinter);
      }
    } finally {
      ClosePrinter(hPrinter);
    }
  }
}
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

export class WindowsPrinter implements Printer {
  private scriptPath: string | null = null

  constructor(
    private readonly printerName: string,
    private readonly timeoutMs = 20_000,
  ) {}

  /** El script se escribe una vez y se reutiliza en cada ticket. */
  private asegurarScript(): string {
    if (this.scriptPath && fs.existsSync(this.scriptPath)) return this.scriptPath

    const ruta = path.join(os.tmpdir(), 'mando-print-raw.ps1')
    fs.writeFileSync(ruta, SCRIPT_IMPRESION_CRUDA, 'utf-8')
    this.scriptPath = ruta
    return ruta
  }

  print(bytes: Uint8Array): Promise<void> {
    if (process.platform !== 'win32') {
      return Promise.reject(
        new Error('El modo de impresora "windows" solo funciona en Windows.'),
      )
    }

    const script = this.asegurarScript()
    // Los bytes van por archivo y no por stdin: PowerShell reinterpreta la
    // codificación de stdin y corrompería el binario de ESC/POS.
    const datos = path.join(
      os.tmpdir(),
      `mando-ticket-${process.pid}-${Date.now()}.bin`,
    )
    fs.writeFileSync(datos, Buffer.from(bytes))

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
          try {
            fs.unlinkSync(datos)
          } catch {
            // Un temporal huérfano no debe tumbar una impresión correcta.
          }

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
      return new WindowsPrinter(config.printerName)
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
