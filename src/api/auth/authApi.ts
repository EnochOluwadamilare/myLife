import { authClient } from "@/api/auth/authClient";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/constants/endpoints";

import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  AuthResponse
} from "@/types/auth";

export const authApi = {
  login(payload: LoginRequest) {
    return authClient.post<AuthResponse>(
      ENDPOINTS.AUTH.LOGIN,
      payload
    );
  },

  register(payload: RegisterRequest) {
    return authClient.post<AuthResponse>(
      ENDPOINTS.AUTH.REGISTER,
      payload
    );
  },

  forgotPassword(email: string) {
    return authClient.post(
      "/auth/forgot-password",
      { email }
    );
  },

  logout() {
    return apiClient.post(
      ENDPOINTS.AUTH.LOGOUT
    );
  },

  refresh() {
    return authClient.post<RefreshResponse>(
      ENDPOINTS.AUTH.REFRESH
    );
  },

  getAuthenticatedUser() {
    return apiClient.get("/auth/user");
  }
};