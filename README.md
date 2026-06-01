# mando-print-agent

Agente de impresión local para la plataforma Mando. Se ejecuta como un proceso Node.js en la máquina del punto de venta, conectándose al backend de Mando vía WebSocket y gestionando los trabajos de impresión en impresoras térmicas locales.

## Arquitectura

```
Backend Mando  ──WebSocket /print-agent──▶  mando-print-agent  ──TCP/Serial/Archivo──▶  Impresora térmica
```

El agente:
1. Autentica con un token `mpa_...` generado desde el panel de administración
2. Mantiene conexión persistente al namespace `/print-agent` del backend
3. Recibe trabajos `print:job` (RECEIPT o KITCHEN) con datos del pedido
4. Codifica el ticket en ESC/POS y lo envía a la impresora configurada
5. Responde con `print:result` indicando éxito o error

## Instalación

```bash
npm install
cp .env.example .env
# Editar .env con tu token y configuración de impresora
npm run dev
```

Para producción:
```bash
npm run build
npm start
```

## Configuración (`.env`)

| Variable | Requerida | Descripción | Valor por defecto |
|----------|-----------|-------------|-------------------|
| `MANDO_AGENT_TOKEN` | ✅ | Token generado en el panel de Ajustes → Impresoras → Agente | — |
| `MANDO_BACKEND_URL` | ✅ | URL del backend Mando (sin barra final) | — |
| `PRINTER_TYPE` | | Tipo de transporte: `network`, `serial`, `file` | `network` |
| `PRINTER_HOST` | Si `network` | IP de la impresora en red | — |
| `PRINTER_PORT` | | Puerto TCP | `9100` |
| `SERIAL_PATH` | Si `serial` | Puerto serie, ej. `COM3` o `/dev/usb/lp0` | — |
| `SERIAL_BAUD_RATE` | | Velocidad del puerto serie | `9600` |
| `PRINTER_FILE_PATH` | Si `file` | Ruta del archivo de salida (pruebas) | — |
| `PAPER_WIDTH` | | Ancho del papel: `58mm` o `80mm` | `80mm` |
| `HEARTBEAT_INTERVAL_MS` | | Intervalo de latido con el servidor | `25000` |
| `LOG_LEVEL` | | Verbosidad: `debug`, `info`, `warn`, `error` | `info` |

## Ejemplos de configuración

### Impresora de red (Ethernet/WiFi)
```env
MANDO_AGENT_TOKEN=mpa_xxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyy
MANDO_BACKEND_URL=https://api.mando.app
PRINTER_TYPE=network
PRINTER_HOST=192.168.1.100
PRINTER_PORT=9100
PAPER_WIDTH=80mm
```

### Impresora USB/Serie (Windows)
```env
MANDO_AGENT_TOKEN=mpa_xxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyy
MANDO_BACKEND_URL=https://api.mando.app
PRINTER_TYPE=serial
SERIAL_PATH=COM3
SERIAL_BAUD_RATE=9600
PAPER_WIDTH=58mm
```

### Modo archivo (desarrollo/pruebas)
```env
MANDO_AGENT_TOKEN=mpa_xxxxxxxxxxxx.yyyyyyyyyyyyyyyyyyy
MANDO_BACKEND_URL=http://localhost:3001
PRINTER_TYPE=file
PRINTER_FILE_PATH=./output.bin
```

## Desarrollo

```bash
npm run dev      # ts-node-dev con recarga automática
npm test         # Tests unitarios con Vitest
npm run lint     # Verificación de tipos TypeScript
npm run build    # Compilar a dist/
```

## Generación de token

1. En el panel de Mando: **Ajustes → Dispositivos → Agente de Impresión**
2. Clic en **Registrar nuevo agente**
3. Copiar el token generado (solo se muestra una vez)
4. Pegarlo en `MANDO_AGENT_TOKEN` del `.env`

## Estructura del proyecto

```
src/
  config.ts    Carga y valida variables de entorno
  escpos.ts    Codificación ESC/POS de tickets (puerto del frontend)
  printer.ts   Transports: NetworkPrinter, SerialPrinter, FilePrinter
  agent.ts     Cliente WebSocket + gestión de trabajos de impresión
  index.ts     Punto de entrada, banner, arranque y apagado limpio
```
