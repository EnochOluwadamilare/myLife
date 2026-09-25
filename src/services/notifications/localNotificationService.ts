import * as Notifications from "expo-notifications";

export interface LocalScheduledNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  time: string;
  rawTrigger: Notifications.NotificationTrigger;
}

export const localNotificationService = {
  async getScheduledNotifications(): Promise<LocalScheduledNotification[]> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();

    return scheduled
      .map((item) => {
        const trigger: any = item.trigger;
        const hour = trigger?.hour;
        const minute = trigger?.minute;
        const formattedTime =
          typeof hour === "number"
            ? `${String(hour).padStart(2, "0")}:${String(minute ?? 0).padStart(2, "0")}`
            : "Scheduled";

        return {
          id: item.identifier,
          title: item.content.title ?? "Reminder",
          body: item.content.body ?? "",
          type: String(item.content.data?.type ?? "notification"),
          time: formattedTime,
          rawTrigger: item.trigger,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  },
};