import api from "@/api/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  ApiResponse,
  ApiResponseError,
  CreateUserResponse,
  defaultError,
  LoginResponse,
  Task,
} from "./backendDTO";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class BackendApi {
  private async request<T, E>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T, E | ApiResponseError>> {
    try {
      const response = await api.request<T>(config);

      return {
        data: response.data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<E>;

        return {
          data: null,
          error: axiosError.response ? axiosError.response.data : null,
          status: axiosError.response?.status || 500,
        };
      }

      console.error("Error:", error);

      return {
        data: null,
        error: defaultError,
        status: 500,
      };
    }
  }
  public async login(
    email: string,
    password: string
  ): Promise<ApiResponse<LoginResponse, ApiResponseError>> {
    const resp = await this.request<LoginResponse, ApiResponseError>({
      method: "POST",
      url: "/auth/login",
      data: {
        email,
        password,
      },
    });

    if (resp.error) {
      return resp;
    }

    localStorage.setItem("access_token", resp.data!.access_token);
    cookies.set("access_token", resp.data!.access_token, { path: "/" });
    cookies.set("refresh_token", resp.data!.refresh_token, { path: "/" });

    return resp;
  }

  public async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<ApiResponse<CreateUserResponse, ApiResponseError>> {
    return this.request<CreateUserResponse, ApiResponseError>({
      method: "POST",
      url: "/users",
      data: {
        name,
        email,
        password,
      },
    });
  }

  public async getUserTasks(): Promise<ApiResponse<Task[], ApiResponseError>> {
    return this.request<Task[], ApiResponseError>({
      method: "GET",
      url: "/tasks",
    });
  }

  public async createTask(title: string): Promise<ApiResponse<Task, ApiResponseError>> {
    return this.request<Task, ApiResponseError>({
      method: "POST",
      url: "/tasks",
      data: {
        title,
      },
    });
  }

  public async updateTask(
    id: string,
    title: string,
    isDone: boolean
  ): Promise<ApiResponse<Task, ApiResponseError>> {
    return this.request<Task, ApiResponseError>({
      method: "PUT",
      url: `/tasks/${id}`,
      data: {
        title,
        isDone,
      },
    });
  }

  public async deleteTask(id: string): Promise<ApiResponse<any, ApiResponseError>> {
    return this.request<any, ApiResponseError>({
      method: "DELETE",
      url: `/tasks/${id}`,
    });
  }
}

const backendApi = new BackendApi();
export { backendApi };
