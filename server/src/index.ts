import { OPCUAClientWrapper } from "./runtime/opcua"
import { ExpressServer } from "./server"
import inquirer from "inquirer"

const expressServer = new ExpressServer(4020)

const predefinedEndpoints = [
  "opc.tcp://SAMETC:26543/Matrikon.OPC.Simulation.1",
  "opc.tcp://SAMETC:26543/opcserversim.instance.1",
  "opc.tcp://SAMETC:26543",
  "opc.tcp://opcuademo.sterfive.com:26543/UA/SampleServer",
]

const answers = await inquirer.prompt([
  {
    type: "list",
    name: "endpoint",
    message: "Select an OPC UA server endpoint or enter a custom one:",
    choices: [...predefinedEndpoints, "Custom"],
  },
  {
    type: "input",
    name: "customEndpoint",
    message: "Enter your custom endpoint:",
    when: (answers) => answers.endpoint === "Custom",
    validate: (input) => {
      const urlPattern = /^(opc\.tcp:\/\/[^\s]+(:\d+)?\/[^\s]*)$/
      if (urlPattern.test(input)) {
        return true
      } else {
        return "Please enter a valid OPC UA endpoint URL (e.g., opc.tcp://hostname:port/path)."
      }
    },
  },
])

const endpointUrl = answers.endpoint === "Custom" ? answers.customEndpoint : answers.endpoint

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
