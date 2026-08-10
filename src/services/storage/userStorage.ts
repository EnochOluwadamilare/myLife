import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "@/types/auth";

const USER_KEY = "MYLIFE_AUTH_USER";

export const userStorage = {
  async saveUser(user: AuthUser) {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<AuthUser | null> {
    const value = await AsyncStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  },

  async clearUser() {
    await AsyncStorage.removeItem(USER_KEY);
  },
};