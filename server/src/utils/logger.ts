import * as fs from 'fs'
import * as path from 'path'
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
 * Logs an error message to a JSON file in the logs directory.
 * @param message - The error message or string to log.
 */
export const logAppEvents = (message: Error | string) => {
  const timestamp = new Date().toISOString()

  const logEntry = {
    timestamp,
    name: message instanceof Error ? message.name : 'Message',
    message: message instanceof Error ? message.message : message,
  }

  console.log(logEntry)

  const logFilePath = path.join(logsDir, `${appStartTimestamp}.json`)

  let logData = []
  if (fs.existsSync(logFilePath)) {
    const existingData = fs.readFileSync(logFilePath, 'utf-8')
    logData = JSON.parse(existingData)
  }

  logData.push(logEntry)

  fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2), 'utf-8')
}
