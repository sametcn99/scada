import type { Application, Request, Response } from "express"
import express from "express"
import http, { Server as HttpServer } from "http"
import { join } from "path"
import { Socket, Server as SocketIOServer } from "socket.io"

export class ExpressServer {
  public readonly app: Application
  public readonly server: HttpServer
  private readonly port: number
  private readonly io: SocketIOServer

  constructor(port: number) {
    this.app = express()
    this.port = port
    this.server = http.createServer(this.app)
    this.io = new SocketIOServer(this.server)

    this.setupRoutes()
    this.setupWebSocketEvents()
  }

  private setupRoutes(): void {
    this.app.get("/", (req: Request, res: Response) => {
      const htmlPath = join(__dirname, "index.html")
      res.sendFile(htmlPath)
    })
  }

  private setupWebSocketEvents(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("New WebSocket connection")

      // Emit a custom event with data
      this.emitEvent("customEvent", { message: "Hello from server!" })

      socket.on("message", (message: string) => {
        console.log(`Received message: ${message}`)
        socket.send(`Echo: ${message}`)
      })

      socket.on("disconnect", () => {
        console.log("WebSocket connection closed")
      })
    })
  }

  public start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`)
    })
  }

  public emitEvent(event: string, data: any): void {
    this.io.emit(event, data)
  }
}
