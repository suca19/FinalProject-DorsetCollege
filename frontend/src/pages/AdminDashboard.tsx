import React from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const stockData = {
    labels: ['Item A', 'Item B', 'Item C', 'Item D'],
    datasets: [{
      label: 'Stock Levels',
      data: [120, 150, 90, 180],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  const historyData = {
    labels: ['Issued', 'Received'],
    datasets: [{
      data: [200, 300],
      backgroundColor: ['#FF6384', '#36A2EB']
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        className="text-4xl font-bold text-gray-800 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Admin Dashboard
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Total Stocks', 'Total History', 'Total Categories', "Today's Visitors"].map((title, index) => (
          <motion.div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
            <p className="text-2xl font-bold">{Math.floor(Math.random() * 500)}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Stock Statistics</h2>
          <Bar data={stockData} />
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Stock History</h2>
          <Doughnut data={historyData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
