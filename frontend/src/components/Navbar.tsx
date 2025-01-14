import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {
            isAuthenticated ? 
            <Link to="/dashboard" className="text-white text-2xl font-bold">StockMaster</Link>
            :
            <Link to="/" className="text-white text-2xl font-bold">StockMaster</Link>
            }
        </motion.div>
        <motion.ul
          className="flex space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard" className="text-white hover:text-accent-300 transition duration-300">Dashboard</Link></li>
              <li><Link to="/inventory" className="text-white hover:text-accent-300 transition duration-300">Inventory</Link></li>
              <li><Link to="/orders" className="text-white hover:text-accent-300 transition duration-300">Orders</Link></li>
              <li><Link to="/profile" className="text-white hover:text-accent-300 transition duration-300">Profile</Link></li>
              <li><button onClick={handleLogout} className="text-white hover:text-accent-300 transition duration-300">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-white hover:text-accent-300 transition duration-300">Login</Link></li>
              <li><Link to="/register" className="text-white hover:text-accent-300 transition duration-300">Register</Link></li>
            </>
          )}
        </motion.ul>
      </div>
    </nav>
  );
};

export default Navbar;

