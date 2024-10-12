/**
 * Enum representing various OPC UA events.
 *
 * @enum {string}
 * @property {string} Connected - Indicates that the OPC UA connection has been established.
 * @property {string} Disconnected - Indicates that the OPC UA connection has been lost.
 * @property {string} DataChanged - Indicates that the data monitored by OPC UA has changed.
 * @property {string} Error - Indicates that an error has occurred in the OPC UA connection or data monitoring.
 */
export enum OPCUAEvents {
  Connected = "connected",
  Disconnected = "disconnected",
  DataChanged = "dataChanged",
  Error = "error",
}
