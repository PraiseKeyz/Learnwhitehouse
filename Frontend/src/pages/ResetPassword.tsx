import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset link.');
      // Optionally redirect or disable the form
    }
  }, [location.search]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (newPassword.length < 6) { // Basic password length validation
      setError('Password must be at least 6 characters long.');
      return false;
    }
    // Add more complex password validation if needed (e.g., regex for uppercase, number, special char)
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) {
      if (!token) setError('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token,
        newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data) {
        setSuccessMessage('Your password has been reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#263238]">Reset Your Password</h2>
          <p className="mt-2 text-gray-600">
            Enter your new password below.
          </p>
        </div>

        {!token && error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg text-center" role="alert">
            {error} Please <Link to="/forgot-password" className="font-medium underline">request a new reset link</Link>.
          </div>
        )}

        {token && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  placeholder="Confirm new password"
                />
                 <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
              {successMessage && (
                <p className="text-green-600 text-sm mt-2 p-3 bg-green-50 border border-green-200 rounded-md">{successMessage}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!successMessage || !token}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#C62828] hover:bg-[#E53935] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>Resetting Password...</span>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : 'Reset Password'}
            </button>

            {successMessage && (
              <div className="text-center text-sm mt-4">
                <Link to="/login" className="font-medium text-[#C62828] hover:text-[#E53935]">
                  Go to Sign In
                </Link>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;