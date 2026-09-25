import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { ExerciseItem } from "@/types/exercise";
import { exerciseReminderStorage } from "@/services/reminders/exerciseReminderStorage";
import { notificationPermissionService } from "@/services/notifications/notificationPermissionService";

const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  return {
    hour: Number.isFinite(hour) ? hour : 8,
    minute: Number.isFinite(minute) ? minute : 0,
  };
};

export const exerciseReminderService = {
  async scheduleExerciseReminder(
    exercise: ExerciseItem,
    time: string
  ) {
    const hasPermission =
      await notificationPermissionService.requestPermission();

    if (!hasPermission) return;

    await this.cancelExerciseReminder(exercise.id);

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("exercise-reminders", {
        name: "Exercise Reminders",
        importance: Notifications.AndroidImportance.MAX,
        // use default system sound for reliability
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const { hour, minute } = parseTime(time);

    const notificationId =
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🏃 Exercise Reminder`,
          body: `Time for ${exercise.title}. Gentle movement supports you and your baby.`,
          sound: "default",
          data: {
            type: "exercise_reminder",
            exerciseId: exercise.id,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: "exercise-reminders",
        },
      });

    await exerciseReminderStorage.saveExerciseNotificationIds(
      exercise.id,
      [notificationId]
    );
  },

  async cancelExerciseReminder(exerciseId: string) {
    const ids =
      await exerciseReminderStorage.getExerciseNotificationIds(exerciseId);

    for (const id of ids) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }

    await exerciseReminderStorage.removeExercise(exerciseId);
  },
};