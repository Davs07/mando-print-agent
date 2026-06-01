import type { Configuration } from 'electron-builder'

const config: Configuration = {
  appId: 'com.mando.print-agent',
  productName: 'Mando Print Agent',
  directories: {
    output: 'release',
    buildResources: 'build',
  },
  files: [
    'out/**',
    'package.json',
    '!node_modules/**',
    '!src/**',
    '!electron/**',
    '!ui/**',
  ],
  extraResources: [
    { from: '.env.example', to: '.env.example' },
  ],
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    icon: 'build/icon.ico',
  },
  mac: {
    target: [{ target: 'dmg', arch: ['x64', 'arm64'] }],
    icon: 'build/icon.icns',
  },
  linux: {
    target: [{ target: 'AppImage', arch: ['x64'] }],
    icon: 'build/icon.png',
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'build/icon.ico',
    uninstallerIcon: 'build/icon.ico',
    installerHeaderIcon: 'build/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
}

export default config
