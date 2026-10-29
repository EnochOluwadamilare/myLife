import NetInfo from "@react-native-community/netinfo";
import { queueRepository } from "@/repositories/sync/queueRepository";
import { syncApi } from "@/api/sync/syncApi";
import { useSyncStore } from "@/store/useSyncStore";
import { getDeviceId } from "@/services/device/deviceService";
import { SyncQueueItem } from "@/types/sync";

let isSyncing = false;

const setSyncing = (value: boolean) => {
  useSyncStore.getState().setSyncing(value);
};

const buildPayload = async (items: SyncQueueItem[]) => {
  const deviceId = await getDeviceId();

  return {
    device_id: deviceId,
    last_sync_timestamp: Date.now(),
    changed_records: items.map((item) => {
      let parsedPayload: unknown;

      try {
        parsedPayload = JSON.parse(item.payload);
      } catch {
        parsedPayload = item.payload;
      }

      return {
        id: item.id,
        entity_type: item.entityType,
        entity_id: item.entityId,
        operation: item.operation,
        payload: parsedPayload,
        created_at: item.createdAt,
      };
    }),
  };
};

export const startSyncEngine = async () => {
  if (isSyncing) {
    return;
  }

  const netState = await NetInfo.fetch();
  const connected = netState.isConnected || netState.isInternetReachable;

  if (!connected) {
    return;
  }

  const pendingItems = await queueRepository.getPending();
  if (!pendingItems?.length) {
    return;
  }

  isSyncing = true;
  setSyncing(true);

  try {
    await Promise.all(
      pendingItems.map((item) => queueRepository.markAsProcessing(item.id))
    );

    const payload = await buildPayload(pendingItems);
    await syncApi.sync(payload);

    await Promise.all(
      pendingItems.map((item) => queueRepository.markAsSynced(item.id))
    );
  } catch (error) {
    console.error("[SyncEngine] sync failed", error);

    await Promise.all(
      pendingItems.map((item) => queueRepository.markAsFailed(item.id))
    );
  } finally {
    isSyncing = false;
    setSyncing(false);
  }
};