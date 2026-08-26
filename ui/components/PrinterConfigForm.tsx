import { useEffect, useState } from 'react'

interface Props {
  initial: Record<string, string> | null
  onSave: (data: Record<string, string>) => Promise<void>
}

type DesktopApi = {
  openEnvFile: () => Promise<void>
  listPrinters: () => Promise<string[]>
  testPrint: () => Promise<{ ok: boolean; error?: string }>
}

type PrinterType = 'network' | 'serial' | 'windows' | 'file'
type PaperWidth = '58mm' | '80mm'

const DEFAULT: Record<string, string> = {
  MANDO_AGENT_TOKEN: '',
  MANDO_BACKEND_URL: 'https://api.mando.uno',
  PRINTER_TYPE: 'network',
  PRINTER_HOST: '',
  PRINTER_PORT: '9100',
  SERIAL_PATH: '',
  SERIAL_BAUD_RATE: '9600',
  PRINTER_NAME: '',
  PRINTER_FILE_PATH: '',
  PAPER_WIDTH: '80mm',
  HEARTBEAT_INTERVAL_MS: '25000',
  LOG_LEVEL: 'info',
}

export default function PrinterConfigForm({ initial, onSave }: Props) {
  const [form, setForm] = useState<Record<string, string>>(DEFAULT)
  const [saving, setSaving] = useState(false)
  const [probando, setProbando] = useState(false)
  const [resultadoPrueba, setResultadoPrueba] = useState<{ ok: boolean; error?: string } | null>(null)
  const desktopApi = (window as typeof window & { api?: DesktopApi }).api

  useEffect(() => {
    if (initial) setForm({ ...DEFAULT, ...initial })
  }, [initial])

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))
  /**
   * Antes esto era `=== 'serial' ? 'serial' : 'network'`, que colapsaba
   * cualquier otro valor a `network`. Un `.env` con `PRINTER_TYPE=windows` se
   * mostraba como "Por WiFi o red" y al guardar el formulario lo reescribia,
   * dejando al usuario sin forma de usar ese modo desde la interfaz.
   */
  const printerType: PrinterType = (['network', 'serial', 'windows', 'file'] as const).includes(
    form['PRINTER_TYPE'] as PrinterType,
  )
    ? (form['PRINTER_TYPE'] as PrinterType)
    : 'network'

  /**
   * Impresoras instaladas en el sistema. El modo `windows` exige el nombre
   * EXACTO, y teclearlo mal falla sin dar pista util, asi que se ofrecen en
   * una lista en vez de pedirlo a mano.
   */
  const [impresoras, setImpresoras] = useState<string[]>([])
  const [cargandoImpresoras, setCargandoImpresoras] = useState(false)

  useEffect(() => {
    if (printerType !== 'windows' || !desktopApi?.listPrinters) return
    let vigente = true
    setCargandoImpresoras(true)
    void desktopApi
      .listPrinters()
      .then((lista) => {
        if (vigente) setImpresoras(lista)
      })
      .finally(() => {
        if (vigente) setCargandoImpresoras(false)
      })
    return () => {
      vigente = false
    }
  }, [printerType, desktopApi])

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
          Ingresa tu codigo de vinculacion, elige tu impresora y guarda.
        </p>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3 text-xs text-gray-300 space-y-2">
        <p className="font-semibold text-gray-100">Inicio rapido</p>
        <ol className="list-decimal list-inside space-y-1 text-gray-400">
          <li>Copia tu codigo desde Mando.</li>
          <li>Selecciona como esta conectada tu impresora.</li>
          <li>Guarda los cambios y la app se conectara sola.</li>
        </ol>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Codigo de vinculacion *</span>
        <input
          type="password"
          value={form['MANDO_AGENT_TOKEN']}
          onChange={(e) => set('MANDO_AGENT_TOKEN', e.target.value)}
          placeholder="Pega aqui tu codigo"
          required
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Como esta conectada tu impresora</span>
        <select
          value={printerType}
          onChange={(e) => set('PRINTER_TYPE', e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        >
          <option value="network">Por WiFi o red</option>
          <option value="windows">Por cable USB (instalada en Windows)</option>
          <option value="serial">Por cable USB (puerto COM)</option>
        </select>
        <span className="text-[11px] text-gray-500">
          {printerType === 'windows'
            ? 'La mas comun en termicas USB: aparece en «Dispositivos e impresoras».'
            : printerType === 'serial'
              ? 'Solo si tu impresora aparece como COM1, COM3... en Administrador de dispositivos.'
              : 'La impresora tiene cable de red o WiFi y una IP propia.'}
        </span>
      </label>

      {printerType === 'network' && (
        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">IP de la impresora</span>
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

      {printerType === 'windows' && (
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">Impresora</span>
          {impresoras.length > 0 ? (
            <select
              value={form['PRINTER_NAME']}
              onChange={(e) => set('PRINTER_NAME', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Elige una impresora...</option>
              {/* El nombre guardado puede no estar en la lista si la impresora
                  esta apagada o desconectada; se conserva para no perderlo. */}
              {!impresoras.includes(form['PRINTER_NAME']) && form['PRINTER_NAME'] && (
                <option value={form['PRINTER_NAME']}>
                  {form['PRINTER_NAME']} (no conectada ahora)
                </option>
              )}
              {impresoras.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={form['PRINTER_NAME']}
              onChange={(e) => set('PRINTER_NAME', e.target.value)}
              placeholder="Nombre exacto, tal como figura en Windows"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          )}
          <span className="text-[11px] text-gray-500">
            {cargandoImpresoras
              ? 'Buscando impresoras instaladas...'
              : impresoras.length > 0
                ? 'Elegida de la lista del sistema, asi el nombre siempre coincide.'
                : 'No se encontraron impresoras instaladas. Escribe el nombre exacto.'}
          </span>
        </label>
      )}

      {printerType === 'serial' && (
        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-xs text-gray-400">Puerto USB</span>
            <input
              type="text"
              value={form['SERIAL_PATH']}
              onChange={(e) => set('SERIAL_PATH', e.target.value)}
              placeholder="COM3 o /dev/ttyUSB0"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="flex flex-col gap-1 w-24">
            <span className="text-xs text-gray-400">Velocidad</span>
            <input
              type="number"
              value={form['SERIAL_BAUD_RATE']}
              onChange={(e) => set('SERIAL_BAUD_RATE', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </label>
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-400">Tamano del papel</span>
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

      <div className="flex flex-col gap-2 pt-2 border-t border-gray-800">
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded px-4 py-2 text-sm font-semibold transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar y conectar'}
        </button>

        <button
          type="button"
          disabled={probando}
          onClick={async () => {
            setProbando(true)
            setResultadoPrueba(null)
            try {
              const r = await desktopApi?.testPrint()
              setResultadoPrueba(r ?? { ok: false, error: 'No disponible' })
            } finally {
              setProbando(false)
            }
          }}
          className="border border-gray-700 hover:border-gray-500 disabled:opacity-50 text-gray-200 rounded px-4 py-2 text-sm font-medium transition-colors"
        >
          {probando ? 'Imprimiendo...' : 'Imprimir prueba'}
        </button>

        {resultadoPrueba && (
          <p
            className={`text-xs rounded px-3 py-2 ${
              resultadoPrueba.ok
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900'
                : 'bg-red-950/60 text-red-300 border border-red-900'
            }`}
          >
            {resultadoPrueba.ok
              ? 'Enviado. Si salio el papel impreso, ya quedo configurada.'
              : resultadoPrueba.error}
          </p>
        )}
        <details className="rounded-lg border border-gray-800 bg-gray-900/40 px-3 py-2 text-xs text-gray-400">
          <summary className="cursor-pointer select-none text-gray-300">Opciones avanzadas</summary>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-400">Direccion del servidor</span>
              <input
                type="url"
                value={form['MANDO_BACKEND_URL']}
                onChange={(e) => set('MANDO_BACKEND_URL', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
              />
            </label>
            <button
              type="button"
              onClick={() => void desktopApi?.openEnvFile()}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors text-left"
            >
              Abrir archivo de configuracion
            </button>
          </div>
        </details>
      </div>
    </form>
  )
}
