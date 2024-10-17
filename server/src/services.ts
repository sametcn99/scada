import { OPCUAClientWrapper } from './runtime'
import { ExpressServer } from './server'

class ServiceContainer {
  // Public properties to hold instances of OPCUAClientWrapper and ExpressServer
  public opcuaClientWrapper: OPCUAClientWrapper
  public expressServer: ExpressServer

  // Private static instance of ServiceContainer to ensure singleton pattern
  private static instance: ServiceContainer

  // Private constructor to prevent direct instantiation
  private constructor() {
    // Initialize OPCUAClientWrapper instance
    this.opcuaClientWrapper = new OPCUAClientWrapper()
    // Initialize ExpressServer instance with port 4020
    this.expressServer = new ExpressServer(4020)
  }

  // Public static method to get the singleton instance of ServiceContainer
  public static getInstance(): ServiceContainer {
    // If instance does not exist, create a new one
    if (!ServiceContainer.instance) ServiceContainer.instance = new ServiceContainer()
    // Return the singleton instance
    return ServiceContainer.instance
  }
}

/**
 * ServiceContainer is a singleton class that holds instances of OPCUAClientWrapper and ExpressServer
 */
export const serviceContainer = ServiceContainer.getInstance()
