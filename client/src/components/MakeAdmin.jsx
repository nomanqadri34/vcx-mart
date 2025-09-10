import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const MakeAdmin = () => {
  const { user, refreshUserData } = useAuth();

  const makeAdmin = async () => {
    try {
      const response = await api.post('/auth/make-admin');
      if (response.data.success) {
        toast.success('You are now an admin!');
        await refreshUserData();
        window.location.reload();
      }
    } catch (error) {
      toast.error('Failed to make admin');
    }
  };

  if (user?.role === 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={makeAdmin}
        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
      >
        Make Admin (Dev)
      </button>
    </div>
  );
};

export default MakeAdmin;