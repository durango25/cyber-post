export interface User {
  id: number | string;
  name: string;
  email: string;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  data: {
    user: Omit<User, "token">;
    token: string;
  };
  message: string;
}
