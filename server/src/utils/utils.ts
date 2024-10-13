const allowedOrigins = ["http://localhost", "https://localhost", "https://admin.socket.io"]

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false
  return allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
}
