/**
 * Executes an asynchronous function with a specified timeout.
 *
 * @template T - The type of the value returned by the asynchronous function.
 * @param asyncFunc - The asynchronous function to execute.
 * @param timeout - The maximum time (in milliseconds) to wait for the asynchronous function to complete. Defaults to 5000 ms.
 * @returns A promise that resolves to `true` if the asynchronous function completes successfully within the timeout period, or `false` if it fails or times out.
 */
export const withTimeout = async <T>(
  asyncFunc: () => Promise<T>,
  timeout: number = 5000
): Promise<boolean> => {
  try {
    await Promise.race([
      asyncFunc(),
      new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout)),
    ])
    return true // Return true if the async function completes successfully
  } catch {
    return false // Return false if the async function fails or times out
  }
}

/**
 * Returns the current date and time formatted as a string in the format `YYYY-MM-DD_HH-mm-ss`.
 *
 * @returns {string} The formatted date and time string.
 */
export function getFormattedDate(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0') // Months are zero-based in JavaScript dates (0 = January) so we add 1
  const day = String(now.getDate()).padStart(2, '0')

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // YYYY-MM-DD_HH-mm-ss
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}

export const getAppEnvironment = (): string => {
  const env = process.env.NODE_ENV
  if (!env) {
    throw new Error(`NODE_ENV is undefined. Please set the environment variable.`)
  }
  return env
}
