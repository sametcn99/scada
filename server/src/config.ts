export const allowedOrigins = (): string[] => {
  const origins = ["'https://admin.socket.io'"]
  const ports = [3000, 3001, 3002, 4173, 5173]
  ports.forEach((port) => {
    origins.push(`'http://localhost:${port}'`)
  })
  return origins
}
