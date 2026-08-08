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

describe('WindowsPrinter', () => {
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
    const printer = new WindowsPrinter('POS-80C')
    await expect(printer.print(new Uint8Array([0x1b]))).rejects.toThrow('solo funciona en Windows')
  })

  it('invoca PowerShell y resuelve cuando la impresión va bien', async () => {
    fingirPlataforma('win32')
    powershellResponde(null)

    await new WindowsPrinter('POS-80C').print(new Uint8Array([0x1b, 0x40]))

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
    await new WindowsPrinter(malicioso).print(new Uint8Array([0x1b]))

    const [, args] = vi.mocked(execFile).mock.calls[0]!
    // El nombre viaja íntegro y aislado: PowerShell no lo reinterpreta.
    expect(args).toContain(malicioso)
  })

  it('escribe los bytes en un archivo temporal y lo borra al terminar', async () => {
    fingirPlataforma('win32')
    powershellResponde(null)

    const bytes = new Uint8Array([0x1b, 0x40, 0x41])
    await new WindowsPrinter('POS-80C').print(bytes)

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
      new WindowsPrinter('Inexistente').print(new Uint8Array([0x1b])),
    ).rejects.toThrow('No se pudo abrir la impresora')

    // Si no se limpiara, cada ticket fallido dejaría basura en %TEMP% para siempre.
    expect(fs.unlinkSync).toHaveBeenCalled()
  })

  it('incluye el detalle de stderr en el error, no solo "falló"', async () => {
    fingirPlataforma('win32')
    powershellResponde(new Error('exit 1'), 'codigo 1801')

    await expect(
      new WindowsPrinter('POS-80C').print(new Uint8Array([0x1b])),
    ).rejects.toThrow('1801')
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
