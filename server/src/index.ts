import { NodeId } from "node-opcua"
import { OPCUAClientWrapper } from "./runtime"
import { ExpressServer } from "./server"
import { getAppEnvironment, getSelectedEndpoint } from "./utils"
import { logAppEvents } from "./utils/logger"

logAppEvents(`Application is started in ${getAppEnvironment()} environment`)
const expressServer = new ExpressServer(4020)

const endpointURL = await getSelectedEndpoint()
logAppEvents(`Selected endpoint: ${endpointURL}`)

const opcuaClientWrapper = new OPCUAClientWrapper(endpointURL)

// Connect to the OPC UA server
;(async () => {
  try {
    await opcuaClientWrapper.connect()
    expressServer.start()
  } catch (error) {
    logAppEvents(error as Error)
  }
})()

opcuaClientWrapper.on("Connected", async () => {
  await opcuaClientWrapper.monitorItem(new NodeId(NodeId.NodeIdType.STRING, "Temperature", 1))
})

opcuaClientWrapper.on("DataChanged", (value) => {
  expressServer.emitEvent("temperature", value)
})
