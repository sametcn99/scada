import { EventEmitter } from 'events'
import type {
  ClientSession,
  ClientSubscription,
  MonitoringParametersOptions,
  ReadValueIdOptions,
  ClientMonitoredItem,
} from 'node-opcua'
import {
  AttributeIds,
  DataValue,
  MessageSecurityMode,
  NodeId,
  OPCUAClient,
  SecurityPolicy,
  TimestampsToReturn,
} from 'node-opcua'
import ora from 'ora'
import { withTimeout } from '../utils'
import { logAppEvents } from '../utils/logger'
import os from 'os'

interface Events {
  DataChanged: { nodeId: NodeId; value: string }
  Connected: void
  Error: Error
  Disconnected: void
}

/**
 * A wrapper class for OPC UA Client that extends EventEmitter.
 * This class handles the connection, session creation, subscription, and monitoring of OPC UA nodes.
 *
 * @class OPCUAClientWrapper
 * @extends EventEmitter
 */
export class OPCUAClientWrapper extends EventEmitter {
  private client: OPCUAClient
  private endpointUrl: string =
    process.env.OPC_SERVER_ENDPOINT || `opc.tcp://${os.hostname()}:53530/OPCUA/SimulationServer`

  private session: ClientSession | undefined
  private subscription: ClientSubscription | undefined
  private reconnectInterval = 5000
  private monitoredItems: Map<NodeId, ClientMonitoredItem> = new Map() // Map to store monitored items by NodeId

  constructor() {
    super() // Call the parent class(EventMitter) constructor
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: true, // Determines whether the endpoint must exist in the LDS
      keepSessionAlive: true,
      transportTimeout: Number.MAX_SAFE_INTEGER,
    })
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
  public async connect() {
    const spinner = ora('Connecting to OPC server...').start()
    try {
      spinner.text = 'Connecting to OPC server...\n' + 'Endpoint: ' + this.endpointUrl

      // Establish connection
      const isConnected = await withTimeout(() => this.client.connect(this.endpointUrl), 5000)
      if (!isConnected) {
        spinner.fail('Connection failed or timed out.' + this.endpointUrl)
        logAppEvents('Error', 'Connection failed or timed out.' + this.endpointUrl)
        process.exit(1)
      }
      spinner.succeed('Connection successful.\n' + this.client)
      logAppEvents('Info', `${this.client}`, false)

      // Create session
      this.session = await this.client.createSession()
      spinner.succeed('Session successfully created.' + this.session)
      logAppEvents('Info', `${this.session}`, false)

      // Create subscription
      this.subscription = await this.session.createSubscription2({
        requestedPublishingInterval: 1000,
        publishingEnabled: true,
        priority: 10,
      })

      this.emit('Connected')
    } catch (err) {
      logAppEvents('Error', err as Error)
      await this.client.disconnect()
      this.emit('Error', err as Error)
    }
  }
  // #endregion

  // #region MonitorItem method
  public async monitorItem(nodeId: NodeId) {
    try {
      if (!this.subscription) throw new Error('Subscription is not initialized.')

      const itemToMonitor: ReadValueIdOptions = {
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
      }

      const requestedParameters: MonitoringParametersOptions = {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 100,
      }

      const monitoredItem = (await this.subscription.monitor(
        itemToMonitor,
        requestedParameters,
        TimestampsToReturn.Both
      )) as ClientMonitoredItem

      this.monitoredItems.set(nodeId, monitoredItem) // Add the monitored item to the map
      logAppEvents('Info', `Monitoring item: ${nodeId}`)

      monitoredItem.on('changed', (dataValue: DataValue) => {
        const value = dataValue.value.toString()
        this.emit('DataChanged', { nodeId, value }) // Emit event with nodeId and value
      })
    } catch (error) {
      logAppEvents('Error', error as Error)
      this.emit('Error', error as Error)
    }
  }

  // Method to get a monitored item by NodeId
  public getMonitoredItem(nodeId: NodeId): ClientMonitoredItem | undefined {
    return this.monitoredItems.get(nodeId)
  }

  // Method to get the total number of monitored items
  public getTotalMonitoredItems(): Map<NodeId, ClientMonitoredItem> {
    return this.monitoredItems
  }
  // #endregion

  // #region Disconnect method
  public async disconnect() {
    if (this.session) await this.session.close()
    await this.client.disconnect()
    logAppEvents('Message', 'Successfully disconnected.')
    this.emit('Disconnected')
  }
  // #endregion

  // #region Reconnect method
  private async reconnect() {
    logAppEvents('Message', `Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`)
    setTimeout(async () => {
      try {
        await this.connect()
      } catch (err) {
        logAppEvents('Error', 'Reconnection attempt failed: ' + err)
        this.reconnect() // Retry reconnection if it fails
      }
    }, this.reconnectInterval)
  }
  // #endregion
}
