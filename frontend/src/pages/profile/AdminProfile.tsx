"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import axiosInstance from "../../api/axiosInstance"

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

interface AdminProfileProps {
  user: User | null
}

const AdminProfile: React.FC<AdminProfileProps> = ({ user }) => {
  // State for Security form
  const [email, setEmail] = useState<string>(user?.email || "")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

  // State for Employee Information form
  const [firstName, setFirstName] = useState<string>(user?.first_name || "")
  const [lastName, setLastName] = useState<string>(user?.last_name || "")
  const [phone, setPhone] = useState<string>(user?.phone_number || "")
  const [address, setAddress] = useState<string>(user?.address || "")
  const [gender, setGender] = useState<string>(user?.gender || "M")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  // State for users management
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showNewUserForm, setShowNewUserForm] = useState<boolean>(false)
  const [showEditUserForm, setShowEditUserForm] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("profile")

  // State for new user form
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "staff",
  })

  // State for edit user
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Load all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      if (activeTab !== "users") return

      setIsLoadingUsers(true)
      try {
        // This endpoint would need to be implemented in your backend
        const response = await axiosInstance.get("/users/")
        setAllUsers(response.data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setErrorMessage("Failed to load users")
        setTimeout(() => setErrorMessage(""), 3000)
      } finally {
        setIsLoadingUsers(false)
      }
    }

    fetchAllUsers()
  }, [activeTab])

  // Handle Security form submission
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password && password !== passwordConfirmation) {
      setErrorMessage("Passwords don't match")
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    setIsSubmitting(true)

    try {
      const data: any = { email }
      if (password) {
        data.password = password
      }

      await axiosInstance.patch("/users/profile/", data)

      setSuccessMessage("Security information updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)

      // Clear password fields after successful update
      setPassword("")
      setPasswordConfirmation("")
    } catch (error) {
      console.error("Error updating security information:", error)
      setErrorMessage("Failed to update security information")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Employee Information form submission
  const handleEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axiosInstance.patch("/users/profile/", {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        address,
        gender,
      })

      setSuccessMessage("Profile updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setErrorMessage("Failed to update profile")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle new user form submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axiosInstance.post("/users/", newUser)

      setSuccessMessage("User created successfully")
      setTimeout(() => setSuccessMessage(""), 3000)

      // Refresh user list
      const response = await axiosInstance.get("/users/")
      setAllUsers(response.data)

      // Reset form and close dialog
      setNewUser({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "staff",
      })
      setShowNewUserForm(false)
    } catch (error) {
      console.error("Error creating user:", error)
      setErrorMessage("Failed to create user")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit user form submission
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setIsSubmitting(true)

    try {
      await axiosInstance.patch(`/users/${editingUser.id}/`, editingUser)

      setSuccessMessage("User updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)

      // Refresh user list
      const response = await axiosInstance.get("/users/")
      setAllUsers(response.data)

      // Close dialog
      setShowEditUserForm(false)
    } catch (error) {
      console.error("Error updating user:", error)
      setErrorMessage("Failed to update user")
      setTimeout(() => setErrorMessage(""), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      await axiosInstance.delete(`/users/${userId}/`)

      setSuccessMessage("User deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)

      // Refresh user list
      const response = await axiosInstance.get("/users/")
      setAllUsers(response.data)
    } catch (error) {
      console.error("Error deleting user:", error)
      setErrorMessage("Failed to delete user")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Filter users based on search query
  const filteredUsers = allUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold text-primary-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard
      </motion.h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {errorMessage}
        </div>
      )}

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "profile"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Management
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "profile" ? (
        <>
          {/* Security Section */}
          <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold bg-primary-600 text-white p-4">Security</h2>
            <form onSubmit={handleSecuritySubmit} className="p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Username</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        value={user?.username || ""}
                        disabled
                      />
                      <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Email*</td>
                    <td className="p-3">
                      <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">New Password</td>
                    <td className="p-3">
                      <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Leave blank to keep current password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Confirm Password</td>
                    <td className="p-3">
                      <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Confirm new password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-500 text-white p-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Employee Information Section */}
          <motion.div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold bg-primary-600 text-white p-4">Employee Information</h2>
            <form onSubmit={handleEmployeeSubmit} className="p-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">First Name*</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Last Name*</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Phone*</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Address*</td>
                    <td className="p-3">
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      ></textarea>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Gender</td>
                    <td className="p-3">
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="M"
                            checked={gender === "M"}
                            onChange={() => setGender("M")}
                            className="mr-2"
                          />
                          Male
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="gender"
                            value="F"
                            checked={gender === "F"}
                            onChange={() => setGender("F")}
                            className="mr-2"
                          />
                          Female
                        </label>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Date Joined</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        value={new Date(user?.date_joined || "").toLocaleDateString()}
                        disabled
                      />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-semibold">Role</td>
                    <td className="p-3">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                        value={user?.role || "admin"}
                        disabled
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-500 text-white p-2 px-4 rounded hover:bg-primary-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      ) : (
        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center bg-primary-600 text-white p-4">
            <h2 className="text-xl font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              User Management
            </h2>

            <button
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded flex items-center"
              onClick={() => setShowNewUserForm(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add User
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-64"
              />
            </div>

            {isLoadingUsers ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Username</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Date Joined</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-3">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="p-3">{user.username}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "manager"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-3">{new Date(user.date_joined || "").toLocaleDateString()}</td>
                        <td className="p-3 flex justify-center space-x-2">
                          <button
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                            onClick={() => {
                              setEditingUser(user)
                              setShowEditUserForm(true)
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-blue-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            className="p-1 border border-gray-300 rounded hover:bg-gray-100"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-red-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No users found matching your search.</div>
            )}
          </div>

          {/* New User Modal */}
          {showNewUserForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium">Create New User</h3>
                  <button onClick={() => setShowNewUserForm(false)} className="text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateUser} className="p-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="username" className="text-right">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="email" className="text-right">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="password" className="text-right">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="first_name" className="text-right">
                        First Name
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        value={newUser.first_name}
                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="last_name" className="text-right">
                        Last Name
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        value={newUser.last_name}
                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="role" className="text-right">
                        Role
                      </label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Supervisor</option>
                        <option value="staff">Worker</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowNewUserForm(false)}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit User Modal */}
          {showEditUserForm && editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-medium">Edit User</h3>
                  <button onClick={() => setShowEditUserForm(false)} className="text-gray-500 hover:text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleEditUser} className="p-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-username" className="text-right">
                        Username
                      </label>
                      <input
                        id="edit-username"
                        type="text"
                        value={editingUser.username}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-email" className="text-right">
                        Email
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-first-name" className="text-right">
                        First Name
                      </label>
                      <input
                        id="edit-first-name"
                        type="text"
                        value={editingUser.first_name}
                        onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-last-name" className="text-right">
                        Last Name
                      </label>
                      <input
                        id="edit-last-name"
                        type="text"
                        value={editingUser.last_name}
                        onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="edit-role" className="text-right">
                        Role
                      </label>
                      <select
                        id="edit-role"
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="col-span-3 p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Supervisor</option>
                        <option value="staff">Worker</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowEditUserForm(false)}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default AdminProfile

