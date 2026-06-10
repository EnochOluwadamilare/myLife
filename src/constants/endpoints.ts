export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    HEALTH_METADATA: "/profile/health-metadata",
  },

  MEDICATION: {
    LIST: "/medications",
  },

  EDUCATION: {
    MODULES: "/education/modules",
  },

  SYNC: {
    CHECK: "/sync/check",
    SYNC: "/sync",
    FULL: "/sync/full",
  },
} as const;