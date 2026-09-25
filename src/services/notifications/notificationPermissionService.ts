// src/services/notifications/notificationPermissionService.ts

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

export const notificationPermissionService = {
  async requestPermission(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log("Notifications work best on a physical device.");
      return false;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("medication-reminders", {
        name: "Medication Reminders",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    const existingPermission = await Notifications.getPermissionsAsync();

    if (existingPermission.granted) {
      return true;
    }

    const requestedPermission = await Notifications.requestPermissionsAsync();

    if (!requestedPermission.granted) {
      Alert.alert(
        "Notifications disabled",
        "Medication reminders need notification permission to alert you on time."
      );

      return false;
    }

    return true;
  },
};