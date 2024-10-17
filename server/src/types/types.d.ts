type Events = {
  DataChanged: { nodeId: NodeId; value: string };
  Connected: void;
  Error: Error;
  Disconnected: void;
  Connected: void
  Disconnected: void
  Error: Error | string
}
