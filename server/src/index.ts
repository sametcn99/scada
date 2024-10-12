import { OPCUAClientWrapper } from "./runtime/opcua"
import { ExpressServer } from "./server"

const expressServer = new ExpressServer(4020)

// Set the endpoint URL for the OPC UA server
// const endpointUrl = "opc.tcp://localhost:51210/Matrikon.OPC.Simulation.1"
// const endpointUrl = "opc.tcp://localhost:51210/opcserversim.instance.1"
const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543/UA/SampleServer"
const opcuaClientWrapper = new OPCUAClientWrapper(endpointUrl)

// Connect to the OPC UA server
;(async () => {
  try {
    await opcuaClientWrapper.connect()
    expressServer.start()
  } catch (error) {
    console.error(error)
  }
})()

opcuaClientWrapper.on("Connected", async () => {
  await opcuaClientWrapper.monitorItem("ns=1;s=Temperature")
})

opcuaClientWrapper.on("DataChanged", (value) => {
  // console.log("Data changed: ", value)

  expressServer.emitEvent("temperature", value)
})

opcuaClientWrapper.on("Disconnected", () => {
  console.log("Client is disconnected.")
})

opcuaClientWrapper.on("Error", (err) => {
  console.error("Error: ", err)
})
