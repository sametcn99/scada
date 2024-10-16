import { NodeId } from 'node-opcua'
import { OPCUAClientWrapper } from './runtime'
import { ExpressServer } from './server'
import { getAppEnvironment, getSelectedEndpoint } from './utils'
import { logAppEvents } from './utils/logger'

logAppEvents('Message', `Application is started in ${getAppEnvironment()} environment`)
const expressServer = new ExpressServer(4020)

const endpointURL = await getSelectedEndpoint()
logAppEvents('Message', `Selected endpoint: ${endpointURL}`)

const opcuaClientWrapper = new OPCUAClientWrapper(endpointURL)

// Connect to the OPC UA server
;(async () => {
  try {
    await opcuaClientWrapper.connect()
    expressServer.start()
  } catch (error) {
    logAppEvents('Message', error as Error)
  }
})()

opcuaClientWrapper.on('Connected', async () => {
  /**NodeId is a unique identifier for a node in the OPC UA server.
   * It consists of a namespace index and an identifier.
   * ns=1;i=1001 represents a node with the identifier 1001 in the namespace 1.
   * The namespace index is an integer that maps to a URI in the server's namespace array.
   * The identifier can be a numeric, string, GUID, or byte string value.
   * The NodeId constructor takes three arguments: the identifier type, the value, and the namespace index.
   * The NodeIdType enum defines the possible identifier types: NUMERIC, STRING, GUID, BYTESTRING.
   */
  await opcuaClientWrapper.monitorItem(new NodeId(NodeId.NodeIdType.NUMERIC, '1001', 3))
})

opcuaClientWrapper.on('DataChanged', (value) => {
  expressServer.emitEvent('Temperature', value)
})
