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

### Opción recomendada: app de escritorio

Descarga el instalador desde GitHub Releases:

- Windows: `mando-print-agent-windows-x64-setup.exe`
- macOS Intel: `mando-print-agent-macos-x64.dmg`
- macOS Apple Silicon: `mando-print-agent-macos-arm64.dmg`
- Linux: `mando-print-agent-linux-x64.AppImage`

Abre la app, pega tu token `mpa_...`, configura la impresora y guarda. La app reinicia el agente automáticamente.

### Opción manual: repo y scripts

```bash
npm install
cp .env.example .env
# Editar .env con tu token y configuración de impresora
npm run dev
```

También puedes usar:

- `start.bat` en Windows
- `start.sh` en macOS/Linux

Para producción manual:
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

### Impresora USB instalada como impresora de Windows
La mayoría de las térmicas USB baratas no aparecen como puerto COM: se instalan con su driver como una impresora normal. Para esas:
```env
PRINTER_TYPE=windows
PRINTER_NAME=POS-80C          # el nombre EXACTO de «Dispositivos e impresoras»
PAPER_WIDTH=80mm
```

El agente manda los bytes crudos (ESC/POS) al spooler de Windows con el tipo de datos RAW.
Para eso mantiene **un PowerShell residente** (oculto) que compila el código de `winspool`
una sola vez al abrir la app y recibe los tickets por stdin. Antes lanzaba un PowerShell
nuevo por ticket: medido, entre 1,2 y 2,5 s de mediana por ticket (hasta 5,5 s el primero)
solo en arrancar y compilar; ahora son ~7 ms. El proceso se cierra solo al reiniciar el
agente o salir de la app, y si no se puede usar el residente (directiva de PowerShell,
antivirus) el agente vuelve al modo de un PowerShell por ticket sin perder tickets.

Los tickets se imprimen **de a uno y en el orden en que llegan** (la comanda y el
comprobante de un cobro ya no compiten por la impresora), y el log dice cuánto tardó cada
parte: `impreso correctamente (codificar 4 ms · imprimir 9 ms)`.

Para medir en el local, con la impresora instalada (imprime de verdad, un ticket por medición):
```bash
npx ts-node --transpile-only scripts/medir-impresion.ts "POS-80C"
```
Sin nombre usa una impresora inexistente y mide solo el sobrecosto fijo, sin gastar papel.

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
npm run dist     # Generar instaladores Electron en release/
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
  printer.ts   Transports: NetworkPrinter, SerialPrinter, WindowsPrinter, FilePrinter
  windows-host.ts  PowerShell residente de WindowsPrinter (protocolo por stdin)
  agent.ts     Cliente WebSocket + gestión de trabajos de impresión
  index.ts     Punto de entrada, banner, arranque y apagado limpio
```
