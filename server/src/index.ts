import { getAppEnvironment } from './utils'
import { logAppEvents } from './utils/logger'
import { serviceContainer } from './services'

logAppEvents('Message', `Application is started in ${getAppEnvironment()} environment`)
const { opcuaClientWrapper, expressServer } = serviceContainer

// Connect to the OPC UA server
;(async () => {
  try {
    await opcuaClientWrapper.connect()
    expressServer.start()
  } catch (error) {
    logAppEvents('Error', error as Error)
  }
})()
