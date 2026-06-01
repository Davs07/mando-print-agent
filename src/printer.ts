import * as net from 'net'
import * as fs from 'fs'
import type { PrintAgentConfig } from './config'

export interface Printer {
  print(bytes: Uint8Array): Promise<void>
}

// ---------------------------------------------------------------------------
// Impresora de red (Ethernet / WiFi) — TCP puerto 9100
// ---------------------------------------------------------------------------
export class NetworkPrinter implements Printer {
  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly timeoutMs = 5000,
  ) {}

  print(bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      const socket = net.createConnection(
        { host: this.host, port: this.port },
        () => {
          socket.write(Buffer.from(bytes), (err) => {
            if (err) {
              socket.destroy()
              reject(err)
            } else {
              socket.end()
              resolve()
            }
          })
        },
      )

      socket.setTimeout(this.timeoutMs)
      socket.on('timeout', () => {
        socket.destroy()
        reject(
          new Error(
            `Tiempo de espera agotado conectando a ${this.host}:${this.port}`,
          ),
        )
      })
      socket.on('error', reject)
    })
  }
}

// ---------------------------------------------------------------------------
// Impresora serie / USB-Serie (COM3, /dev/usb/lp0, etc.)
// ---------------------------------------------------------------------------
export class SerialPrinter implements Printer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sp: any

  constructor(
    private readonly path: string,
    private readonly baudRate: number,
  ) {}

  async init(): Promise<void> {
    let SerialPort: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      ;({ SerialPort } = require('serialport'))
    } catch {
      throw new Error(
        'El paquete "serialport" no está instalado. Ejecuta: npm install serialport',
      )
    }
    this.sp = new SerialPort({ path: this.path, baudRate: this.baudRate })
    await new Promise<void>((resolve, reject) => {
      this.sp.on('open', resolve)
      this.sp.on('error', reject)
    })
  }

  print(bytes: Uint8Array): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sp.write(Buffer.from(bytes), (err: Error | null) => {
        if (err) {
          reject(err)
        } else {
          this.sp.drain((drainErr: Error | null) => {
            if (drainErr) reject(drainErr)
            else resolve()
          })
        }
      })
    })
  }
}

// ---------------------------------------------------------------------------
// Impresora de archivo (útil para pruebas o impresoras /dev/usb/lp0 en Linux)
// ---------------------------------------------------------------------------
export class FilePrinter implements Printer {
  constructor(private readonly filePath: string) {}

  async print(bytes: Uint8Array): Promise<void> {
    fs.appendFileSync(this.filePath, Buffer.from(bytes))
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------
export async function createPrinter(config: PrintAgentConfig): Promise<Printer> {
  switch (config.printerType) {
    case 'network': {
      if (!config.printerHost) {
        throw new Error(
          'PRINTER_HOST es requerido para el modo de impresora de red',
        )
      }
      return new NetworkPrinter(config.printerHost, config.printerPort)
    }
    case 'serial': {
      if (!config.serialPath) {
        throw new Error(
          'SERIAL_PATH es requerido para el modo de impresora serial',
        )
      }
      const printer = new SerialPrinter(config.serialPath, config.serialBaudRate)
      await printer.init()
      return printer
    }
    case 'file': {
      if (!config.filePath) {
        throw new Error(
          'PRINTER_FILE_PATH es requerido para el modo de impresora de archivo',
        )
      }
      return new FilePrinter(config.filePath)
    }
    default: {
      const exhaustive: never = config.printerType
      throw new Error(`Tipo de impresora desconocido: ${exhaustive}`)
    }
  }
}
