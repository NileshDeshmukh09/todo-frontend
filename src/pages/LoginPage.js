import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import LoginFormMUI from '../components/auth/LoginFormMUI';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      showNotification('Successfully logged in!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              create a new account
            </Link>
          </p>
        </div>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <LoginFormMUI onSubmit={handleLogin} />
        </Box>
      </div>
    </div>
  );
};

export default LoginPage; 