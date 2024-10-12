import { EventEmitter } from "events"
import {
  AttributeIds,
  DataValue,
  MessageSecurityMode,
  OPCUAClient,
  SecurityPolicy,
  TimestampsToReturn,
  type ClientSession,
  type ClientSubscription,
} from "node-opcua"
import { OPCUAEvents } from "../events/opcua.events"

type Events = {
  Connected: void
  Error: Error | string
  DataChanged: string
  Disconnected: void
}

/**
 * A wrapper class for OPC UA Client that extends EventEmitter.
 * This class handles the connection, session creation, subscription, and monitoring of OPC UA nodes.
 *
 * @class OPCUAClientWrapper
 * @extends EventEmitter
 *
 * @example
 * const opcuaClient = new OPCUAClientWrapper("opc.tcp://localhost:4840");
 * await opcuaClient.connect();
 * await opcuaClient.monitorItem("ns=1;s=Temperature");
 */
export class OPCUAClientWrapper extends EventEmitter {
  private client: OPCUAClient
  private endpointUrl: string
  private session: ClientSession | null = null
  private subscription: ClientSubscription | null = null

  // emit<K extends keyof Events>(eventName: K, payload: Events[K]): boolean {
  //   return super.emit(eventName, payload)
  // }

  // on<K extends keyof Events>(
  //   eventName: K,
  //   listener: (payload: Events[K]) => void
  // ): this {
  //   return super.on(eventName, listener)
  // }

  constructor(endpointUrl: string) {
    super()
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false,
    })
    this.endpointUrl = endpointUrl
  }

  /**
   * Establishes a connection to the Matrikon OPC server, creates a session, and sets up a subscription.
   *
   * @throws Will throw an error if the connection, session creation, or subscription setup fails.
   *
   * @emits OPCUAEvents.Connected - When the connection is successfully established.
   * @emits OPCUAEvents.Error - When an error occurs during the connection process.
   *
   * @example
   * ```typescript
   * const opcuaClient = new OPCUAClient();
   * await opcuaClient.connect();
   * ```
   */
  public async connect() {
    try {
      console.log("Matrikon OPC sunucusuna bağlanılıyor...")
      console.log("Bağlantı noktası: ", this.endpointUrl)

      // Bağlantı kur
      await this.client.connect(this.endpointUrl)
      console.log("Matrikon OPC sunucusuna başarıyla bağlanıldı.")

      // Oturum oluştur
      this.session = await this.client.createSession()
      console.log("Oturum başarıyla oluşturuldu.")

      // Abonelik oluştur
      this.subscription = await this.session.createSubscription2({
        requestedPublishingInterval: 1000,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 10,
        maxNotificationsPerPublish: 100,
        publishingEnabled: true,
        priority: 10,
      })

      this.subscription
        .on("keepalive", () => {
          console.log("keepalive")
        })
        .on("terminated", () => {
          console.log("TERMINATED ------------------------------>")
        })

      this.emit(OPCUAEvents.Connected)
    } catch (err) {
      console.error("Hata:", err)
      await this.client.disconnect()
      this.emit(OPCUAEvents.Error, err as Error)
    }
  }

  /**
   * Monitors an OPC UA item for changes and emits an event when the item's value changes.
   *
   * @param nodeId - The NodeId of the item to monitor.
   * @throws {Error} If the subscription is not initialized.
   *
   * The method sets up monitoring parameters and listens for changes in the item's value.
   * When a change is detected, it emits an `OPCUAEvents.DataChanged` event with the new value.
   */
  public async monitorItem(nodeId: string) {
    if (!this.subscription) {
      throw new Error("Subscription is not initialized.")
    }

    const itemToMonitor = {
      nodeId: nodeId,
      attributeId: AttributeIds.Value,
    }

    const parameters = {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100,
    }

    const monitoredItem = await this.subscription.monitor(
      itemToMonitor,
      parameters,
      TimestampsToReturn.Both
    )

    monitoredItem.on("changed", (dataValue: DataValue) => {
      const value = dataValue.value.toString()
      this.emit(OPCUAEvents.DataChanged, value)
    })
  }

  /**
   * Disconnects the OPC UA client and closes the session if it exists.
   *
   * This method performs the following steps:
   * 1. If a session is active, it closes the session and logs "Oturum kapatıldı."
   * 2. Disconnects the OPC UA client and logs "Bağlantı başarıyla kesildi."
   * 3. Emits the `OPCUAEvents.Disconnected` event.
   *
   * @returns {Promise<void>} A promise that resolves when the client is disconnected.
   */
  public async disconnect() {
    if (this.session) {
      await this.session.close()
      console.log("Oturum kapatıldı.")
    }
    await this.client.disconnect()
    console.log("Bağlantı başarıyla kesildi.")
    this.emit(OPCUAEvents.Disconnected)
  }
}
