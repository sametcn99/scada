import { OPCUAClientWrapper } from "./runtime"
import { ExpressServer } from "./server"
import { getSelectedEndpoint } from "./utils"
import { logAppEvents } from "./utils/logger"

logAppEvents("Application started")
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
  await opcuaClientWrapper.monitorItem("ns=1;s=Temperature")
})

opcuaClientWrapper.on("DataChanged", (value) => {
  expressServer.emitEvent("temperature", value)
})
