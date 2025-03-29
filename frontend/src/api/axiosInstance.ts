import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from "axios"

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token")
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Add custom _retry property to AxiosRequestConfig
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean
  }
}

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000/api/"}/token/refresh/`,
          { refresh: refreshToken },
        )

        const { access } = response.data
        localStorage.setItem("token", access)

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access}`
        }
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, log out user
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        // Redirect to login page
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    // Log all errors
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default axiosInstance

