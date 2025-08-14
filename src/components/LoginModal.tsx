import React, { useState } from 'react';
import { X, LogIn, Eye, EyeOff } from 'lucide-react';
import { useFormStore } from '../context/FormContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setAuth } = useFormStore();
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isSignupMode ? '/api/register' : '/api/login';
      console.log(`🔐 Attempting ${isSignupMode ? 'registration' : 'login'} for:`, formData.email);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const apiUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`📡 Making ${isSignupMode ? 'registration' : 'login'} request to:`, apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(`📥 ${isSignupMode ? 'Registration' : 'Login'} response:`, { status: response.status, success: result.success });

      if (response.ok && result.success) {
        if (isSignupMode) {
          console.log('✅ Registration successful, user:', result.data.user.email);
          // Switch to login mode after successful registration
          setIsSignupMode(false);
          setFormData({ name: '', email: formData.email, phone: '', password: '' });
          setError('Registration successful! Please sign in with your credentials.');
          return;
        }
        
        console.log('✅ Login successful, user:', result.data.user.email, 'role:', result.data.user.role);
        
        // Store token in localStorage
        localStorage.setItem('token', result.data.token);
        
        // Update auth state
        setAuth({
          isAuthenticated: true,
          user: result.data.user,
          token: result.data.token
        });

        // Reset form and close modal
        setFormData({ name: '', email: '', phone: '', password: '' });
        onClose();
      } else {
        console.log(`❌ ${isSignupMode ? 'Registration' : 'Login'} failed:`, result.message);
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error(`❌ ${isSignupMode ? 'Registration' : 'Authentication'} error:`, error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setError('');
    setShowPassword(false);
    setIsSignupMode(false);
    onClose();
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setError('');
    setFormData({ name: '', email: '', phone: '', password: '' });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3">
              <LogIn className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignupMode ? 'Create Account' : 'Sign In'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {isSignupMode 
              ? 'Create an account to save your loan applications and track their progress.'
              : 'Sign in to access your account and manage your loan applications.'
            }
          </p>

          {error && !error.includes('Registration successful') && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {error && error.includes('Registration successful') && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignupMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={isSignupMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            {isSignupMode && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password || (isSignupMode && !formData.name)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isSignupMode ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isSignupMode ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleMode}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              {isSignupMode 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Create one"
              }
            </button>
          </div> */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-500 text-center">
              Demo Admin: admin@company.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;