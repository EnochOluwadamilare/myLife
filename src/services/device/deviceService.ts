import * as SecureStore from "expo-secure-store";
import { v4 as uuid } from "uuid";

const DEVICE_ID_KEY = "MYLIFE_DEVICE_ID";

export const getDeviceId = async (): Promise<string> => {
  const existing = await SecureStore.getItemAsync(
    DEVICE_ID_KEY
  );

  if (existing) {
    return existing;
  }

  const id = uuid();

  await SecureStore.setItemAsync(
    DEVICE_ID_KEY,
    id
  );

  return id;
};