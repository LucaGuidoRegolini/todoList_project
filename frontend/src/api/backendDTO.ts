export interface ApiResponse<T, E> {
  data: T | null;
  error: E | null;
  status: number;
}

export interface ApiResponseError {
  statusCode: number;
  main_message: string;
  messages: string[];
  error_type: string;
  validation_type: string;
  path: string;
}

export const defaultError: ApiResponseError = {
  statusCode: 500,
  main_message: "Default error",
  messages: [],
  error_type: "DEFAULT_ERROR",
  validation_type: "AXIOS_ERROR",
  path: "",
};

export interface User {
  id: string;
  email: string;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  access_token_expiry: number;
  refresh_token_expiry: number;
}

export interface Task {
  id: string;
  title: string;
  isDone: boolean;
}
