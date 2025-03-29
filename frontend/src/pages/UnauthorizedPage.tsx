import type React from "react"
import { Link } from "react-router-dom"
import { ShieldOff } from "lucide-react"

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-red-500 mb-6">
        <ShieldOff size={64} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-8 text-center">
        You don't have permission to access this page. Please contact your administrator if you believe this is an
        error.
      </p>
      <Link to="/" className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
        Return to Dashboard
      </Link>
    </div>
  )
}

export default UnauthorizedPage

