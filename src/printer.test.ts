/**
 * Tests para src/printer.ts
 * Prueba los transports de impresora sin hardware real.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock es hoisted por Vitest antes de los imports — obligatorio para módulos built-in en ESM
vi.mock('net', () => ({
  createConnection: vi.fn(),
}))

vi.mock('fs', async (importActual) => {
  const actual = await importActual<typeof import('fs')>()
  return {
    ...actual,
    appendFileSync: vi.fn(),
  }
})

import * as net from 'net'
import * as fs from 'fs'
import { NetworkPrinter, FilePrinter, createPrinter } from '../src/printer'
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
})
