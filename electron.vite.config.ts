import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        /**
         * ⚠️ El `./` NO es cosmético.
         *
         * Sin él, rollup lee `electron/main.ts` como un import bare del paquete
         * `electron` con subruta `main.ts`, y `externalizeDepsPlugin` externaliza
         * `electron` siempre. El resultado es que el propio punto de entrada
         * queda marcado como externo y el build muere con
         * «Entry module "electron/main.ts" cannot be external», sin transformar
         * un solo módulo.
         *
         * Funcionó durante un tiempo por pura casualidad: vite 8 normalizaba
         * estos ids de otra forma. Al reinstalar con el lockfile (vite 7.3.5)
         * el build dejó de compilar sin que nadie hubiera tocado el código.
         */
        input: { index: './electron/main.ts' },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        // El `./` es obligatorio por el mismo motivo que en `main`.
        input: { index: './electron/preload.ts' },
        /**
         * ⚠️ El preload DEBE salir como CommonJS en `index.js`.
         *
         * Por defecto electron-vite lo emitía como `index.mjs`, pero `main.ts`
         * lo carga desde `../preload/index.js`: no coincidían, el preload no se
         * cargaba nunca y `window.api` quedaba `undefined` en el renderer. La
         * ventana abría igual, así que parecía que la app "arranca pero no
         * funciona" — sin estado, sin token y sin poder guardar nada.
         *
         * Y no vale con renombrarlo a `.mjs`: con `sandbox` activo (el valor
         * por defecto desde Electron 20) los preload en ESM no están
         * soportados. Tiene que ser CJS.
         */
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
  },
  renderer: {
    root: 'ui',
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: 'ui/index.html',
      },
    },
  },
})
