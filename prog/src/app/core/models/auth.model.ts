export interface LoginRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface LoginResponse {
  authenticated: boolean;
  token: string;
  username: string;
  name: string;
  email: string;
  role: string;
  message: string;
}
