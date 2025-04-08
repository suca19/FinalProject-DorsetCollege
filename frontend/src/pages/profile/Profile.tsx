// pages/profile/Profile.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminProfile from '../../pages/profile/AdminProfile';
import SupervisorProfile from '../../pages/profile/SupervisorProfile';
import WorkerProfile from '../../pages/profile/WorkerProfile';

const Profile: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  console.log('Profile component - user:', user);
  console.log('Profile component - user role:', user?.role);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  // Render different profile components based on user role
  if (user?.role === 'admin') {
    console.log('Rendering AdminProfile');
    return <AdminProfile user={user} />;
  } else if (user?.role === 'manager') {
    console.log('Rendering SupervisorProfile');
    return <SupervisorProfile user={user} />;
  } else {
    console.log('Rendering WorkerProfile');
    return <WorkerProfile user={user} />;
  }
};

export default Profile;