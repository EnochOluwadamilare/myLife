import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "MYLIFE_VISIT_REMINDERS";

export interface VisitReminder {
  id: string;
  title: string;
  hospitalName: string;
  visitDate: string;
  visitTime: string;
  notificationId: string;
  createdAt: string;
}

export const visitReminderStorage = {
  async getAll(): Promise<VisitReminder[]> {
    const value = await AsyncStorage.getItem(KEY);
    return value ? JSON.parse(value) : [];
  },

  async save(reminder: VisitReminder) {
    const existing = await this.getAll();
    await AsyncStorage.setItem(KEY, JSON.stringify([reminder, ...existing]));
  },

  async remove(id: string) {
    const existing = await this.getAll();
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify(existing.filter((item) => item.id !== id))
    );
  },
};