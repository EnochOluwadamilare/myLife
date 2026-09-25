import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "MYLIFE_EXERCISE_NOTIFICATION_IDS";

type ExerciseReminderMap = Record<string, string[]>;

export const exerciseReminderStorage = {
  async getAll(): Promise<ExerciseReminderMap> {
    const value = await AsyncStorage.getItem(KEY);
    return value ? JSON.parse(value) : {};
  },

  async getExerciseNotificationIds(exerciseId: string) {
    const all = await this.getAll();
    return all[exerciseId] ?? [];
  },

  async saveExerciseNotificationIds(
    exerciseId: string,
    notificationIds: string[]
  ) {
    const all = await this.getAll();
    all[exerciseId] = notificationIds;
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },

  async removeExercise(exerciseId: string) {
    const all = await this.getAll();
    delete all[exerciseId];
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
  },
};