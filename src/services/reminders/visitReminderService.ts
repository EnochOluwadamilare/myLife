// src/services/reminders/visitReminderService.ts

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { visitReminderStorage } from "./visitReminderStorage";
import { notificationPermissionService } from "@/services/notifications/notificationPermissionService";

const VISIT_CHANNEL_ID = "visit-reminders-v2";

interface ScheduleVisitReminderData {
  title: string;
  hospitalName: string;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:mm
}

const createVisitDate = (
  visitDate: string,
  visitTime: string
): Date => {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    visitDate.trim()
  );

  const timeMatch = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
    visitTime.trim().slice(0, 5)
  );

  if (!dateMatch) {
    throw new Error(
      "Invalid visit date. Use YYYY-MM-DD, for example 2026-07-25."
    );
  }

  if (!timeMatch) {
    throw new Error(
      "Invalid visit time. Use HH:mm, for example 14:30."
    );
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  // This creates the appointment using the phone's local time zone.
  const triggerDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  );

  // Catch impossible dates such as 2026-02-31.
  const dateIsValid =
    triggerDate.getFullYear() === year &&
    triggerDate.getMonth() === month - 1 &&
    triggerDate.getDate() === day &&
    triggerDate.getHours() === hour &&
    triggerDate.getMinutes() === minute;

  if (!dateIsValid) {
    throw new Error("The selected visit date or time is invalid.");
  }

  if (triggerDate.getTime() <= Date.now()) {
    throw new Error(
      `The selected visit time is in the past: ${triggerDate.toLocaleString()}`
    );
  }

  return triggerDate;
};

export const visitReminderService = {
  async scheduleVisitReminder(
    data: ScheduleVisitReminderData
  ) {
    const hasPermission =
      await notificationPermissionService.requestPermission();

    if (!hasPermission) {
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        VISIT_CHANNEL_ID,
        {
          name: "Hospital Visit Reminders",
          description:
            "Notifications for upcoming hospital and clinic visits",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          enableVibrate: true,
          vibrationPattern: [0, 250, 250, 250],
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        }
      );
    }

    const triggerDate = createVisitDate(
      data.visitDate,
      data.visitTime
    );

    const trigger: Notifications.DateTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId:
        Platform.OS === "android"
          ? VISIT_CHANNEL_ID
          : undefined,
    };

    // Verify exactly when Expo thinks the notification will fire.
    const nextTriggerTimestamp =
      await Notifications.getNextTriggerDateAsync(trigger);

    if (nextTriggerTimestamp === null) {
      throw new Error(
        "Expo could not calculate a valid notification time."
      );
    }

    console.log("Visit reminder verification:", {
      deviceNow: new Date().toString(),
      suppliedDate: data.visitDate,
      suppliedTime: data.visitTime,
      constructedDate: triggerDate.toString(),
      expectedTrigger: new Date(
        nextTriggerTimestamp
      ).toString(),
      millisecondsUntilTrigger:
        nextTriggerTimestamp - Date.now(),
    });

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "👩‍⚕️ Hospital Visit Reminder",
          body: `${data.title} at ${data.hospitalName}`,
          sound: "default",
          priority:
            Notifications.AndroidNotificationPriority.MAX,
          data: {
            type: "visit_reminder",
            visitDate: data.visitDate,
            visitTime: data.visitTime,
            hospitalName: data.hospitalName,
          },
        },
        trigger,
      });

    const reminder = {
      id: String(Date.now()),
      title: data.title,
      hospitalName: data.hospitalName,
      visitDate: data.visitDate,
      visitTime: data.visitTime,
      notificationId,
      createdAt: new Date().toISOString(),
    };

    await visitReminderStorage.save(reminder);

    const scheduled =
      await Notifications.getAllScheduledNotificationsAsync();

    console.log(
      "Saved visit notification:",
      scheduled.find(
        (item) => item.identifier === notificationId
      )
    );

    return reminder;
  },

  async cancelVisitReminder(
    reminderId: string,
    notificationId: string
  ) {
    await Notifications.cancelScheduledNotificationAsync(
      notificationId
    );

    await visitReminderStorage.remove(reminderId);
  },
};