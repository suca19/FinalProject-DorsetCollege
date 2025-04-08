import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100">
      <div className="container mx-auto px-4 py-16">
        <motion.h1
          className="text-5xl font-bold text-center text-primary-800 mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to StockMaster
        </motion.h1>
        <motion.p
          className="text-xl text-center text-gray-700 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Manage your inventory with ease and efficiency
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Real-time Tracking', description: 'Monitor your stock levels in real-time', icon: '📊' },
            { title: 'Order Management', description: 'Streamline your order process', icon: '📦' },
            { title: 'Analytics', description: 'Gain insights with powerful analytics', icon: '📈' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-semibold text-primary-700 mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/register"
            className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;

