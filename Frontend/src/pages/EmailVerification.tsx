import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  const [email, setEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      // Handle case where email is not passed (e.g., direct navigation to this page)
      // You might want to redirect to signup or show an error
      console.warn('Email not found in location state for EmailVerification page.');
      setResendMessage('Could not identify your email. Please try signing up again.');
      setResendStatus('error');
    }
  }, [location.state]);

  const handleResendVerificationEmail = async () => {
    if (!email) {
      setResendMessage('Email address not available to resend verification.');
      setResendStatus('error');
      return;
    }

    setResendStatus('loading');
    setResendMessage('');

    try {
      // Replace with your actual resend verification endpoint
      const response = await axios.post(`${API_BASE_URL}/api/auth/resend-verification-email`, { email });
      setResendMessage(response.data.message || 'A new verification email has been sent. Please check your inbox.');
      setResendStatus('success');
    } catch (error: any) {
      setResendMessage(error.response?.data?.message || 'Failed to resend verification email. Please try again.');
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
          {/* Email Icon */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-[#C62828] bg-opacity-10 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C62828]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-[#263238] mb-2">Check Your Email</h2>
          <p className="text-gray-600 mb-8">
            We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.
          </p>
          
          {/* Additional Information */}
          <div className="bg-blue-50 p-4 rounded-lg mb-8">
            <p className="text-sm text-blue-700">
              If you don't see the email, please check your spam folder. The verification link will expire in 24 hours.
            </p>
          </div>

          {resendMessage && (
            <div className={`p-3 mb-4 text-sm rounded-lg ${
              resendStatus === 'success' ? 'bg-green-50 text-green-700' : 
              resendStatus === 'error' ? 'bg-red-50 text-red-700' : 
              'bg-blue-50 text-blue-700' // For loading or other idle messages
            }`} role="alert">
              {resendMessage}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#C62828] hover:bg-[#E53935] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-colors"
            >
              Go to Login
            </Link>
            
            <button
              onClick={handleResendVerificationEmail}
              className="w-full flex justify-center py-3 px-4 border-2 border-[#C62828] rounded-lg text-[#C62828] hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] transition-colors"
            >
              {resendStatus === 'loading' ? 'Sending...' : 'Resend Verification Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;