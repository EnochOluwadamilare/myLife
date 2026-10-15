import { apiClient } from "./client";

import { secureStorage } from "@/services/storage/secureStorage";

import { refreshToken } from "./refreshToken";

export const setupInterceptors = () => {
  apiClient.interceptors.request.use(
    async (config) => {
      const token =
        await secureStorage.getToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }

      return config;
    }
  );

  apiClient.interceptors.response.use(
    (response) => response,

    async (error) => {
      const originalRequest =
        error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const newToken =
          await refreshToken();

        if (!newToken) {
          await secureStorage.clearToken();

          return Promise.reject(error);
        }

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return apiClient(
          originalRequest
        );
      }

      return Promise.reject(error);
    }
  );
};