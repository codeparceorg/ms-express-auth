export interface SignupDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id_auth_token: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
