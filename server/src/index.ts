import { serviceContainer } from './services/container'
import { getAppEnvironment } from './utils'
import { logAppEvents } from './utils/logger'

logAppEvents('Message', `Application is started in ${getAppEnvironment()} environment`)
const { opcuaClientWrapper, expressServer } = serviceContainer

// Connect to the OPC UA server
;(async () => {
  try {
    await opcuaClientWrapper.connect()
    expressServer.start()

    opcuaClientWrapper.on('DataChanged', ({ nodeId, value }) => {
      expressServer.emitEvent(nodeId.toString(), value)
    })
  } catch (error) {
    logAppEvents('Error', error as Error)
  }
})()
