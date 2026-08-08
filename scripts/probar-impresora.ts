/**
 * Imprime un ticket de prueba usando la configuración de `.env`.
 *
 * POR QUÉ EXISTE:
 * Cuando en un local "no imprime", hay dos sospechosos muy distintos: la
 * conexión con el backend o la impresora. Este script quita al backend de la
 * ecuación — no abre ningún socket ni necesita token válido — y ejercita
 * exactamente el mismo `createPrinter()` y el mismo transporte que usa el
 * agente. Si esto imprime, el problema está en la conexión; si no, está en la
 * impresora o en su configuración.
 *
 *   npm run probar:impresora
 *   npm run probar:impresora -- "Nombre exacto de la impresora"
 */

import { loadConfig } from '../src/config'
import { createPrinter } from '../src/printer'

// El token solo hace falta para hablar con el backend, y aquí no se habla con
// él. Sin esto `loadConfig` abortaría por una variable que no usamos.
process.env.MANDO_AGENT_TOKEN ||= 'prueba-local'

const ESC = 0x1b
const GS = 0x1d

function texto(s: string): Buffer {
  // Sin acentos a propósito: la tabla de códigos por defecto varía entre
  // modelos y un ticket de prueba no debe fallar por eso.
  return Buffer.from(s, 'ascii')
}

function construirTicket(descripcion: string): Uint8Array {
  const partes: Buffer[] = [
    Buffer.from([ESC, 0x40]), // ESC @  — reiniciar impresora
    Buffer.from([ESC, 0x61, 0x01]), // ESC a 1 — centrar
    Buffer.from([ESC, 0x21, 0x30]), // ESC ! — doble alto y ancho
    texto('MANDO\n'),
    Buffer.from([ESC, 0x21, 0x00]), // ESC ! — tamano normal
    texto('Prueba de impresion\n'),
    Buffer.from([ESC, 0x61, 0x00]), // ESC a 0 — alinear a la izquierda
    texto('--------------------------------\n'),
    texto(`${descripcion}\n`),
    texto(`Fecha: ${new Date().toLocaleString('es-PE')}\n`),
    texto('--------------------------------\n'),
    texto('Si lees esto, la impresora esta\n'),
    texto('bien configurada.\n'),
    Buffer.from([0x0a, 0x0a, 0x0a, 0x0a]), // avanzar papel antes del corte
    Buffer.from([GS, 0x56, 0x00]), // GS V 0 — corte total
  ]
  return new Uint8Array(Buffer.concat(partes))
}

async function main(): Promise<void> {
  // Un nombre por argumento gana a `.env`, para probar varias impresoras rápido.
  const nombreForzado = process.argv[2]
  if (nombreForzado) {
    process.env.PRINTER_TYPE = 'windows'
    process.env.PRINTER_NAME = nombreForzado
  }

  const config = loadConfig()

  const destino =
    config.printerType === 'windows'
      ? config.printerName
      : config.printerType === 'network'
        ? `${config.printerHost}:${config.printerPort}`
        : config.printerType === 'serial'
          ? config.serialPath
          : config.filePath

  console.log(`Tipo de impresora : ${config.printerType}`)
  console.log(`Destino           : ${destino ?? '(sin configurar)'}`)
  console.log('Enviando ticket de prueba...')

  const printer = await createPrinter(config)
  await printer.print(construirTicket(`Modo: ${config.printerType}`))

  console.log('OK — el ticket se envio sin errores.')
}

main().catch((err: unknown) => {
  console.error('\nFALLO:', err instanceof Error ? err.message : err)
  // Código distinto de 0 para que se note en scripts y en CI.
  process.exit(1)
})
