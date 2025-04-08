"use client"

import type React from "react"
import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children?: React.ReactNode
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const location = useLocation()

  // Add debugging logs
  console.log("ProtectedRoute - Auth State:", {
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    allowedRoles,
  })

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
    console.log("ProtectedRoute - Not authenticated, redirecting to login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If specific roles are required, check permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some((role) => hasPermission(role))
    console.log("ProtectedRoute - Role check:", { allowedRoles, hasAccess })

    if (!hasAccess) {
      // Redirect to unauthorized page
      console.log("ProtectedRoute - Unauthorized, redirecting")
      return <Navigate to="/unauthorized" replace />
    }
  }

  // User is authenticated and has required role
  // Return children if provided, otherwise use Outlet for nested routes
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute

