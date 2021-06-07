export default class Logger {
  prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  info(msg: string) {
    this.log('INFO', msg)
  }

  warn(msg: string) {
    this.log('WARN', msg)
  }

  error(error: string | Error) {
    this.log('ERROR', error)
  }

  private log(level: string, msg: string | Error ) {
    if (msg instanceof Error) {
      console.error(`[${this.now()}] [${level}] ${this.prefix} ${msg.message} \n ${msg.stack}`)
    }
    else {
      console.error(`[${this.now()}] [${level}] ${this.prefix} ${msg}`)
    }
  }

  private now() {
    return new Date().toISOString()
  }
}
