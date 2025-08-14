import React from 'react';
import { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import { FormProvider } from './context/FormContext';
import { useFormStore } from './context/FormContext';
import FormContainer from './components/FormContainer';
import LoginModal from './components/LoginModal';
import UserMenu from './components/UserMenu';
import AdminDashboard from './components/AdminDashboard';

/**
 * Main App Component with Authentication
 */
const AppContent: React.FC = () => {
  const { auth, setAuth } = useFormStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('🔍 Checking authentication on app load, token exists:', !!token);
      
      if (token) {
        try {
          console.log('🔍 Verifying existing token...');
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
          const response = await fetch(`${API_BASE_URL}/api/verify-token`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Token verified, user:', result.data.user.email, 'role:', result.data.user.role);
            setAuth({
              isAuthenticated: true,
              user: result.data.user,
              token
            });
          } else {
            console.log('❌ Token verification failed, status:', response.status);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
        }
      } else {
        console.log('ℹ️ No token found in localStorage');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [setAuth]);

  // Check if admin wants to view dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true' && auth.isAuthenticated && auth.user?.role === 'admin') {
      setShowAdminDashboard(true);
    }
  }, [auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">$</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show admin dashboard if requested and user is admin
  if (showAdminDashboard && auth.isAuthenticated && auth.user?.role === 'admin') {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1"></div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">$</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Financial Solutions
              </h1>
            </div>
            
            <div className="flex-1 flex justify-end">
              {auth.isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get pre-approved for your loan in just 2 minutes. 
            Competitive rates, fast approval, and personalized service.
          </p>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Secure & Encrypted
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Hidden Fees
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Quick Approval
            </div>
          </div>

          {auth.isAuthenticated && (
            <div className="mt-4 bg-blue-50 rounded-lg p-3 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                Welcome back, <span className="font-semibold">{auth.user?.name}</span>! 
                Ready to apply for your loan?
              </p>
              {auth.user?.role === 'admin' && (
                <button
                  onClick={() => setShowAdminDashboard(true)}
                  className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  View Admin Dashboard
                </button>
              )}
            </div>
          )}
        </header>

        {/* Form Container */}
        <main>
          <FormContainer />
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Approval Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">24hrs</div>
                <div className="text-sm text-gray-600">Average Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50k+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              © 2025 Financial Solutions. Licensed lender. NMLS #123456. 
              Equal Housing Opportunity. All loans subject to credit approval.
            </p>
          </div>
        </footer>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

/**
 * Main Application Component
 * 
 * This component serves as the entry point for the Financial Lead Capture form.
 * It's designed to be embeddable in CMS platforms like Webflow or WordPress.
 */
const App: React.FC = () => {
  return (
    <FormProvider>
      <AppContent />
    </FormProvider>
  );
};

export default App;

/**
 * Embedding Instructions for CMS Integration:
 * 
 * 1. WordPress Integration:
 *    - Build the project: npm run build
 *    - Upload dist/ files to your server
 *    - Add iframe: <iframe src="https://your-domain.com/loan-form" width="100%" height="800px"></iframe>
 *    - Or use WordPress plugin to embed React apps
 * 
 * 2. Webflow Integration:
 *    - Host the built files on a CDN or your server
 *    - Add custom code embed element
 *    - Include the built CSS and JS files
 *    - Add <div id="root"></div> where you want the form
 * 
 * 3. Generic CMS/HTML Integration:
 *    - Build and host the files
 *    - Include via script tags:
 *      <script src="https://your-cdn.com/loan-form.js"></script>
 *      <div id="financial-lead-form"></div>
 * 
 * 4. Customization for CMS:
 *    - Modify CSS variables for brand colors
 *    - Adjust container max-width for your layout
 *    - Add custom CSS classes for theme integration
 *    - Configure API endpoints for your domain
 */