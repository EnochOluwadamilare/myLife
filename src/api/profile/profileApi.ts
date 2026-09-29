import { apiClient } from "@/api/client";
import { HealthMetadata } from "@/types/profile";
import { HealthSetupPayload } from "./healthSetupApi";

export const profileApi = {
  getHealthMetadata() {
    return apiClient.get<HealthMetadata>("/profile/health-metadata");
  },

  getProfile() {
    return apiClient.get("/profile");
  },

  updateProfile(payload: HealthSetupPayload) {
    return apiClient.put("/profile", payload);
  },
};