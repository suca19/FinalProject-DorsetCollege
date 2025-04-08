import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import { Register } from './pages/Register';
import Dashboard from './pages/AdminDashboard';
import Inventory from './pages/inventory';
import Orders from './pages/Orders';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/ProtectedRoutes';
import UnauthorizedPage from './pages/UnauthorizedPage';
import './resize-observer-polyfill';

const App: React.FC = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // User is authenticated, perform any necessary actions here
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes for all authenticated users */}
              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              
              {/* Protected routes for admin only */}
              <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Route>
              
              {/* Protected routes for supervisor/manager only */}
              <Route element={<PrivateRoute allowedRoles={['manager', 'admin']} />}>
                <Route path="/supervisor/*" element={<SupervisorRoutes />} />
              </Route>
              
              {/* Unauthorized page */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
          </main>
          <footer className="bg-primary-600 text-white text-center py-4">
            <p>&copy;  .StockMaster. </p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

// Supervisor routes component
const SupervisorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="team" element={<div>Team Management</div>} />
      <Route path="reports" element={<div>Reports</div>} />
      <Route path="*" element={<Navigate to="/supervisor/team" replace />} />
    </Routes>
  );
};

export default App;