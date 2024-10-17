import type { Request, Response } from 'express'
import { coerceNodeId } from 'node-opcua'
import { serviceContainer } from '../../services'

export class NodeIdController {
  async handleNodeId(req: Request, res: Response): Promise<void> {
    const { nodeId } = req.body
    const { opcuaClientWrapper, expressServer } = serviceContainer

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

    opcuaClientWrapper.on('DataChanged', (value) => {
      expressServer.emitEvent(validNodeId.value.toString(), value)
    })

    res.json(validNodeId)
  }
}
