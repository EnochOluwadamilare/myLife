import { getDatabase } from "@/database/sqlite/database";
import { SyncQueueItem } from "@/types/sync";

export const queueRepository = {
  async add(item: SyncQueueItem) {
    const db = await getDatabase();

    await db.runAsync(
      `
      INSERT INTO sync_queue
      (
        id,
        entity_type,
        entity_id,
        operation,
        payload,
        status,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        item.id,
        item.entityType,
        item.entityId,
        item.operation,
        item.payload,
        item.status,
        item.createdAt,
      ]
    );
  },

  async getPending(): Promise<SyncQueueItem[]> {
    const db = await getDatabase();

    return await db.getAllAsync(
      `
      SELECT
        id,
        entity_type AS entityType,
        entity_id AS entityId,
        operation,
        payload,
        status,
        created_at AS createdAt
      FROM sync_queue
      WHERE status='pending'
      `
    );
  },

  async markAsProcessing(id: string) {
    const db = await getDatabase();

    await db.runAsync(
      `
      UPDATE sync_queue
      SET status = 'processing'
      WHERE id = ?
      `,
      [id]
    );
  },

  async markAsSynced(id: string) {
    const db = await getDatabase();

    await db.runAsync(
      `
      UPDATE sync_queue
      SET status = 'synced'
      WHERE id = ?
      `,
      [id]
    );
  },

  async markAsFailed(id: string) {
    const db = await getDatabase();

    await db.runAsync(
      `
      UPDATE sync_queue
      SET status = 'pending'
      WHERE id = ?
      `,
      [id]
    );
  },
};