export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}
