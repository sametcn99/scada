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
  type MonitoringParametersOptions,
  type ReadValueIdOptions,
} from "node-opcua"
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

  // #region EventEmitter methods override for type safety and better intellisense
  emit<K extends keyof Events>(eventName: K, payload?: Events[K]): boolean {
    return super.emit(eventName, payload)
  }
  on<K extends keyof Events>(eventName: K, listener: (payload: Events[K]) => void): this {
    return super.on(eventName, listener)
  }
  // #endregion

  constructor(endpointUrl: string) {
    super()
    this.client = OPCUAClient.create({
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
      endpointMustExist: false,
    })
    this.endpointUrl = endpointUrl
  }

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
    const spinner = ora("OPC sunucusuna bağlanılıyor...").start()
    try {
      spinner.text = "OPC sunucusuna bağlanılıyor...\n" + "Bağlantı noktası: " + this.endpointUrl

      // Bağlantı kur
      await this.client.connect(this.endpointUrl)
      spinner.succeed("Bağlantı başarılı.\n" + this.endpointUrl)

      // Oturum oluştur
      this.session = await this.client.createSession()
      spinner.succeed("Oturum başarıyla oluşturuldu.")

      // OPC UA istemcisinde bir abonelik oluşturmak için createSubscription2 yöntemini çağırıyoruz.
      // Bu yöntem, belirli parametrelerle bir abonelik oluşturur ve bu abonelik, belirli bir yayınlama aralığında sunucudan veri değişikliklerini almak için kullanılır.
      this.subscription = await this.session.createSubscription2({
        requestedPublishingInterval: 1000, // ms cinsinden yayınlama aralığı
        requestedLifetimeCount: 100, // 100 yayınlama döngüsü
        requestedMaxKeepAliveCount: 10, // Aboneliğin maksimum keep-alive sayısı. Bu, sunucunun istemciye veri göndermediği durumda kaç döngü boyunca keep-alive mesajları göndereceğini belirtir.
        maxNotificationsPerPublish: 100, //  Her yayınlama döngüsünde maksimum bildirim sayısı. Bu, bir yayınlama döngüsünde gönderilebilecek maksimum bildirim sayısını sınırlar.
        publishingEnabled: true,
        priority: 10, // sunucunun birden fazla abonelik arasında önceliklendirme yapmasına yardımcı olur.
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
      nodeId: nodeId, // İzlenecek öğenin benzersiz kimliği. Bu kimlik, OPC UA sunucusundaki belirli bir düğümü (node) temsil eder.
      attributeId: AttributeIds.Value, // İzlenecek öğenin hangi özniteliğinin izleneceğini belirler. Bu, öğenin değer özniteliğinin izleneceğini belirtir.
    }

    const requestedParameters: MonitoringParametersOptions = {
      samplingInterval: 100, // Örnekleme aralığını milisaniye cinsinden belirler. Bu örnekte, 100 milisaniye olarak ayarlanmıştır.
      discardOldest: true, // Kuyruk dolduğunda en eski öğelerin atılıp atılmayacağını belirler. true: Kuyruk dolduğunda en eski öğeler atılacaktır.
      queueSize: 100, // Kuyruğun maksimum boyutunu belirler. Bu örnekte, kuyruk boyutu 100 olarak ayarlanmıştır.
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
   * 1. If a session is active, it closes the session and logs "Oturum kapatıldı."
   * 2. Disconnects the OPC UA client and logs "Bağlantı başarıyla kesildi."
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
