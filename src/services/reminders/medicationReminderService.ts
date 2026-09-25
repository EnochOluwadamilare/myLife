import * as Notifications from "expo-notifications";

import { MedicationReminder } from "@/types/medication";
import { reminderStorage } from "@/services/reminders/reminderStorage";
import { notificationPermissionService } from "@/services/notifications/notificationPermissionService";


const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 8,
    minute: Number.isFinite(minute) ? minute : 0,
  };
};

export const medicationReminderService = {
  async scheduleMedication(medication: MedicationReminder) {
    const hasPermission =
      await notificationPermissionService.requestPermission();

    if (!hasPermission) {
      return;
    }

    await this.cancelMedication(medication.id);

    if (!medication.is_active) {
      return;
    }

    const notificationIds: string[] = [];

    const scheduleTimes =
      medication.schedule_times?.length > 0
        ? medication.schedule_times
        : ["08:00"];

    for (const time of scheduleTimes) {
      const { hour, minute } = parseTime(time);

      const notificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `💊 ${medication.medication_name} Reminder`,
            body: "It is time to take your medication. Staying consistent helps protect you and your baby.",
            sound: "default",
            data: {
              type: "medication_reminder",
              medicationId: medication.id,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            channelId: "medication-reminders",
          },
        });

      notificationIds.push(notificationId);
    }

    await reminderStorage.saveMedicationNotificationIds(
      medication.id,
      notificationIds
    );
  },

  async rescheduleMedication(medication: MedicationReminder) {
    await this.cancelMedication(medication.id);
    await this.scheduleMedication(medication);
  },

  async cancelMedication(medicationId: number | string) {
    const notificationIds =
      await reminderStorage.getMedicationNotificationIds(medicationId);

    for (const notificationId of notificationIds) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    await reminderStorage.removeMedication(medicationId);
  },
};