import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Unauthorized Access
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
