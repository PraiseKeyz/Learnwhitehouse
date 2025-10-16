import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
//   const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError('');
    setSuccessMessage('');
  };

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email }, 
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      if (response.data) {
        setSuccessMessage(response.data.message || 'If an account with this email exists, a password reset link has been sent.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#263238]">Forgot Your Password?</h2>
            <p className="mt-2 text-gray-600">
              No worries! Enter your email address below and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border ${
                    error ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]`}
                  placeholder="Enter your email"
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
                {successMessage && (
                  <p className="text-green-600 text-sm mt-2 p-3 bg-green-50 border border-green-200 rounded-md">{successMessage}</p>
                )}
              </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !!successMessage} // Disable if loading or success
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#C62828] hover:bg-[#E53935] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sending link...</span>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : 'Send Password Reset Link'}
              </button>

            <div className="text-center text-sm">
              <Link to="/login" className="font-medium text-[#C62828] hover:text-[#E53935]">
                Back to Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default ForgotPassword;