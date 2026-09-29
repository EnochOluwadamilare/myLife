import { authApi } from "@/api/auth/authApi";

import { secureStorage } from "@/services/storage/secureStorage";

let refreshing = false;

export const refreshToken =
  async (): Promise<string | null> => {
    if (refreshing) {
      return null;
    }

    try {
      refreshing = true;

      const response =
        await authApi.refresh();

      const newToken =
        response.data.token;

      await secureStorage.saveToken(
        newToken
      );

      return newToken;
    } catch {
      return null;
    } finally {
      refreshing = false;
    }
  };