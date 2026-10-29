import { create } from "zustand";

interface SyncState {
  syncing: boolean;

  setSyncing: (
    value: boolean
  ) => void;
}

export const useSyncStore =
  create<SyncState>((set) => ({
    syncing: false,

    setSyncing: (value) =>
      set({
        syncing: value,
      }),
  }));