import { useEffect, useState } from 'react'

interface Props {
  initial: Record<string, string> | null
  onSave: (data: Record<string, string>) => Promise<void>
}

type PrinterType = 'network' | 'serial' | 'file'
type PaperWidth = '58mm' | '80mm'
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const DEFAULT: Record<string, string> = {
  MANDO_AGENT_TOKEN: '',
  MANDO_BACKEND_URL: '',
  PRINTER_TYPE: 'network',
  PRINTER_HOST: '',
  PRINTER_PORT: '9100',
  SERIAL_PATH: '',
  SERIAL_BAUD_RATE: '9600',
  PRINTER_FILE_PATH: '',
  PAPER_WIDTH: '80mm',
  HEARTBEAT_INTERVAL_MS: '25000',
  LOG_LEVEL: 'info',
}

export default function PrinterConfigForm({ initial, onSave }: Props) {
  const [form, setForm] = useState<Record<string, string>>(DEFAULT)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initial) setForm({ ...DEFAULT, ...initial })
  }, [initial])

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))
  const printerType = form['PRINTER_TYPE'] as PrinterType

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Configuración</h2>
        <p className="text-xs text-gray-500">
          Pega tu token del panel de Mando, configura la impresora local y guarda para reiniciar el agente.
        </p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-xs text-gray-300 space-y-2">
        <p className="font-semibold text-gray-100">Inicio rápido</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-400">
          <li>Crea el agente en Mando y copia el token `mpa_...`.</li>
          <li>Configura el backend y el tipo de impresora de esta PC.</li>
          <li>Guarda los cambios. La app reinicia el agente automáticamente.</li>
        </ol>
      </div>

      {/* Token */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Token del agente *</span>
        <input
          type="password"
          value={form['MANDO_AGENT_TOKEN']}
          onChange={(e) => set('MANDO_AGENT_TOKEN', e.target.value)}
          placeholder="mpa_xxxx.yyyy"
          required
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        />
      </label>

      {/* Backend URL */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">URL del backend *</span>
        <input
          type="url"
          value={form['MANDO_BACKEND_URL']}
          onChange={(e) => set('MANDO_BACKEND_URL', e.target.value)}
          placeholder="https://mandobusiness-backend-nest.onrender.com"
          required
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        />
      </label>

      {/* Printer type */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Tipo de impresora</span>
        <select
          value={printerType}
          onChange={(e) => set('PRINTER_TYPE', e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        >
          <option value="network">Red (TCP/IP)</option>
          <option value="serial">Puerto serie (USB/COM)</option>
          <option value="file">Archivo (depuración)</option>
        </select>
      </label>

      {/* Network fields */}
      {printerType === 'network' && (
        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">IP / Host</span>
            <input
              type="text"
              value={form['PRINTER_HOST']}
              onChange={(e) => set('PRINTER_HOST', e.target.value)}
              placeholder="192.168.1.100"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1 w-20">
            <span className="text-xs text-gray-400">Puerto</span>
            <input
              type="number"
              value={form['PRINTER_PORT']}
              onChange={(e) => set('PRINTER_PORT', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
        </div>
      )}

      {/* Serial fields */}
      {printerType === 'serial' && (
        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">Puerto serie</span>
            <input
              type="text"
              value={form['SERIAL_PATH']}
              onChange={(e) => set('SERIAL_PATH', e.target.value)}
              placeholder="/dev/ttyUSB0 o COM3"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1 w-24">
            <span className="text-xs text-gray-400">Baudios</span>
            <input
              type="number"
              value={form['SERIAL_BAUD_RATE']}
              onChange={(e) => set('SERIAL_BAUD_RATE', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
        </div>
      )}

      {/* File path */}
      {printerType === 'file' && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Ruta del archivo</span>
          <input
            type="text"
            value={form['PRINTER_FILE_PATH']}
            onChange={(e) => set('PRINTER_FILE_PATH', e.target.value)}
            placeholder="/tmp/output.prn"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </label>
      )}

      {/* Paper width */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Ancho de papel</span>
        <div className="flex gap-2">
          {(['58mm', '80mm'] as PaperWidth[]).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => set('PAPER_WIDTH', w)}
              className={`flex-1 py-1.5 rounded text-sm font-medium border transition-colors ${
                form['PAPER_WIDTH'] === w
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </label>

      {/* Log level */}
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Nivel de log</span>
        <select
          value={form['LOG_LEVEL'] as LogLevel}
          onChange={(e) => set('LOG_LEVEL', e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        >
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
      </label>

      {/* Actions */}
      <div className="flex flex-col gap-2 pt-2 border-t border-gray-800">
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded px-4 py-2 text-sm font-semibold transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar y reiniciar agente'}
        </button>
        <button
          type="button"
          onClick={() => void window.api.openEnvFile()}
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors text-center"
        >
          Abrir archivo .env directamente
        </button>
      </div>
    </form>
  )
}
