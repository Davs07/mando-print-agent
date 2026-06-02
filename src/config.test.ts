/**
 * Tests para src/config.ts
 * Verifica que loadConfig() valida correctamente las variables de entorno.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Guardar y restaurar env entre tests
const originalEnv = { ...process.env }

function setEnv(overrides: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

function resetEnv() {
  // Restaurar sólo las claves que tocamos
  const KEYS = [
    'MANDO_AGENT_TOKEN',
    'MANDO_BACKEND_URL',
    'PRINTER_TYPE',
    'PRINTER_HOST',
    'PRINTER_PORT',
    'SERIAL_PATH',
    'SERIAL_BAUD_RATE',
    'PRINTER_FILE_PATH',
    'HEARTBEAT_INTERVAL_MS',
    'PAPER_WIDTH',
    'LOG_LEVEL',
  ]
  for (const key of KEYS) {
    if (originalEnv[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = originalEnv[key]
    }
  }
}

// Importar dinámicamente para evitar que dotenv se ejecute en el módulo antes del setup
async function freshLoadConfig() {
  // Limpiar caché para que re-importe con las vars actuales
  const mod = await import('../src/config?t=' + Date.now())
  return mod.loadConfig
}

describe('loadConfig', () => {
  beforeEach(() => resetEnv())
  afterEach(() => resetEnv())

  it('lanza error si MANDO_AGENT_TOKEN no está definido', async () => {
    setEnv({
      MANDO_BACKEND_URL: 'http://localhost:3001',
      MANDO_AGENT_TOKEN: undefined,
    })
    const { loadConfig } = (await vi.importActual('../src/config')) as typeof import('../src/config')
    expect(() => loadConfig()).toThrow('MANDO_AGENT_TOKEN')
  })

  it('usa backend por defecto si MANDO_BACKEND_URL no está definido', async () => {
    setEnv({
      MANDO_AGENT_TOKEN: 'mpag_abc123',
      MANDO_BACKEND_URL: undefined,
      PRINTER_TYPE: 'network',
      PRINTER_HOST: '192.168.1.10',
    })
    const { loadConfig } = (await vi.importActual('../src/config')) as typeof import('../src/config')
    const cfg = loadConfig()
    expect(cfg.backendUrl).toBe('https://mandobusiness-backend-nest.onrender.com')
  })

  it('usa valores por defecto cuando las opcionales no están definidas', async () => {
    setEnv({
      MANDO_AGENT_TOKEN: 'mpag_abc123',
      MANDO_BACKEND_URL: 'http://localhost:3001',
      PRINTER_TYPE: 'network',
      PRINTER_HOST: '192.168.1.10',
    })
    const { loadConfig } = await import('../src/config')
    const cfg = loadConfig()

    expect(cfg.printerPort).toBe(9100)
    expect(cfg.serialBaudRate).toBe(9600)
    expect(cfg.heartbeatIntervalMs).toBe(25_000)
    expect(cfg.paperWidth).toBe('80mm')
    expect(cfg.logLevel).toBe('info')
  })

  it('elimina la barra final de backendUrl', async () => {
    setEnv({
      MANDO_AGENT_TOKEN: 'mpag_abc123',
      MANDO_BACKEND_URL: 'http://localhost:3001/',
    })
    const { loadConfig } = await import('../src/config')
    const cfg = loadConfig()
    expect(cfg.backendUrl).toBe('http://localhost:3001')
  })

  it('lanza error con PRINTER_TYPE inválido', async () => {
    setEnv({
      MANDO_AGENT_TOKEN: 'mpag_abc123',
      MANDO_BACKEND_URL: 'http://localhost:3001',
      PRINTER_TYPE: 'bluetooth',
    })
    const { loadConfig } = await import('../src/config')
    expect(() => loadConfig()).toThrow('PRINTER_TYPE inválido')
  })

  it('lanza error con PAPER_WIDTH inválido', async () => {
    setEnv({
      MANDO_AGENT_TOKEN: 'mpag_abc123',
      MANDO_BACKEND_URL: 'http://localhost:3001',
      PAPER_WIDTH: '100mm',
    })
    const { loadConfig } = await import('../src/config')
    expect(() => loadConfig()).toThrow('PAPER_WIDTH inválido')
  })
})
