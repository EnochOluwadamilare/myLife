import { authApi } from "@/api/auth/authApi";
import { RegisterRequest } from "@/types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { userStorage } from "@/services/storage/userStorage";

export const authRepository = {
  async register(payload: RegisterRequest) {
    const response = await authApi.register(payload);

    await useAuthStore
      .getState()
      .setToken(response.data.token);

    await useAuthStore.getState().setToken(response.data.token);
    await userStorage.saveUser(response.data.user);

    return response.data;
  },

  async login(
    email: string,
    password: string
  ) {
    const response =
      await authApi.login({
        email,
        password,
      });

    await useAuthStore.getState().setToken(response.data.token);
    await useAuthStore.getState().setUser(response.data.user);
    await userStorage.saveUser(response.data.user);

    return response.data;
  },

  async logout() {
    try {
      await authApi.logout();
    } catch (error) {
      console.log("Server logout failed or token already expired:", error);
    } finally {
      await useAuthStore.getState().logout();
    }
  },
};