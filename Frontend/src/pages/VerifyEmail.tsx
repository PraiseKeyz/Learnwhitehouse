import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        console.log(token)

        if (!token) {
          setVerificationStatus('error');
          setErrorMessage('No verification token found. Please check your verification link.');
          return;
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/verify-email?token=${token}`);

        if (response.status === 200) {
          setVerificationStatus('success');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error: any) {
        setVerificationStatus('error');
        setErrorMessage(
          error.response?.data?.message || 
          'Failed to verify email. Please try again or contact support.'
        );
      }
    };

    verifyToken();
  }, [location, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C62828] mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Verifying Your Email</h2>
            <p className="text-gray-500">Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Email Verified!</h2>
            <p className="text-gray-500 mb-4">Your email has been successfully verified.</p>
            <p className="text-sm text-gray-400">Redirecting to login page in a few seconds...</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
              <svg className="h-10 w-10 text-[#C62828]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Verification Failed</h2>
            <p className="text-gray-500 mb-6">{errorMessage}</p>
            <Link
              to="/login"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-[#C62828] rounded-md hover:bg-[#E53935] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828]"
            >
              Return to Login
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default VerifyEmail;