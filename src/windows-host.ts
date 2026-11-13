import { spawn as spawnReal } from 'child_process'
import type { ChildProcessWithoutNullStreams } from 'child_process'
import { createHash } from 'crypto'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

/**
 * PowerShell residente para la impresora instalada en Windows.
 *
 * POR QUÉ EXISTE: el modo `windows` lanzaba un `powershell.exe` NUEVO por cada
 * ticket, y cada uno arrancaba PowerShell y compilaba el C# de `winspool` con
 * `Add-Type`. Medido en un equipo de desarrollo (6 tickets seguidos, sin
 * imprimir: impresora inexistente, que es todo el sobrecosto fijo): mediana de
 * 2 535 ms, entre 961 ms y 6 459 ms. Ese tiempo se sumaba a CADA comanda y a
 * cada comprobante, antes de mandar un solo byte a la térmica.
 *
 * Aquí PowerShell arranca UNA vez, compila el C# una vez y se queda leyendo
 * trabajos por stdin. Con el mismo C# y el mismo `OpenPrinter` el segundo ticket
 * en adelante costó ~1 ms de sobrecosto.
 *
 * PROTOCOLO (una línea por mensaje, campos separados por tabulador):
 *   agente → host   `id \t PRINT \t base64(nombre) \t base64(ruta del .bin)`
 *                   `id \t PROBE \t base64(nombre)`  (abre y cierra: precalienta)
 *   host → agente   `READY`  una vez, al terminar de compilar
 *                   `id \t OK`
 *                   `id \t ERR \t mensaje de una sola línea`
 *
 * El nombre y la ruta viajan en base64: son texto que escribe el usuario y
 * así no pueden traer tabuladores, saltos de línea ni comillas que rompan el
 * protocolo; y como es ASCII no depende de la codificación de la consola.
 */

/**
 * La clase C# que habla con `winspool.drv`. La comparten este host y el script
 * de un solo uso de `printer.ts` (el camino de respaldo): un arreglo aquí vale
 * para los dos.
 */
export const CODIGO_CSHARP = String.raw`using System;
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

  static IntPtr Abrir(string printerName) {
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
    return hPrinter;
  }

  /** Abre y cierra la impresora sin mandar nada: paga el primer uso de winspool. */
  public static void Probar(string printerName) {
    ClosePrinter(Abrir(printerName));
  }

  public static void SendBytes(string printerName, byte[] bytes) {
    IntPtr hPrinter = Abrir(printerName);
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
}`

/**
 * El script del host.
 *
 * ⚠️ `String.raw`: el PowerShell lleva barras invertidas (`\r\n` en una
 * expresión regular) que un literal normal convertiría en saltos de línea de
 * verdad. Y el here-string (`@'` … `'@`) exige el cierre en la columna 0, así
 * que este literal NO se puede indentar.
 */
export const SCRIPT_HOST = String.raw`$ErrorActionPreference = 'Stop'
# Sin esto PowerShell emite en la codificacion OEM de la consola (cp850 en un
# Windows en espanol) y Node la lee como UTF-8: el mensaje llega con mojibake.
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -TypeDefinition @'
${CODIGO_CSHARP}
'@
$TAB = [char]9
$utf8 = [System.Text.Encoding]::UTF8
function Responder([string]$linea) {
  [Console]::Out.WriteLine($linea)
  [Console]::Out.Flush()
}
Responder 'READY'
while ($true) {
  $linea = [Console]::In.ReadLine()
  # stdin cerrado = el agente se fue: el host termina solo, sin quedar huerfano.
  if ($null -eq $linea) { break }
  $p = $linea.Split($TAB)
  $id = $p[0]
  try {
    $nombre = $utf8.GetString([Convert]::FromBase64String($p[2]))
    if ($p[1] -eq 'PROBE') {
      [MandoRawPrinter]::Probar($nombre)
    } else {
      $ruta = $utf8.GetString([Convert]::FromBase64String($p[3]))
      [MandoRawPrinter]::SendBytes($nombre, [System.IO.File]::ReadAllBytes($ruta))
    }
    Responder ($id + $TAB + 'OK')
  } catch {
    # Solo la causa raiz y en UNA linea: un salto de linea rompe el protocolo.
    $m = $_.Exception.GetBaseException().Message -replace '[\r\n]+', ' '
    Responder ($id + $TAB + 'ERR' + $TAB + $m)
  }
}
`

/** El host no se pudo usar: el trabajo NO llegó a enviarse y se puede probar por otro camino. */
export class HostNoDisponible extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'HostNoDisponible'
  }
}

/**
 * Se envió el trabajo y no hay certeza de qué pasó (el host murió o no
 * contestó). NO se reintenta por otro camino: si la térmica ya había imprimido,
 * se duplicaría el ticket.
 */
export class HostSinRespuesta extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'HostSinRespuesta'
  }
}

/** La impresora (o Windows) contestó con un error: es el error de verdad, tal cual. */
export class ErrorDeImpresora extends Error {
  constructor(mensaje: string) {
    super(mensaje)
    this.name = 'ErrorDeImpresora'
  }
}

interface Pendiente {
  /** El proceso al que se le mandó: cada uno responde de lo suyo, no de lo del anterior. */
  hijo: ChildProcessWithoutNullStreams
  resolve: () => void
  reject: (err: Error) => void
  timer: NodeJS.Timeout
}

export interface OpcionesDelHost {
  /** Para probar sin PowerShell: sustituye a `child_process.spawn`. */
  spawn?: typeof spawnReal
  /** Cuánto se espera a que PowerShell compile y diga READY. Frío puede tardar segundos. */
  arranqueMs?: number
  /** Carpeta del script. Por defecto, la temporal del sistema. */
  carpeta?: string
}

const ARRANQUE_POR_DEFECTO_MS = 30_000

export class HostDePowerShell {
  private hijo: ChildProcessWithoutNullStreams | null = null
  private listo: Promise<void> | null = null
  private readonly pendientes = new Map<string, Pendiente>()
  private contador = 0
  private buffer = ''
  private stderr = ''

  constructor(private readonly opciones: OpcionesDelHost = {}) {}

  /** Arranca el proceso si no está y espera a que compile. */
  asegurar(): Promise<void> {
    if (this.listo) return this.listo
    this.listo = this.arrancar().catch((err) => {
      // Un arranque fallido no se queda en caché: el siguiente intento empieza de cero.
      this.listo = null
      throw err
    })
    return this.listo
  }

  private arrancar(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let hijo: ChildProcessWithoutNullStreams
      try {
        const ruta = this.escribirScript()
        const lanzar = this.opciones.spawn ?? spawnReal
        hijo = lanzar(
          'powershell.exe',
          ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', ruta],
          { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] },
        ) as ChildProcessWithoutNullStreams
      } catch (err) {
        reject(new HostNoDisponible(`No se pudo lanzar PowerShell: ${mensajeDe(err)}`))
        return
      }

      this.hijo = hijo
      this.buffer = ''
      this.stderr = ''
      let arrancado = false

      const limite = setTimeout(() => {
        if (arrancado) return
        this.matar()
        reject(new HostNoDisponible('PowerShell no terminó de arrancar a tiempo'))
      }, this.opciones.arranqueMs ?? ARRANQUE_POR_DEFECTO_MS)
      limite.unref?.()

      hijo.stdout.setEncoding('utf8')
      hijo.stdout.on('data', (trozo: string) => {
        this.buffer += trozo
        let salto: number
        while ((salto = this.buffer.indexOf('\n')) >= 0) {
          const linea = this.buffer.slice(0, salto).replace(/\r$/, '').replace(/^﻿/, '')
          this.buffer = this.buffer.slice(salto + 1)
          if (linea === 'READY') {
            arrancado = true
            clearTimeout(limite)
            resolve()
          } else {
            this.alRecibir(linea)
          }
        }
      })

      // Lo que PowerShell escribe por stderr es la pista cuando algo sale mal.
      hijo.stderr.setEncoding('utf8')
      hijo.stderr.on('data', (t: string) => {
        this.stderr = (this.stderr + t).slice(-2000)
      })
      // EPIPE al escribir en un host que ya murió no debe tumbar el agente.
      hijo.stdin.on('error', () => {})

      hijo.on('error', (err) => {
        clearTimeout(limite)
        this.hijo = null
        if (!arrancado) reject(new HostNoDisponible(`No se pudo lanzar PowerShell: ${err.message}`))
        else this.rechazarTodo(hijo, new HostSinRespuesta('El proceso de impresión falló'))
      })

      hijo.on('exit', (codigo) => {
        clearTimeout(limite)
        // Solo si SIGUE siendo el actual: un host muerto que avisa tarde no debe
        // borrar la caché ni rechazar los trabajos del que arrancó después.
        if (this.hijo === hijo) {
          this.hijo = null
          this.listo = null
        }
        const detalle = this.stderr.trim()
        if (!arrancado) {
          reject(
            new HostNoDisponible(
              `PowerShell se cerró antes de estar listo (código ${codigo})${detalle ? `: ${detalle}` : ''}`,
            ),
          )
        } else {
          this.rechazarTodo(
            hijo,
            new HostSinRespuesta(
              `El proceso de impresión se cerró inesperadamente (código ${codigo})${detalle ? `: ${detalle}` : ''}`,
            ),
          )
        }
      })
    })
  }

  /** Manda un ticket. Resuelve al `OK`; rechaza con `ErrorDeImpresora` si Windows contesta `ERR`. */
  async imprimir(nombre: string, rutaDelBin: string, timeoutMs: number): Promise<void> {
    await this.asegurar()
    await this.enviar('PRINT', nombre, rutaDelBin, timeoutMs)
  }

  /** Abre y cierra la impresora: paga el primer uso de `winspool` antes del primer ticket. */
  async probar(nombre: string, timeoutMs: number): Promise<void> {
    await this.asegurar()
    await this.enviar('PROBE', nombre, null, timeoutMs)
  }

  private enviar(
    operacion: 'PRINT' | 'PROBE',
    nombre: string,
    ruta: string | null,
    timeoutMs: number,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const hijo = this.hijo
      if (!hijo) {
        // Se cayó entre `asegurar` y aquí: el trabajo no se envió, otro camino es seguro.
        reject(new HostNoDisponible('El proceso de impresión no está en marcha'))
        return
      }
      const id = String(++this.contador)
      const timer = setTimeout(() => {
        if (!this.pendientes.delete(id)) return
        // Un host que no contesta puede estar colgado: se mata y el siguiente
        // ticket arranca uno nuevo. Los demás pendientes se rechazan al salir.
        this.matar()
        reject(
          new HostSinRespuesta(`Tiempo de espera agotado (${Math.round(timeoutMs / 1000)} s)`),
        )
      }, timeoutMs)
      this.pendientes.set(id, { hijo, resolve, reject, timer })

      const campos = [id, operacion, b64(nombre)]
      if (ruta !== null) campos.push(b64(ruta))
      hijo.stdin.write(campos.join('\t') + '\n')
    })
  }

  private alRecibir(linea: string): void {
    const [id, estado, ...resto] = linea.split('\t')
    const p = id ? this.pendientes.get(id) : undefined
    if (!p) return // ruido de PowerShell (avisos, progreso): no es del protocolo
    clearTimeout(p.timer)
    this.pendientes.delete(id!)
    if (estado === 'OK') p.resolve()
    else p.reject(new ErrorDeImpresora(resto.join('\t').trim() || 'Error desconocido de la impresora'))
  }

  private rechazarTodo(hijo: ChildProcessWithoutNullStreams, err: Error): void {
    for (const [id, p] of this.pendientes) {
      if (p.hijo !== hijo) continue
      clearTimeout(p.timer)
      this.pendientes.delete(id)
      p.reject(err)
    }
  }

  private matar(): void {
    const hijo = this.hijo
    this.hijo = null
    this.listo = null
    try {
      hijo?.kill()
    } catch {
      // ya había terminado
    }
  }

  /** Cierra el host (al reiniciar el agente o salir de la app). Los pendientes se rechazan. */
  cerrar(): void {
    const hijo = this.hijo
    if (hijo) this.rechazarTodo(hijo, new HostSinRespuesta('El agente se cerró'))
    this.matar()
    try {
      hijo?.stdin.end()
    } catch {
      // ya cerrado
    }
  }

  /** El nombre lleva un hash del contenido: una versión nueva del script nunca reutiliza uno viejo. */
  private escribirScript(): string {
    const hash = createHash('sha1').update(SCRIPT_HOST).digest('hex').slice(0, 10)
    const ruta = path.join(this.opciones.carpeta ?? os.tmpdir(), `mando-print-host-${hash}.ps1`)
    // Se reescribe siempre: es barato y evita confiar en un fichero a medias
    // (el arranque anterior pudo morir escribiéndolo).
    fs.writeFileSync(ruta, SCRIPT_HOST, 'utf-8')
    return ruta
  }
}

function b64(texto: string): string {
  return Buffer.from(texto, 'utf8').toString('base64')
}

function mensajeDe(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}
