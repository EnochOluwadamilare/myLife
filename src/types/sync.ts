export interface SyncQueueItem {
  id: string;
  entityType: string;
  entityId: string;
  operation: "create" | "update" | "delete";
  payload: string;
  status: "pending" | "processing" | "synced";
  createdAt: string;
}