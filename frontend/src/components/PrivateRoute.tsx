"use client"

import type React from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface PrivateRouteProps {
  allowedRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role) && user.role !== "admin") {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />
  }

  // User is authenticated and has required role, render outlet
  return <Outlet />
}

export default PrivateRoute

