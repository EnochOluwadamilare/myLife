export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RefreshResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  lmp_date?: string;
  consent_given_for_data_sharing: boolean;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}