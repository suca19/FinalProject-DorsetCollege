"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import axiosInstance from "../api/axiosInstance"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  phone_number?: string
  address?: string
  gender?: string
  date_joined?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  isManager: boolean
  isWorker: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  hasPermission: (requiredRoles: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user")
      const token = localStorage.getItem("token")

      if (storedUser && token) {
        try {
          // Set token in axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token is still valid by making a request to profile endpoint
          const response = await axiosInstance.get("/users/profile/")
          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
          
          // Clear authorization header
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login/", { email, password })
      const { access, refresh, user } = response.data

      setUser(user)
      setIsAuthenticated(true)

      localStorage.setItem("token", access)
      localStorage.setItem("refreshToken", refresh)
      localStorage.setItem("user", JSON.stringify(user))
      
      // Set token in axios headers
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)

    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    
    // Clear authorization header
    delete axiosInstance.defaults.headers.common['Authorization'];
  }

  const register = async (username: string, email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await axiosInstance.post("/auth/register/", {
        username,
        email,
        password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
        role: "staff", // Default role for new registrations
      })

      return response.status === 201
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await axiosInstance.patch("/users/profile/", data)

      // Update local user data
      setUser((prevUser) => (prevUser ? { ...prevUser, ...response.data } : null))

      // Update stored user data
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const updatedUser = { ...JSON.parse(storedUser), ...response.data }
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }

      return true
    } catch (error) {
      console.error("Profile update error:", error)
      throw error
    }
  }
  
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await axiosInstance.post("/auth/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      })
      
      return true
    } catch (error) {
      console.error("Password update error:", error)
      throw error
    }
  }

  // Role-based helper functions
  const isAdmin = user?.role === "admin"
  const isManager = user?.role === "manager"
  const isWorker = user?.role === "staff"

  // Enhanced function to check if user has permission based on role
  // Now supports checking against multiple roles
  const hasPermission = (requiredRoles: string | string[]): boolean => {
    if (!user) return false

    // Admin has access to everything
    if (user.role === "admin") return true

    // Convert single role to array for consistent handling
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    
    // Check if user's role is in the required roles array
    return roles.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isAdmin,
        isManager,
        isWorker,
        login,
        logout,
        register,
        updateProfile,
        updatePassword,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}