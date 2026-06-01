export interface LoginPayload {
  username: string;
  password: string;
}

export interface User {
  id: number;

  full_name: string;

  username: string;

  role: string;

  phone_number: string;

  is_active: boolean;

  created_at: string;
}

export interface LoginResponse {
  success: boolean;

  message: string;

  data: {
    user: User;

    access: string;

    refresh: string;

    must_change_password: boolean;
  };
}