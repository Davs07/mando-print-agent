/**
 * Tests de src/windows-host.ts — el PowerShell residente de la impresora de Windows.
 *
 * Dos capas:
 *  - Con un `spawn` simulado: el protocolo, los timeouts y las carreras, que con
 *    un PowerShell de verdad serían lentos y poco deterministas.
 *  - Con PowerShell DE VERDAD (solo en Windows): que el script compila, que el
 *    nombre viaja íntegro y que el segundo ticket ya no paga el arranque.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { EventEmitter } from 'events'
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import {
  CODIGO_CSHARP,
  ErrorDeImpresora,
  HostDePowerShell,
  HostNoDisponible,
  HostSinRespuesta,
  SCRIPT_HOST,
} from './windows-host'

// ─── Un hijo de mentira ───────────────────────────────────────────────────────

function hijoFalso() {
  const stdout = Object.assign(new EventEmitter(), { setEncoding: () => {} })
  const stderr = Object.assign(new EventEmitter(), { setEncoding: () => {} })
  const escritos: string[] = []
  const stdin = Object.assign(new EventEmitter(), {
    write: vi.fn((linea: string) => {
      escritos.push(linea)
      return true
    }),
    end: vi.fn(),
  })
  const hijo: any = Object.assign(new EventEmitter(), { stdout, stderr, stdin })
  hijo.kill = vi.fn(() => {
    queueMicrotask(() => hijo.emit('exit', null))
    return true
  })
  return {
    hijo,
    escritos,
    /** Lo que PowerShell escribe por stdout. */
    hablar: (texto: string) => stdout.emit('data', texto),
    /** Lo que escribe por stderr. */
    quejarse: (texto: string) => stderr.emit('data', texto),
    morir: (codigo: number | null) => hijo.emit('exit', codigo),
    /** Responde al último ticket enviado. */
    responderUltimo: (estado: 'OK' | string) => {
      const id = escritos[escritos.length - 1]!.split('\t')[0]
      stdout.emit('data', estado === 'OK' ? `${id}\tOK\r\n` : `${id}\tERR\t${estado}\r\n`)
    },
  }
}

type Falso = ReturnType<typeof hijoFalso>

function crearHost(...hijos: Falso[]) {
  const cola = [...hijos]
  const spawn = vi.fn(() => cola.shift()!.hijo)
  const host = new HostDePowerShell({ spawn: spawn as never, carpeta: os.tmpdir(), arranqueMs: 1000 })
  return { host, spawn }
}

const decodificar = (b64: string) => Buffer.from(b64, 'base64').toString('utf8')

describe('HostDePowerShell (spawn simulado)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('arranca UNA vez y reutiliza el mismo proceso para todos los tickets', async () => {
    const a = hijoFalso()
    const { host, spawn } = crearHost(a)

    const p1 = host.imprimir('POS-80C', 'C:\\t\\1.bin', 5000)
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')
    await p1

    const p2 = host.imprimir('POS-80C', 'C:\\t\\2.bin', 5000)
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')
    await p2

    // Esto es todo el ahorro: un solo arranque de PowerShell para N tickets.
    expect(spawn).toHaveBeenCalledTimes(1)
    expect(a.escritos).toHaveLength(2)
  })

  it('espera al READY antes de mandar el primer ticket', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('POS-80C', 'C:\\t\\1.bin', 5000)
    await vi.advanceTimersByTimeAsync(500)
    expect(a.escritos).toHaveLength(0) // todavía compilando

    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    expect(a.escritos).toHaveLength(1)
    a.responderUltimo('OK')
    await p
  })

  it('el nombre y la ruta viajan en base64: tabuladores, comillas y acentos llegan íntegros', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)
    const raro = 'Impresión "POS"\t80C; Remove-Item C:\\ -Recurse'

    const p = host.imprimir(raro, 'C:\\Users\\Ñandú\\t.bin', 5000)
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')
    await p

    // Una línea, con exactamente 4 campos: el tabulador del nombre no rompió el protocolo.
    const linea = a.escritos[0]!
    expect(linea.endsWith('\n')).toBe(true)
    const campos = linea.trimEnd().split('\t')
    expect(campos).toHaveLength(4)
    expect(campos[1]).toBe('PRINT')
    expect(decodificar(campos[2]!)).toBe(raro)
    expect(decodificar(campos[3]!)).toBe('C:\\Users\\Ñandú\\t.bin')
  })

  it('un ERR de Windows llega como ErrorDeImpresora con el mensaje tal cual', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('Mal', 'C:\\t\\1.bin', 5000)
    p.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo("No se pudo abrir la impresora 'Mal' (codigo 1801)")

    await expect(p).rejects.toBeInstanceOf(ErrorDeImpresora)
    await expect(p).rejects.toThrow('codigo 1801')
  })

  it('un ERR no tumba el residente: el ticket siguiente sale en el mismo proceso', async () => {
    const a = hijoFalso()
    const { host, spawn } = crearHost(a)

    const p1 = host.imprimir('Mal', 'C:\\t\\1.bin', 5000)
    p1.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('falló')
    await p1.catch(() => {})

    const p2 = host.imprimir('Bien', 'C:\\t\\2.bin', 5000)
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')
    await p2

    expect(spawn).toHaveBeenCalledTimes(1)
  })

  it('varios tickets a la vez se responden cada uno con el suyo, aunque lleguen desordenados', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p1 = host.imprimir('P', 'C:\\1.bin', 5000)
    const p2 = host.imprimir('P', 'C:\\2.bin', 5000)
    p2.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    const [id1, id2] = a.escritos.map((l) => l.split('\t')[0])

    a.hablar(`${id2}\tERR\tfalló el segundo\r\n${id1}\tOK\r\n`)

    await expect(p1).resolves.toBeUndefined()
    await expect(p2).rejects.toThrow('falló el segundo')
  })

  it('ignora el ruido de PowerShell y las líneas partidas entre trozos', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('P', 'C:\\1.bin', 5000)
    a.hablar('AVISO: algo que no es del protocolo\r\nREA')
    a.hablar('DY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    const id = a.escritos[0]!.split('\t')[0]
    a.hablar(`${id}\t`)
    a.hablar('OK\r\n')

    await expect(p).resolves.toBeUndefined()
  })

  it('un BOM al inicio de la salida no impide reconocer READY', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('P', 'C:\\1.bin', 5000)
    a.hablar('\uFEFFREADY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')

    await expect(p).resolves.toBeUndefined()
  })

  // ─── Cuando no se puede usar ───────────────────────────────────────────────

  it('si PowerShell muere antes del READY es HostNoDisponible, con la pista de stderr', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('P', 'C:\\1.bin', 5000)
    p.catch(() => {})
    a.quejarse('La ejecución de scripts está deshabilitada en este sistema')
    a.morir(1)

    await expect(p).rejects.toBeInstanceOf(HostNoDisponible)
    await expect(p).rejects.toThrow('deshabilitada')
    expect(a.escritos).toHaveLength(0) // el trabajo nunca se envió
  })

  it('un arranque fallido no queda en caché: el siguiente intento lanza otro proceso', async () => {
    const a = hijoFalso()
    const b = hijoFalso()
    const { host, spawn } = crearHost(a, b)

    const p1 = host.asegurar()
    p1.catch(() => {})
    a.morir(1)
    await p1.catch(() => {})

    const p2 = host.asegurar()
    b.hablar('READY\r\n')
    await p2

    expect(spawn).toHaveBeenCalledTimes(2)
  })

  it('si no contesta READY a tiempo lo mata y es HostNoDisponible', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.asegurar()
    p.catch(() => {})
    await vi.advanceTimersByTimeAsync(1500)

    await expect(p).rejects.toBeInstanceOf(HostNoDisponible)
    expect(a.hijo.kill).toHaveBeenCalled()
  })

  it('si el spawn mismo lanza (no hay powershell.exe) es HostNoDisponible', async () => {
    const spawn = vi.fn(() => {
      throw new Error('spawn powershell.exe ENOENT')
    })
    const host = new HostDePowerShell({ spawn: spawn as never, carpeta: os.tmpdir() })

    await expect(host.asegurar()).rejects.toBeInstanceOf(HostNoDisponible)
  })

  // ─── Cuando se cuelga o muere con trabajo en vuelo ─────────────────────────

  it('un ticket sin respuesta: HostSinRespuesta, mata el host y el siguiente arranca uno nuevo', async () => {
    const a = hijoFalso()
    const b = hijoFalso()
    const { host, spawn } = crearHost(a, b)

    const p1 = host.imprimir('P', 'C:\\1.bin', 3000)
    p1.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(3500)

    await expect(p1).rejects.toBeInstanceOf(HostSinRespuesta)
    expect(a.hijo.kill).toHaveBeenCalled()

    const p2 = host.imprimir('P', 'C:\\2.bin', 3000)
    b.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    b.responderUltimo('OK')
    await p2

    expect(spawn).toHaveBeenCalledTimes(2)
  })

  it('si el host muere con el ticket en vuelo es HostSinRespuesta (no se sabe si imprimió)', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('P', 'C:\\1.bin', 5000)
    p.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.morir(1)

    await expect(p).rejects.toBeInstanceOf(HostSinRespuesta)
  })

  /**
   * La carrera que un diseño ingenuo pierde: el host viejo avisa de su muerte
   * DESPUÉS de que ya arrancó el nuevo. Ese `exit` tardío no debe rechazar los
   * trabajos del nuevo ni borrar su caché (lanzaría un tercer PowerShell).
   */
  it('el exit tardío de un host muerto no toca los trabajos del host nuevo', async () => {
    const a = hijoFalso()
    const b = hijoFalso()
    a.hijo.kill = vi.fn(() => true) // no avisa al instante: avisará tarde
    const { host, spawn } = crearHost(a, b)

    const p1 = host.imprimir('P', 'C:\\1.bin', 1000)
    p1.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(1500) // p1 caduca, se mata `a`
    await p1.catch(() => {})

    const p2 = host.imprimir('P', 'C:\\2.bin', 5000)
    b.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)

    a.morir(1) // ← el exit tardío del viejo, con p2 en vuelo en el nuevo

    b.responderUltimo('OK')
    await expect(p2).resolves.toBeUndefined()

    const p3 = host.imprimir('P', 'C:\\3.bin', 5000)
    await vi.advanceTimersByTimeAsync(0)
    b.responderUltimo('OK')
    await p3
    expect(spawn).toHaveBeenCalledTimes(2) // y no 3
  })

  it('cerrar() rechaza lo pendiente, mata el proceso y cierra su stdin', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.imprimir('P', 'C:\\1.bin', 5000)
    p.catch(() => {})
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    host.cerrar()

    await expect(p).rejects.toBeInstanceOf(HostSinRespuesta)
    expect(a.hijo.kill).toHaveBeenCalled()
    expect(a.hijo.stdin.end).toHaveBeenCalled()
  })

  it('probar() manda PROBE sin ruta', async () => {
    const a = hijoFalso()
    const { host } = crearHost(a)

    const p = host.probar('POS-80C', 5000)
    a.hablar('READY\r\n')
    await vi.advanceTimersByTimeAsync(0)
    a.responderUltimo('OK')
    await p

    const campos = a.escritos[0]!.trimEnd().split('\t')
    expect(campos[1]).toBe('PROBE')
    expect(campos).toHaveLength(3)
    expect(decodificar(campos[2]!)).toBe('POS-80C')
  })
})

describe('el script del host', () => {
  it('comparte el C# con el script de un solo uso: un arreglo vale para los dos', () => {
    expect(SCRIPT_HOST).toContain(CODIGO_CSHARP)
  })

  it('lleva sus barras invertidas intactas (la regex de saltos de línea no se corrompe)', () => {
    expect(SCRIPT_HOST).toContain("-replace '[\\r\\n]+'")
  })

  it('el here-string cierra en la columna 0, que es lo que exige PowerShell', () => {
    expect(SCRIPT_HOST).toMatch(/\n'@\n/)
  })
})

// ─── PowerShell de verdad ─────────────────────────────────────────────────────

describe.skipIf(process.platform !== 'win32')('HostDePowerShell (PowerShell real, solo Windows)', () => {
  let host: HostDePowerShell
  let bin: string

  beforeEach(() => {
    host = new HostDePowerShell()
    bin = path.join(os.tmpdir(), `mando-test-host-${process.pid}-${Date.now()}.bin`)
    fs.writeFileSync(bin, Buffer.from([0x1b, 0x40, 0x0a]))
  })
  afterEach(() => {
    host.cerrar()
    try {
      fs.unlinkSync(bin)
    } catch {
      // ya no estaba
    }
  })

  it(
    'compila el C#, devuelve el error real de Windows y el segundo ticket ya no paga el arranque',
    async () => {
      // Impresora que no existe: ejerce TODO el camino (arranque, Add-Type,
      // protocolo, OpenPrinter) sin sacar papel.
      const inexistente = 'IMPRESORA-QUE-NO-EXISTE'

      const primero = await host.imprimir(inexistente, bin, 60_000).catch((e: Error) => e)
      expect(primero).toBeInstanceOf(ErrorDeImpresora)
      expect((primero as Error).message).toContain('1801')
      expect((primero as Error).message).toContain(inexistente)

      const t0 = Date.now()
      const segundo = await host.imprimir(inexistente, bin, 60_000).catch((e: Error) => e)
      const ms = Date.now() - t0

      expect(segundo).toBeInstanceOf(ErrorDeImpresora)
      // El camino de un-PowerShell-por-ticket costaba una mediana de 2 535 ms.
      expect(ms).toBeLessThan(500)
    },
    120_000,
  )

  it(
    'un nombre con acentos y comillas llega íntegro hasta Windows (la codificación no lo rompe)',
    async () => {
      const nombre = 'Impresión "rara" ñandú'

      const err = await host.imprimir(nombre, bin, 60_000).catch((e: Error) => e)

      expect(err).toBeInstanceOf(ErrorDeImpresora)
      // El mensaje vuelve por stdout en UTF-8: si algo se corrompiera, no coincidiría.
      expect((err as Error).message).toContain(nombre)
    },
    120_000,
  )

  it(
    'PROBE abre y cierra la impresora: con una inexistente falla igual que un ticket',
    async () => {
      await expect(host.probar('IMPRESORA-QUE-NO-EXISTE', 60_000)).rejects.toBeInstanceOf(ErrorDeImpresora)
    },
    120_000,
  )

  it(
    'cerrar() termina el proceso: no queda un PowerShell huérfano',
    async () => {
      await host.probar('IMPRESORA-QUE-NO-EXISTE', 60_000).catch(() => {})
      host.cerrar()
      // Un ticket posterior arranca uno nuevo en vez de escribir en un host muerto.
      const err = await host.imprimir('IMPRESORA-QUE-NO-EXISTE', bin, 60_000).catch((e: Error) => e)
      expect(err).toBeInstanceOf(ErrorDeImpresora)
    },
    180_000,
  )
})
