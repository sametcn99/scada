import { instrument } from "@socket.io/admin-ui"
import type { Application, Request, Response } from "express"
import express from "express"
import http, { Server as HttpServer } from "http"
import { join } from "path"
import { Server as SocketIOServer } from "socket.io"
import logger from "./middlewares/logger"
import { socketLogger } from "./middlewares/socket-logger"

/**
 * ExpressServer class sets up and manages an Express application with integrated Socket.IO server.
 *
 * This class is responsible for:
 * - Initializing the Express application and HTTP server.
 * - Setting up Socket.IO server with CORS configuration.
 * - Configuring middlewares and routes.
 * - Starting the server and listening on a specified port.
 * - Emitting events to all connected Socket.IO clients.
 *
 * @class ExpressServer
 */
export class ExpressServer {
  public readonly app: Application
  public readonly server: HttpServer
  private readonly port: number
  private readonly io: SocketIOServer

  constructor(port: number) {
    this.app = express()
    this.app.use(logger)
    this.app.use(express.json()) // Middleware to parse JSON bodies
    this.app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
    this.port = port
    this.server = http.createServer(this.app)

    //#region Setup socket
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
      },
    })
    instrument(this.io, {
      auth: false,
    })
    // #endregion

    this.setupRoutes()
    // this.setupWebSocketEvents()
    socketLogger(this.io)
  }

  /**
   * Sets up the routes for the application.
   *
   * This method configures the route for the root path ("/") to serve an HTML file.
   * When a GET request is made to the root path, the server responds by sending the "index.html" file.
   *
   * @private
   * @returns {void}
   */
  private setupRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      const htmlPath = join(__dirname, "index.html")
      res.sendFile(htmlPath)
    })
  }

  /**
   * Starts the server and listens on the specified port.
   * Once the server is running, it logs a message indicating the URL.
   *
   * @public
   * @returns {void}
   */
  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`)
    })
  }

  /**
   * Emits an event to all connected clients.
   *
   * @param event - The name of the event to emit.
   * @param data - The data to send with the event.
   * @returns void
   */
  public emitEvent(event: string, data: any): void {
    this.io.emit(event, data)
  }
}
