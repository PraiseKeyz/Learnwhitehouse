import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import imzge from '../assets/signup.jpg';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    surname: '',
    middlename: '',
    email: '',
    password: '',
    phone: '',
    confirmPassword: '',
    department: '',
    currentLevel: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);


  const API_BASE_URL = import.meta.env.VITE_APP_API_URL

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        password: 'Passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...signUpData } = formData;
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, signUpData);
      if (response.data) {
        navigate('/email-verification', 
          {
            state: {email: formData.email}
          }
        );
      }
    } catch (error: any) {
      setErrors({
        ...errors,
        password: error.response?.data?.message || 'Registration failed. Please try again.'
      });
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
            <h2 className="text-3xl font-bold text-[#263238]">Create an Account</h2>
            <p className="mt-2 text-gray-600">Join LearnWhitehouse to start your learning journey</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  />
                </div>
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="middlename" className="block text-sm font-medium text-gray-700">Middle Name  <span className="text-xs text-gray-400 ml-1 font-normal italic">(optional)</span></label>
                <input
                  type="text"
                  id="middlename"
                  name="middlename"
                  value={formData.middlename}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email  <span className="text-xs text-gray-400 ml-1 font-normal italic">(student email preferrably)</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                >
                  <option value="">Select Department</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="physics">Physics</option>
                  <option value="biology">Biology</option>
                  <option value="medicne & surgery">Medicine & Surgery</option>
                  <option value="nursing">Nursing</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="Zoology">Zoology</option>
                </select>
              </div>

              <div>
                <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  id="currentLevel"
                  name="currentLevel"
                  value={formData.currentLevel}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]"
                >
                  <option value="">Select Level</option>
                  <option value="100Lvl">100 Level</option>
                  <option value="200Lvl">200 Level</option>
                  <option value="300Lvl">300 Level</option>
                  <option value="400Lvl">400 Level</option>
                </select>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 pr-10 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`mt-1 block w-full rounded-lg border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } px-3 py-2 pr-10 shadow-sm focus:border-[#C62828] focus:outline-none focus:ring-1 focus:ring-[#C62828]`}
                />
              </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[#C62828] hover:bg-[#E53935] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C62828] disabled:bg-opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>Creating account</span>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : 'Sign up'}
              </button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account?</span>
              <Link to="/login" className="ml-1 font-medium text-[#C62828] hover:text-[#E53935]">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section - Hidden on mobile */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
        <img
          src={imzge}
          alt="Student studying"
          className="max-w-lg w-[1100px] object-cover h-[605px]"
        />
      </div>
    </div>
  );
};

export default Signup;