export type UserType =
  | "publication_news"
  | "event_training"
  | "public_view"
  | "registrations_payments"
  | "prospective_certificates"
  | "super_user"
  | "executive_secretary";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  user_type: UserType;
  token: {
    access: string;
    refresh: string;
  };
}

export interface CreateUserPayload {
  email: string;
  password: string;
  userType: UserType;
}

export interface CreateUserResponse {
  message: string;
  status: number;
}

export interface LogoutPayload {
  refresh: string;
}
