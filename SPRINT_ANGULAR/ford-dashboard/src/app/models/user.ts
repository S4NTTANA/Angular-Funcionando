export interface User {
  id: number;
  nome: string;
  email: string;
}

export interface LoginRequest {
  user_name: string;
  user_password: string;
}