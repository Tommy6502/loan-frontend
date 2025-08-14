import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { useFormStore } from '../context/FormContext';

const Step2ContactDetails: React.FC = () => {
  const { formData, errors, updateContactDetails, clearErrors } = useFormStore();

  // Handle input changes with error clearing
  const handleInputChange = (field: string, value: string) => {
    updateContactDetails({ [field]: value });
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof typeof errors]) {
      clearErrors();
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    handleInputChange('phone', formatted);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Now Let's Get Your Contact Information
        </h2>
        <p className="text-gray-600">
          We'll use this information to process your application and keep you updated
        </p>
      </div>

      {/* Loan Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Your Loan Request</p>
            <p className="font-semibold text-gray-900">
              ${Number(formData.loanAmount).toLocaleString()} {formData.loanType} Loan
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Estimated Rate</p>
            <p className="text-lg font-bold text-blue-600">
              {formData.loanType === 'Personal' ? '12.5%' : 
               formData.loanType === 'Business' ? '8.5%' : '6.5%'} APR
            </p>
          </div>
        </div>
      </div>

      {/* Full Name Input */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`
              block w-full pl-10 pr-4 py-3 text-base
              border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${errors.name 
                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center animate-slideDown">
            <span className="inline-block w-4 h-4 mr-1">⚠️</span>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`
              block w-full pl-10 pr-4 py-3 text-base
              border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${errors.email 
                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center animate-slideDown">
            <span className="inline-block w-4 h-4 mr-1">⚠️</span>
            {errors.email}
          </p>
        )}
        <p className="text-xs text-gray-500">
          We'll send important updates about your application to this email
        </p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`
              block w-full pl-10 pr-4 py-3 text-base
              border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${errors.phone 
                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
            placeholder="(555) 123-4567"
            autoComplete="tel"
          />
        </div>
        {errors.phone && (
          <p className="text-sm text-red-600 flex items-center animate-slideDown">
            <span className="inline-block w-4 h-4 mr-1">⚠️</span>
            {errors.phone}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Our loan specialists may call to discuss your application
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 mb-1">Your information is secure</p>
            <p className="text-xs text-gray-600">
              We use bank-level encryption to protect your personal information. 
              Your data will only be used to process your loan application and 
              will not be shared with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2ContactDetails;