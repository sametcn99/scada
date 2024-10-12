import { EventEmitter } from "events"
import type { ClientSession, ClientSubscription, MonitoringParametersOptions, ReadValueIdOptions } from "node-opcua"
import { AttributeIds, DataValue, MessageSecurityMode, OPCUAClient, SecurityPolicy, TimestampsToReturn } from "node-opcua"
import ora from "ora"

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
  private session: ClientSession | undefined
  private subscription: ClientSubscription | undefined

  constructor(endpointUrl: string) {
    super() // Call the parent class constructor
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false,
    })
    this.endpointUrl = endpointUrl
  }

  // #region EventEmitter methods override for type safety and better intellisense
  emit<K extends keyof Events>(eventName: K, payload?: Events[K]): boolean {
    return super.emit(eventName, payload)
  }
  on<K extends keyof Events>(eventName: K, listener: (payload: Events[K]) => void): this {
    return super.on(eventName, listener)
  }
  // #endregion

  // #region Connect method
  /** Establishes a connection to the Matrikon OPC server, creates a session, and sets up a subscription.
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
    const spinner = ora("Connecting to OPC server...").start()
    try {
      spinner.text = "Connecting to OPC server...\n" + "Endpoint: " + this.endpointUrl

      // Establish connection
      await this.client.connect(this.endpointUrl)
      spinner.succeed("Connection successful.\n" + this.endpointUrl)

      // Create session
      this.session = await this.client.createSession()
      spinner.succeed("Session successfully created.")

      // We call the createSubscription2 method to create a subscription in the OPC UA client.
      // This method creates a subscription with specific parameters, and this subscription is used to receive data changes from the server at a specific publishing interval.
      this.subscription = await this.session.createSubscription2({
        requestedPublishingInterval: 1000, // Publishing interval in ms
        requestedLifetimeCount: 100, // 100 publishing cycles
        requestedMaxKeepAliveCount: 10, // Maximum keep-alive count for the subscription. This specifies how many cycles the server will send keep-alive messages if no data is sent to the client.
        maxNotificationsPerPublish: 100, // Maximum number of notifications per publishing cycle. This limits the maximum number of notifications that can be sent in a publishing cycle.
        publishingEnabled: true, // Determines whether the subscription is publishing enabled. true: The subscription has publishing enabled.
        priority: 10, // Helps the server prioritize among multiple subscriptions.
      })

      this.subscription
        .on("keepalive", () => {
          console.log("keepalive")
        })
        .on("terminated", () => {
          console.log("TERMINATED ------------------------------>")
        })

      this.emit("Connected")
    } catch (err) {
      await this.client.disconnect()
      this.emit("Error", err as Error)
    }
  }
  // #endregion

  // #region MonitorItem method
  /** Monitors an OPC UA item for changes and emits an event when the item's value changes.
   * @param nodeId - The NodeId of the item to monitor.
   * @throws {Error} If the subscription is not initialized.
   *
   * The method sets up monitoring parameters and listens for changes in the item's value.
   * When a change is detected, it emits an `OPCUAEvents.DataChanged` event with the new value.
   */
  public async monitorItem(nodeId: string) {
    if (!this.subscription) throw new Error("Subscription is not initialized.")

    const itemToMonitor: ReadValueIdOptions = {
      nodeId: nodeId, // The unique identifier of the item to be monitored. This identifier represents a specific node in the OPC UA server.
      attributeId: AttributeIds.Value, // Specifies which attribute of the item to monitor. This indicates that the value attribute of the item will be monitored.
    }

    const requestedParameters: MonitoringParametersOptions = {
      samplingInterval: 100, // Specifies the sampling interval in milliseconds. In this example, it is set to 100 milliseconds.
      discardOldest: true, // Determines whether the oldest items should be discarded when the queue is full. true: The oldest items will be discarded when the queue is full.
      queueSize: 100, // Specifies the maximum size of the queue. In this example, the queue size is set to 100.
    }

    const monitoredItem = await this.subscription.monitor(itemToMonitor, requestedParameters, TimestampsToReturn.Both)

    monitoredItem.on("changed", (dataValue: DataValue) => {
      const value = dataValue.value.toString()
      this.emit("DataChanged", value)
    })
  }
  // #endregion

  // #region Disconnect method
  /** Disconnects the OPC UA client and closes the session if it exists.
   * This method performs the following steps:
   * 1. If a session is active, it closes the session and logs "Session closed."
   * 2. Disconnects the OPC UA client and logs "Successfully disconnected."
   * 3. Emits the `OPCUAEvents.Disconnected` event.
   *
   * @returns {Promise<void>} A promise that resolves when the client is disconnected.
   */
  public async disconnect() {
    if (this.session) await this.session.close()
    await this.client.disconnect()
    this.emit("Disconnected")
  }
  // #endregion
}