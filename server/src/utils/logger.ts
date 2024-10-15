import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'yaml'
import { getFormattedDate } from './utils'

const workspacePath = process.cwd()
const parentPath = path.dirname(workspacePath)
const logsDir = path.join(parentPath, 'logs')

// Ensure the logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Application start timestamp
const appStartTimestamp = getFormattedDate()

/**
 * Logs an error message to a YAML file in the logs directory.
 * @param message - The error message or string to log.
 */
export const logAppEvents = (
  message: Error | string,
  writeToConsole: boolean = true
) => {
  const timestamp = new Date().toISOString()

  const logEntry = {
    timestamp,
    name: message instanceof Error ? message.name : 'Message',
    message: message instanceof Error ? message.message : message,
  }

  if (writeToConsole) console.log(logEntry)

  const logFilePath = path.join(logsDir, `${appStartTimestamp}.yaml`)

  let logData: { timestamp: string; name: string; message: string }[] = []
  if (fs.existsSync(logFilePath)) {
    const existingData = fs.readFileSync(logFilePath, 'utf-8')
    const parsedData = yaml.parse(existingData)
    logData = Array.isArray(parsedData) ? parsedData : []
  }

  logData.push(logEntry)

  fs.writeFileSync(logFilePath, yaml.stringify(logData), 'utf-8')
}
