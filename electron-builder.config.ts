import type { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.mando.print-agent',
  productName: 'Mando Print Agent',
  directories: {
    output: 'release',
    buildResources: 'build',
  },
  /**
   * ⚠️ NO se excluye `node_modules`.
   *
   * Antes había `'!node_modules/**'`, y era una contradicción con
   * `externalizeDepsPlugin()` de `electron.vite.config.ts`: ese plugin deja las
   * dependencias FUERA del bundle para cargarlas en runtime, y esta línea las
   * borraba del instalador. La app empaquetada moría con MODULE_NOT_FOUND al
   * pedir `dotenv` o `socket.io-client`.
   *
   * Coló un tiempo porque un árbol de dependencias desactualizado las acababa
   * bundleando igualmente; al reinstalar con el lockfile, dejó de colar.
   *
   * electron-builder ya incluye solo `dependencies` y descarta
   * `devDependencies`, que es justo lo que se quiere. Por eso React se movió a
   * devDependencies: lo usa el renderer, que va bundleado.
   */
  files: [
    'out/**',
    'package.json',
    '!src/**',
    '!electron/**',
    '!ui/**',
    '!scripts/**',
  ],
  /**
   * Los binarios nativos tienen que quedar fuera del asar: Node no puede cargar
   * un `.node` desde dentro del archivo empaquetado.
   */
  asarUnpack: [
    '**/*.node',
    'node_modules/@serialport/**',
  ],
  extraResources: [
    { from: '.env.example', to: '.env.example' },
    // Lo usa la bandeja del sistema en tiempo de ejecución.
    { from: 'build/icon.png', to: 'icon.png' },
  ],
  /**
   * ⚠️ Los iconos NO se declaran por formato a propósito.
   *
   * Antes apuntaban a `build/icon.ico` y `build/icon.icns`, pero la carpeta
   * `build/` nunca se commiteó: el proyecto **no se podía compilar desde un
   * clone limpio**. Ahora se versiona un único `build/icon.png` grande
   * (1563×1563) y electron-builder deriva el `.ico` y el `.icns` de ahí.
   */
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    artifactName: 'mando-print-agent-windows-x64-setup.${ext}',
  },
  mac: {
    target: [{ target: 'dmg', arch: ['x64', 'arm64'] }],
    artifactName: 'mando-print-agent-macos-${arch}.${ext}',
  },
  linux: {
    target: [{ target: 'AppImage', arch: ['x64'] }],
    icon: 'build/icon.png',
    artifactName: 'mando-print-agent-linux-x64.${ext}',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
  /**
   * El instalador se publica en GitHub Releases, NO dentro del monorepo.
   *
   * ⚠️ Antes el `.exe` vivía commiteado en `apps/web/public/downloads/`. Pesaba
   * 97.8 MiB, contra un límite duro de 100 MiB por archivo en GitHub: cualquier
   * dependencia nueva habría bloqueado el `git push` de **todo el monorepo**.
   * Además Vercel volvía a subirlo en cada deploy de web y la URL estaba fija,
   * así que no había ni versión ni forma de volver atrás.
   *
   * El repo es público, así que los assets se descargan sin token desde
   * `releases/latest/download/<artifactName>`.
   */
  publish: [
    {
      provider: 'github',
      owner: 'Davs07',
      repo: 'mando-print-agent',
      releaseType: 'release',
    },
  ],
}

export default config
