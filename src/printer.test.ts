/**
 * Tests para src/printer.ts
 * Prueba los transports de impresora sin hardware real.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// vi.mock es hoisted por Vitest antes de los imports — obligatorio para módulos built-in en ESM
vi.mock('net', () => ({
  createConnection: vi.fn(),
}))

vi.mock('fs', async (importActual) => {
  const actual = await importActual<typeof import('fs')>()
  return {
    ...actual,
    appendFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    unlinkSync: vi.fn(),
    existsSync: vi.fn(() => false),
  }
})

vi.mock('child_process', () => ({
  execFile: vi.fn(),
}))

import * as net from 'net'
import * as fs from 'fs'
import { execFile } from 'child_process'
import { NetworkPrinter, FilePrinter, WindowsPrinter, createPrinter } from '../src/printer'
import type { PrintAgentConfig } from '../src/config'
import { ErrorDeImpresora, HostNoDisponible, HostSinRespuesta, type HostDePowerShell } from '../src/windows-host'

// ─── NetworkPrinter ───────────────────────────────────────────────────────────

describe('NetworkPrinter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('envía los bytes al socket TCP y resuelve la promesa', async () => {
    const writeMock = vi.fn((data: Buffer, cb: (err?: Error | null) => void) => cb())
    const endMock = vi.fn()
    const fakeSocket = {
      write: writeMock,
      end: endMock,
      setTimeout: vi.fn(),
      on: vi.fn(),
      destroy: vi.fn(),
    }

    vi.mocked(net.createConnection).mockImplementation(
      (_opts: any, connectCb?: () => void) => {
        // setImmediate evita TDZ: `const socket = net.createConnection(...)` aún no ha retornado
        setImmediate(() => connectCb?.())
        return fakeSocket as any
      },
    )

    const printer = new NetworkPrinter('192.168.1.10', 9100)
    const bytes = new Uint8Array([0x1b, 0x40, 0x48, 0x65])

    await printer.print(bytes)

    expect(net.createConnection).toHaveBeenCalledWith(
      { host: '192.168.1.10', port: 9100 },
      expect.any(Function),
    )
    expect(writeMock).toHaveBeenCalledWith(Buffer.from(bytes), expect.any(Function))
    expect(endMock).toHaveBeenCalled()
  })

  it('rechaza la promesa cuando el socket reporta error', async () => {
    let capturedErrorHandler: ((e: Error) => void) | undefined
    const fakeSocket = {
      write: vi.fn(),
      end: vi.fn(),
      setTimeout: vi.fn(),
      on: vi.fn((evt: string, h: (e: Error) => void) => {
        if (evt === 'error') capturedErrorHandler = h
      }),
      destroy: vi.fn(),
    }

    vi.mocked(net.createConnection).mockImplementation(
      (_opts: any, _connectCb?: () => void) => {
        // No llamar connectCb — simular que el socket emite error
        setTimeout(() => capturedErrorHandler?.(new Error('ECONNREFUSED')), 0)
        return fakeSocket as any
      },
    )

    const printer = new NetworkPrinter('0.0.0.0', 9999)
    await expect(printer.print(new Uint8Array([0x48]))).rejects.toThrow('ECONNREFUSED')
  })
})

// ─── FilePrinter ──────────────────────────────────────────────────────────────

describe('FilePrinter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('escribe los bytes en el archivo usando appendFileSync', async () => {
    const printer = new FilePrinter('/tmp/test-printer.bin')
    const bytes = new Uint8Array([0x1b, 0x40])

    await printer.print(bytes)

    expect(fs.appendFileSync).toHaveBeenCalledWith('/tmp/test-printer.bin', Buffer.from(bytes))
  })
})

// ─── WindowsPrinter ───────────────────────────────────────────────────────────

describe('WindowsPrinter — camino de siempre (un PowerShell por ticket)', () => {
  const plataformaOriginal = process.platform

  function fingirPlataforma(valor: string): void {
    Object.defineProperty(process, 'platform', { value: valor, configurable: true })
  }

  beforeEach(() => vi.clearAllMocks())
  afterEach(() => fingirPlataforma(plataformaOriginal))

  /** Simula que PowerShell termina bien o con error. */
  function powershellResponde(err: Error | null, stderr = ''): void {
    vi.mocked(execFile).mockImplementation(((
      _file: string,
      _args: string[],
      _opts: unknown,
      cb: (e: Error | null, so: string, se: string) => void,
    ) => {
      cb(err, '', stderr)
      return {} as never
    }) as never)
  }

  it('rechaza fuera de Windows en vez de fallar de forma rara', async () => {
    fingirPlataforma('linux')
    const printer = new WindowsPrinter('POS-80C', undefined, { residente: false })
    await expect(printer.print(new Uint8Array([0x1b]))).rejects.toThrow('solo funciona en Windows')
  })

  it('invoca PowerShell y resuelve cuando la impresión va bien', async () => {
    fingirPlataforma('win32')
    powershellResponde(null)

    await new WindowsPrinter('POS-80C', undefined, { residente: false }).print(new Uint8Array([0x1b, 0x40]))

    const [ejecutable, args] = vi.mocked(execFile).mock.calls[0]!
    expect(ejecutable).toBe('powershell.exe')
    expect(args).toContain('-PrinterName')
    expect(args).toContain('POS-80C')
    // Sin esto falla en equipos con la ejecución de scripts restringida por directiva.
    expect(args).toContain('Bypass')
  })

  /**
   * ⚠️ El nombre de impresora es texto que escribe el usuario. Va como argumento
   * suelto de `execFile`, NUNCA interpolado en una línea de comandos: si se
   * concatenara, un nombre con comillas o `;` ejecutaría lo que quisiera.
   */
  it('pasa el nombre como argumento propio, sin construir una línea de comandos', async () => {
    fingirPlataforma('win32')
    powershellResponde(null)

    const malicioso = 'POS"; Remove-Item C:\\ -Recurse; "'
    await new WindowsPrinter(malicioso, undefined, { residente: false }).print(new Uint8Array([0x1b]))

    const [, args] = vi.mocked(execFile).mock.calls[0]!
    // El nombre viaja íntegro y aislado: PowerShell no lo reinterpreta.
    expect(args).toContain(malicioso)
  })

  it('escribe los bytes en un archivo temporal y lo borra al terminar', async () => {
    fingirPlataforma('win32')
    powershellResponde(null)

    const bytes = new Uint8Array([0x1b, 0x40, 0x41])
    await new WindowsPrinter('POS-80C', undefined, { residente: false }).print(bytes)

    // Los bytes NO van por stdin: PowerShell reinterpretaría la codificación y
    // corrompería el binario de ESC/POS.
    const escrituraDeDatos = vi
      .mocked(fs.writeFileSync)
      .mock.calls.find((c) => Buffer.isBuffer(c[1]))
    expect(escrituraDeDatos?.[1]).toEqual(Buffer.from(bytes))
    expect(fs.unlinkSync).toHaveBeenCalled()
  })

  it('borra el temporal también cuando la impresión falla', async () => {
    fingirPlataforma('win32')
    powershellResponde(new Error('exit 1'), 'No se pudo abrir la impresora')

    await expect(
      new WindowsPrinter('Inexistente', undefined, { residente: false }).print(new Uint8Array([0x1b])),
    ).rejects.toThrow('No se pudo abrir la impresora')

    // Si no se limpiara, cada ticket fallido dejaría basura en %TEMP% para siempre.
    expect(fs.unlinkSync).toHaveBeenCalled()
  })

  it('incluye el detalle de stderr en el error, no solo "falló"', async () => {
    fingirPlataforma('win32')
    powershellResponde(new Error('exit 1'), 'codigo 1801')

    await expect(
      new WindowsPrinter('POS-80C', undefined, { residente: false }).print(new Uint8Array([0x1b])),
    ).rejects.toThrow('1801')
  })
})

describe('WindowsPrinter — con el PowerShell residente', () => {
  const plataformaOriginal = process.platform
  const fingirPlataforma = (valor: string) =>
    Object.defineProperty(process, 'platform', { value: valor, configurable: true })

  /** Un host de mentira: lo que el WindowsPrinter le pide queda anotado. */
  function hostFalso(sobre: Partial<Record<'imprimir' | 'probar', () => Promise<void>>> = {}) {
    return {
      imprimir: vi.fn(sobre.imprimir ?? (async () => {})),
      probar: vi.fn(sobre.probar ?? (async () => {})),
      cerrar: vi.fn(),
    }
  }
  const comoHost = (h: ReturnType<typeof hostFalso>) => h as unknown as HostDePowerShell

  function powershellResponde(): void {
    vi.mocked(execFile).mockImplementation(((
      _f: string,
      _a: string[],
      _o: unknown,
      cb: (e: Error | null, so: string, se: string) => void,
    ) => {
      cb(null, '', '')
      return {} as never
    }) as never)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    fingirPlataforma('win32')
  })
  afterEach(() => fingirPlataforma(plataformaOriginal))

  it('imprime por el residente y NO lanza un PowerShell por ticket', async () => {
    const host = hostFalso()

    await new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).print(new Uint8Array([0x1b, 0x40]))

    expect(host.imprimir).toHaveBeenCalledTimes(1)
    expect(host.imprimir.mock.calls[0]).toEqual(['POS-80C', expect.stringMatching(/mando-ticket-.*\.bin$/), 5000])
    // Esto es lo que ahorra ~2,5 s por ticket.
    expect(execFile).not.toHaveBeenCalled()
  })

  it('los bytes van en un archivo temporal que se borra al terminar', async () => {
    const host = hostFalso()
    const bytes = new Uint8Array([0x1b, 0x40, 0x41])

    await new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).print(bytes)

    const escritura = vi.mocked(fs.writeFileSync).mock.calls.find((c) => Buffer.isBuffer(c[1]))
    expect(escritura?.[1]).toEqual(Buffer.from(bytes))
    expect(fs.unlinkSync).toHaveBeenCalled()
  })

  it('un error de la impresora sale tal cual, con el nombre, y NO cae al otro camino', async () => {
    const host = hostFalso({
      imprimir: async () => {
        throw new ErrorDeImpresora("No se pudo abrir la impresora 'POS-80C' (codigo 1801)")
      },
    })

    await expect(
      new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).print(new Uint8Array([0x1b])),
    ).rejects.toThrow('No se pudo imprimir en "POS-80C": No se pudo abrir la impresora')
    expect(execFile).not.toHaveBeenCalled()
    expect(fs.unlinkSync).toHaveBeenCalled()
  })

  it('si el residente no se puede usar, ese ticket sale por el camino de siempre y no se pierde', async () => {
    const host = hostFalso({
      imprimir: async () => {
        throw new HostNoDisponible('PowerShell se cerró antes de estar listo')
      },
    })
    powershellResponde()

    await new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).print(new Uint8Array([0x1b]))

    expect(execFile).toHaveBeenCalledTimes(1)
  })

  it('tras un fallo de arranque no vuelve a intentar el residente: cada intento costaría su espera', async () => {
    const host = hostFalso({
      imprimir: async () => {
        throw new HostNoDisponible('no arranca')
      },
    })
    powershellResponde()
    const impresora = new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) })

    await impresora.print(new Uint8Array([0x1b]))
    await impresora.print(new Uint8Array([0x1b]))

    expect(host.imprimir).toHaveBeenCalledTimes(1)
    expect(execFile).toHaveBeenCalledTimes(2)
  })

  /**
   * ⚠️ Si el host murió o se colgó CON el trabajo ya enviado no hay forma de
   * saber si la térmica llegó a imprimir. Reintentar por otro camino podría
   * sacar el ticket dos veces — peor que un error que el cajero puede reintentar.
   */
  it('si el residente muere con el ticket ya enviado, falla y NO reintenta por otro camino', async () => {
    const host = hostFalso({
      imprimir: async () => {
        throw new HostSinRespuesta('Tiempo de espera agotado (5 s)')
      },
    })

    await expect(
      new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).print(new Uint8Array([0x1b])),
    ).rejects.toThrow('Tiempo de espera agotado')
    expect(execFile).not.toHaveBeenCalled()
  })

  it('warmUp precalienta abriendo la impresora, sin imprimir nada', async () => {
    const host = hostFalso()

    await new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).warmUp()

    expect(host.probar).toHaveBeenCalledWith('POS-80C', 5000)
    expect(host.imprimir).not.toHaveBeenCalled()
  })

  it('warmUp nunca lanza: un nombre mal escrito no es motivo para abandonar el residente', async () => {
    const host = hostFalso({
      probar: async () => {
        throw new ErrorDeImpresora('No se pudo abrir la impresora (codigo 1801)')
      },
    })
    const impresora = new WindowsPrinter('Mal', 5000, { host: comoHost(host) })

    await expect(impresora.warmUp()).resolves.toBeUndefined()
    await impresora.print(new Uint8Array([0x1b]))

    // Sigue usando el residente: el primer ticket dirá el error de verdad.
    expect(host.imprimir).toHaveBeenCalledTimes(1)
  })

  it('warmUp con un residente que no arranca lo descarta y el primer ticket sale sin esperar', async () => {
    const host = hostFalso({
      probar: async () => {
        throw new HostNoDisponible('no arranca')
      },
    })
    powershellResponde()
    const impresora = new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) })

    await impresora.warmUp()
    await impresora.print(new Uint8Array([0x1b]))

    expect(host.imprimir).not.toHaveBeenCalled()
    expect(execFile).toHaveBeenCalledTimes(1)
  })

  it('warmUp no hace nada fuera de Windows', async () => {
    fingirPlataforma('linux')
    const host = hostFalso()

    await new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).warmUp()

    expect(host.probar).not.toHaveBeenCalled()
  })

  it('close() cierra el residente', () => {
    const host = hostFalso()

    new WindowsPrinter('POS-80C', 5000, { host: comoHost(host) }).close()

    expect(host.cerrar).toHaveBeenCalledTimes(1)
  })
})

// ─── createPrinter factory ────────────────────────────────────────────────────

describe('createPrinter', () => {
  const baseConfig: PrintAgentConfig = {
    token: 'mpag_test',
    backendUrl: 'http://localhost:3001',
    printerType: 'network',
    printerPort: 9100,
    serialBaudRate: 9600,
    heartbeatIntervalMs: 25_000,
    paperWidth: '80mm',
    logLevel: 'info',
  }

  it('lanza error si network sin PRINTER_HOST', async () => {
    await expect(
      createPrinter({ ...baseConfig, printerType: 'network', printerHost: undefined }),
    ).rejects.toThrow('PRINTER_HOST')
  })

  it('lanza error si serial sin SERIAL_PATH', async () => {
    await expect(
      createPrinter({ ...baseConfig, printerType: 'serial', serialPath: undefined }),
    ).rejects.toThrow('SERIAL_PATH')
  })

  it('lanza error si file sin PRINTER_FILE_PATH', async () => {
    await expect(
      createPrinter({ ...baseConfig, printerType: 'file', filePath: undefined }),
    ).rejects.toThrow('PRINTER_FILE_PATH')
  })

  it('devuelve NetworkPrinter cuando printerType=network con host válido', async () => {
    const printer = await createPrinter({
      ...baseConfig,
      printerType: 'network',
      printerHost: '192.168.1.1',
    })
    expect(printer).toBeInstanceOf(NetworkPrinter)
  })

  it('devuelve FilePrinter cuando printerType=file con filePath válido', async () => {
    const printer = await createPrinter({
      ...baseConfig,
      printerType: 'file',
      filePath: '/tmp/out.bin',
    })
    expect(printer).toBeInstanceOf(FilePrinter)
  })

  it('lanza error si windows sin PRINTER_NAME', async () => {
    await expect(
      createPrinter({ ...baseConfig, printerType: 'windows', printerName: undefined }),
    ).rejects.toThrow('PRINTER_NAME')
  })

  it('devuelve WindowsPrinter cuando printerType=windows con nombre válido', async () => {
    const printer = await createPrinter({
      ...baseConfig,
      printerType: 'windows',
      printerName: 'POS-80C',
    })
    expect(printer).toBeInstanceOf(WindowsPrinter)
  })
})
