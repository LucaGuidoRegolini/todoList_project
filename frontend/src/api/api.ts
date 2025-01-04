import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = cookies.get("refresh_token");

    if (error.response?.status === 401 && refreshToken) {
      try {
        const { data } = await axios.post("/auth/refresh-token", {
          refresh_token: refreshToken,
        });

        localStorage.setItem("access_token", data.access_token);
        cookies.set("access_token", data.access_token, { path: "/" });
        cookies.set("refresh_token", data.refresh_token, { path: "/" });

        originalRequest.headers["Authorization"] = `Bearer ${data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
