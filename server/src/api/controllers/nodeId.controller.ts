import type { Request, Response } from 'express'
import { coerceNodeId } from 'node-opcua'
import { serviceContainer } from '../../services'
import { logAppEvents } from '../../utils/logger'

export class NodeIdController {
  async handleNodeId(req: Request, res: Response): Promise<void> {
    const { nodeId } = req.body
    const { opcuaClientWrapper } = serviceContainer

    if (!nodeId) {
      res.status(400).json({ error: 'nodeId is required' })
      return
    }

    let validNodeId
    try {
      validNodeId = coerceNodeId(nodeId)
    } catch {
      res.status(400).json({ error: 'Invalid nodeId' })
      return
    }

    await opcuaClientWrapper.monitorItem(validNodeId)

    const totalMonitoredItems = opcuaClientWrapper.getTotalMonitoredItems()
    logAppEvents('Info', `Total monitored items: ${totalMonitoredItems}`)
    res.json({ validNodeId, totalMonitoredItems })
  }
}
