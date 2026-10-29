export interface SyncPayload {
  device_id: string;
  last_sync_timestamp: number;
  changed_records: unknown[];
}