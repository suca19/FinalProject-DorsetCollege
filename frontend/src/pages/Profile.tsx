import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  // State for Security form
  const [employeeId, setEmployeeId] = useState<string>('1');
  const [email, setEmail] = useState<string>('employee01@mail.com');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');

  // State for Employee Information form
  const [name, setName] = useState<string>('Employee A');
  const [phone, setPhone] = useState<string>('123456780');
  const [address, setAddress] = useState<string>('Address ED');
  const [gender, setGender] = useState<string>('M');
  const [dateOfJoining, setDateOfJoining] = useState<string>('01/01/2017');

  // Handle Security form submission
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Security Form Submitted:', { employeeId, email, password, passwordConfirmation });
    // Add API call or further logic here
  };

  // Handle Employee Information form submission
  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Employee Form Submitted:', { name, phone, address, gender, dateOfJoining });
    // Add API call or further logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold text-primary-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Profile
      </motion.h1>

      {/* Security Section */}
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold bg-primary-600 text-white p-4">Security</h2>
        <form onSubmit={handleSecuritySubmit} className="p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Employee ID</td>
                <td className="p-3">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
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
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Password*</td>
                <td className="p-3">
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Current or new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Password again*</td>
                <td className="p-3">
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Confirm password"
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
              className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600"
            >
              Save
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
        <h2 className="text-2xl font-bold bg-primary-600 text-white p-4">Employee Information</h2>
        <form onSubmit={handleEmployeeSubmit} className="p-4">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Name*</td>
                <td className="p-3">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        checked={gender === 'M'}
                        onChange={() => setGender('M')}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={gender === 'F'}
                        onChange={() => setGender('F')}
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 font-semibold">Date of joining*</td>
                <td className="p-3">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary-500 text-white p-2 rounded hover:bg-primary-600"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfilePage;