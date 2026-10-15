import { apiClient } from "@/api/client";
import { SyncPayload } from "@/types/syncPayload";

export const syncApi = {
  sync(payload: SyncPayload) {
    return apiClient.post(
      "/sync",
      payload
    );
  },
};