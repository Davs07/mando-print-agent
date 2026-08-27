/**
 * Comprueba que la copia de `@mando/printing` no se haya editado aquí.
 *
 * Es lo que convierte «vendorizar» en algo distinto de «copiar y rezar». La
 * forma en que los dos encoders de comanda se separaron fue exactamente esta:
 * alguien corrigió el tamaño de letra en un sitio y el otro se quedó atrás, con
 * un comentario pidiendo sincronizarlos que nadie leyó a tiempo.
 *
 * Corre antes de los tests. Si falla, el arreglo NO es editar `src/vendor/`:
 * es tocar el paquete en el monorepo y volver a sincronizar.
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const AQUI = dirname(fileURLToPath(import.meta.url))
const DESTINO = resolve(AQUI, '..', 'src', 'vendor', 'printing')
const MANIFIESTO = join(DESTINO, 'manifest.json')

if (!existsSync(MANIFIESTO)) {
  console.error(
    'Falta la copia de @mando/printing.\n' +
      'Ejecuta:  node scripts/sync-printing.mjs [ruta-al-monorepo]',
  )
  process.exit(1)
}

const manifiesto = JSON.parse(readFileSync(MANIFIESTO, 'utf8'))
const sha = (c) => createHash('sha256').update(c).digest('hex').slice(0, 16)

const problemas = []

for (const [rel, esperado] of Object.entries(manifiesto.archivos)) {
  const ruta = join(DESTINO, rel)
  if (!existsSync(ruta)) {
    problemas.push(`  falta: ${rel}`)
    continue
  }
  const actual = sha(readFileSync(ruta))
  if (actual !== esperado) problemas.push(`  editado a mano: ${rel}`)
}

if (problemas.length > 0) {
  console.error(
    'La copia de @mando/printing no coincide con lo que se sincronizó:\n' +
      problemas.join('\n') +
      '\n\nEsta carpeta es una COPIA. Los cambios van en el monorepo,\n' +
      'en packages/printing, y luego:  node scripts/sync-printing.mjs\n',
  )
  process.exit(1)
}

console.log(
  `@mando/printing intacto: ${Object.keys(manifiesto.archivos).length} archivos (${manifiesto.commit})`,
)
