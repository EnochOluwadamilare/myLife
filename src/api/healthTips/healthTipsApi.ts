import { apiClient } from "@/api/client";
import { HealthTip, HealthTipsResponse } from "@/types/healthTip";

export const healthTipsApi = {
  getTips() {
    return apiClient.get<HealthTipsResponse>("/health-tips");
  },

  getTip(id: number | string) {
    return apiClient.get<HealthTip>(`/health-tips/${id}`);
  },
};