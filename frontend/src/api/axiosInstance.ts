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

    // Add debugging log
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, {
      headers: config.headers,
      hasToken: !!token,
    })

    return config
  },
  (error: AxiosError) => {
    console.error("Request error:", error)
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
    // Add debugging log for successful responses
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data,
    })
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig
    console.error(
      `API Error: ${error.response?.status} ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`,
      {
        status: error.response?.status,
        data: error.response?.data,
      },
    )

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log("Token expired, attempting refresh...")

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        console.log("Refreshing token...")
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000/api/"}auth/token/refresh/`,
          { refresh: refreshToken },
        )

        const { access } = response.data
        localStorage.setItem("token", access)
        console.log("Token refreshed successfully")

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${access}`
        }
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // If refresh fails, log out user
        console.error("Token refresh failed:", refreshError)
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        // Redirect to login page
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

