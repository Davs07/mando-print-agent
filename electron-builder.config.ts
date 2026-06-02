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
    artifactName: 'mando-print-agent-windows-x64-setup.${ext}',
  },
  mac: {
    target: [{ target: 'dmg', arch: ['x64', 'arm64'] }],
    icon: 'build/icon.icns',
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
    installerIcon: 'build/icon.ico',
    uninstallerIcon: 'build/icon.ico',
    installerHeaderIcon: 'build/icon.ico',
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
}

export default config
