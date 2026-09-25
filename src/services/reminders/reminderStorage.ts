import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "MYLIFE_MEDICATION_NOTIFICATION_IDS";

type ReminderMap = Record<string, string[]>;

export const reminderStorage = {
  async getAll(): Promise<ReminderMap> {
    const value = await AsyncStorage.getItem(KEY);
    return value ? JSON.parse(value) : {};
  },

  async getMedicationNotificationIds(medicationId: number | string) {
    const all = await this.getAll();
    return all[String(medicationId)] ?? [];
  },

  async saveMedicationNotificationIds(
    medicationId: number | string,
    notificationIds: string[]
  ) {
    const all = await this.getAll();

    all[String(medicationId)] = notificationIds;

    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },

  async removeMedication(medicationId: number | string) {
    const all = await this.getAll();

    delete all[String(medicationId)];

    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },
};