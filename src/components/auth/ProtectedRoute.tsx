import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF3DD] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 border-4 border-[#C69A45]/30 border-t-[#7B211F] rounded-full animate-spin mb-4" />
        <p className="text-[#7B211F] font-serif text-lg font-semibold tracking-wide">Loading Traditional Indian Snacks...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/?auth=login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#5A1715] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 border-4 border-[#C69A45]/30 border-t-[#C69A45] rounded-full animate-spin mb-4" />
        <p className="text-[#FFF3DD] font-serif text-lg font-semibold tracking-wide">Verifying Administrator Access...</p>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location, unauthorized: true }} replace />;
  }

  return <>{children}</>;
};

