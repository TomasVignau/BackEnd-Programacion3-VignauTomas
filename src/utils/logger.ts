import fs from "fs"
import path from "path"

const logsDir = path.join(process.cwd(), "logs")

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

const logFile = path.join(logsDir, "app.log")
const errorFile = path.join(logsDir, "error.log")

function formatMessage(level: string, message: string, extra?: unknown) {
  const timestamp = new Date().toISOString()
  let formatted = `[${timestamp}] [${level}] ${message}`

  if (extra) {
    formatted += ` | Extra: ${JSON.stringify(extra, null, 2)}`
  }

  return formatted + "\n"
}

export const logger = {
  info(message: string, extra?: unknown) {
    const msg = formatMessage("INFO", message, extra)
    console.log(msg.trim()) // Mostrar en consola
    fs.appendFileSync(logFile, msg)
  },

  warn(message: string, extra?: unknown) {
    const msg = formatMessage("WARN", message, extra)
    console.warn(msg.trim())
    fs.appendFileSync(logFile, msg)
  },

  error(message: string, extra?: unknown) {
    const msg = formatMessage("ERROR", message, extra)
    console.error(msg.trim())
    fs.appendFileSync(errorFile, msg)
  }
}
