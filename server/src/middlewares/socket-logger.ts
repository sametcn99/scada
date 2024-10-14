import { Server } from "socket.io"
import { logAppEvents } from "../utils/logger"

/**
 * Middleware function to log socket events.
 *
 * This function logs when a user connects, disconnects, or encounters an error
 * on the socket connection.
 *
 * @param io - The Socket.IO server instance.
 *
 * @example
 * ```typescript
 * import { Server } from "socket.io";
 * import { socketLogger } from "./middlewares/socket-logger";
 *
 * const io = new Server(httpServer);
 * socketLogger(io);
 * ```
 */
export const socketLogger = (io: Server) => {
  io.on("connection", (socket) => {
    logAppEvents(`A user connected: ${socket.id}`)

    socket.on("disconnect", () => {
      logAppEvents(`User disconnected: ${socket.id}`)
    })

    socket.on("error", (err) => {
      logAppEvents(err as Error)
    })
  })
}
