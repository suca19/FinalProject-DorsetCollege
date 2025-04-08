"use client"

import type React from "react"
import { useAuth } from "../contexts/AuthContext"

interface RoleBasedComponentProps {
  requiredRole: string | string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({ requiredRole, children, fallback = null }) => {
  const { user } = useAuth()

  if (!user) return fallback as React.ReactElement | null

  const hasRequiredRole = Array.isArray(requiredRole) ? requiredRole.includes(user.role) : user.role === requiredRole

  return hasRequiredRole ? <>{children}</> : (fallback as React.ReactElement | null)
}

export default RoleBasedComponent

