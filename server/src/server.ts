import { instrument } from '@socket.io/admin-ui'
import type { Application, Request, Response } from 'express'
import express from 'express'
import http, { Server as HttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { socketLogger, expressLogger } from './middlewares'
import { logAppEvents } from './utils/logger'

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
    this.app.use(expressLogger) // Middleware to log http requests
    this.app.use(express.json()) // Middleware to parse JSON bodies
    this.app.use(express.urlencoded({ extended: true })) // Middleware to parse URL-encoded bodies
    this.port = port
    this.server = http.createServer(this.app)

    //#region Setup socket
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: ['https://admin.socket.io', 'http://localhost:5173'],
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
    this.app.get('/', (req: Request, res: Response) => {
      res.json({ message: 'Hello, World!' })
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
      logAppEvents(`Express Server is running on http://localhost:${this.port}`)
    })
  }

  /**
   * Emits an event to all connected clients.
   *
   * @param event - The name of the event to emit.
   * @param data - The data to send with the event.
   * @returns void
   */
  public emitEvent<T>(event: string, data: T): void {
    this.io.emit(event, data)
  }
}
