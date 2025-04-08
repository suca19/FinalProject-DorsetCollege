"use client"

import type React from "react"
import { useState } from "react"
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

interface WorkerProfileProps {
  user: User | null
}

const WorkerProfile: React.FC<WorkerProfileProps> = ({ user }) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold text-primary-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Profile
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
                    value={user?.role || "staff"}
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
    </div>
  )
}

export default WorkerProfile

