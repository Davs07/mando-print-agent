/**
 * Trae `@mando/printing` desde el monorepo a `src/vendor/printing/`.
 *
 * POR QUÉ VENDORIZAR Y NO INSTALAR: este agente es un repositorio aparte, así
 * que no puede usar `workspace:*`. Publicar el paquete en un registro privado es
 * el destino, pero exige montar la publicación y meterle credenciales al build
 * local — infraestructura que hoy no existe aquí (este repo no tiene ni CI).
 *
 * Lo que NO se acepta es la alternativa de siempre: copiar a mano y confiar en
 * un comentario que diga «si tocas uno, toca el otro». Eso ya lo intentamos y
 * los dos encoders se separaron igual. Por eso la copia queda registrada con el
 * hash de cada archivo, y `verify-printing.mjs` —que corre antes de los tests—
 * falla si alguien la edita aquí en vez de en el monorepo.
 *
 * Uso:
 *   node scripts/sync-printing.mjs [ruta-al-monorepo]
 *
 * Sin argumento busca `../mando-platform/mando-platform`, o `$MANDO_MONOREPO`.
 */
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const AQUI = dirname(fileURLToPath(import.meta.url))
const RAIZ = resolve(AQUI, '..')
const DESTINO = join(RAIZ, 'src', 'vendor', 'printing')

const candidatos = [
  process.argv[2],
  process.env.MANDO_MONOREPO,
  resolve(RAIZ, '..', 'mando-platform', 'mando-platform'),
  resolve(RAIZ, '..', 'mando-platform'),
].filter(Boolean)

const monorepo = candidatos.find((c) => existsSync(join(c, 'packages', 'printing', 'src')))

if (!monorepo) {
  console.error(
    'No encuentro el monorepo. Pasa la ruta como argumento o define MANDO_MONOREPO.\n' +
      'Buscado en:\n' + candidatos.map((c) => '  ' + c).join('\n'),
  )
  process.exit(1)
}

const ORIGEN = join(monorepo, 'packages', 'printing', 'src')

/** Todos los .ts del paquete, en orden estable para que el manifiesto no baile. */
function archivos(dir, base = dir) {
  const salida = []
  for (const entrada of readdirSync(dir).sort()) {
    const ruta = join(dir, entrada)
    if (statSync(ruta).isDirectory()) salida.push(...archivos(ruta, base))
    else if (entrada.endsWith('.ts') && !entrada.endsWith('.test.ts')) {
      salida.push(relative(base, ruta).split('\\').join('/'))
    }
  }
  return salida
}

const sha = (contenido) => createHash('sha256').update(contenido).digest('hex').slice(0, 16)

rmSync(DESTINO, { recursive: true, force: true })
mkdirSync(DESTINO, { recursive: true })

const manifiesto = { origen: '@mando/printing', archivos: {} }

for (const rel of archivos(ORIGEN)) {
  const desde = join(ORIGEN, rel)
  const hacia = join(DESTINO, rel)
  mkdirSync(dirname(hacia), { recursive: true })
  cpSync(desde, hacia)
  manifiesto.archivos[rel] = sha(readFileSync(desde))
}

try {
  manifiesto.commit = execFileSync('git', ['-C', monorepo, 'rev-parse', '--short', 'HEAD'], {
    encoding: 'utf8',
  }).trim()
} catch {
  manifiesto.commit = 'desconocido'
}

writeFileSync(join(DESTINO, 'manifest.json'), JSON.stringify(manifiesto, null, 2) + '\n')

const n = Object.keys(manifiesto.archivos).length
console.log(`@mando/printing sincronizado: ${n} archivos desde ${manifiesto.commit}`)
