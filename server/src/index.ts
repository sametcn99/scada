import { OPCUAClientWrapper } from "./runtime/opcua"

// const endpointUrl = "opc.tcp://localhost:51210/Matrikon.OPC.Simulation.1"
const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543/UA/SampleServer"

const opcuaClientWrapper = new OPCUAClientWrapper(endpointUrl)

;(async () => {
  await opcuaClientWrapper.connect()
})()

opcuaClientWrapper.on("Connected", async () => {
  await opcuaClientWrapper.monitorItem("ns=1;s=Temperature")
})

opcuaClientWrapper.on("DataChanged", (value) => {
  console.log("Data changed: ", value)
})

opcuaClientWrapper.on("Disconnected", () => {
  console.log("Client is disconnected.")
})

opcuaClientWrapper.on("Error", (err) => {
  console.error("Error: ", err)
})
