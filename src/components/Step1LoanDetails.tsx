import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useFormStore } from '../context/FormContext';

const Step1LoanDetails: React.FC = () => {
  const { formData, errors, updateLoanDetails, clearErrors } = useFormStore();

  // Handle loan amount input with formatting
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits
    updateLoanDetails({ loanAmount: value });
    
    // Clear error when user starts typing
    if (errors.loanAmount) {
      clearErrors();
    }
  };

  // Handle loan type selection
  const handleLoanTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateLoanDetails({ loanType: e.target.value as any });
    
    // Clear error when user makes selection
    if (errors.loanType) {
      clearErrors();
    }
  };

  // Format number with commas for display
  const formatAmount = (amount: string) => {
    if (!amount) return '';
    return Number(amount).toLocaleString();
  };

  // Get loan type description
  const getLoanTypeDescription = (type: string) => {
    switch (type) {
      case 'Personal':
        return 'Flexible personal loans for any purpose';
      case 'Business':
        return 'Funding to grow your business';
      case 'Mortgage':
        return 'Home loans with competitive rates';
      default:
        return 'Choose the loan type that fits your needs';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Let's Start With Your Loan Details
        </h2>
        <p className="text-gray-600">
          Tell us how much you need and what type of loan you're looking for
        </p>
      </div>

      {/* Loan Amount Input */}
      <div className="space-y-2">
        <label htmlFor="loanAmount" className="block text-sm font-semibold text-gray-700">
          Loan Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="loanAmount"
            value={formatAmount(formData.loanAmount)}
            onChange={handleLoanAmountChange}
            className={`
              block w-full pl-10 pr-4 py-3 text-lg font-semibold
              border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200
              ${errors.loanAmount 
                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
            placeholder="0"
            maxLength={10}
          />
        </div>
        {errors.loanAmount && (
          <p className="text-sm text-red-600 flex items-center animate-slideDown">
            <span className="inline-block w-4 h-4 mr-1">⚠️</span>
            {errors.loanAmount}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Enter the amount you'd like to borrow (minimum $1,000)
        </p>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['5000', '10000', '25000', '50000'].map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              updateLoanDetails({ loanAmount: amount });
              if (errors.loanAmount) clearErrors();
            }}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${formData.loanAmount === amount
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
              }
            `}
          >
            ${Number(amount).toLocaleString()}
          </button>
        ))}
      </div>

      {/* Loan Type Selection */}
      <div className="space-y-2">
        <label htmlFor="loanType" className="block text-sm font-semibold text-gray-700">
          Loan Type
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <select
            id="loanType"
            value={formData.loanType}
            onChange={handleLoanTypeChange}
            className={`
              block w-full pl-10 pr-10 py-3 text-base
              border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all duration-200 appearance-none bg-white
              ${errors.loanType 
                ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <option value="">Select a loan type</option>
            <option value="Personal">Personal Loan</option>
            <option value="Business">Business Loan</option>
            <option value="Mortgage">Mortgage</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {errors.loanType && (
          <p className="text-sm text-red-600 flex items-center animate-slideDown">
            <span className="inline-block w-4 h-4 mr-1">⚠️</span>
            {errors.loanType}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {getLoanTypeDescription(formData.loanType)}
        </p>
      </div>

      {/* Interest Rate Preview (if both fields are filled) */}
      {formData.loanAmount && formData.loanType && !errors.loanAmount && !errors.loanType && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 animate-slideDown">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Estimated Interest Rate</p>
              <p className="text-xs text-gray-500">Based on your loan details</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">
                {formData.loanType === 'Personal' ? '12.5%' : 
                 formData.loanType === 'Business' ? '8.5%' : '6.5%'}
              </p>
              <p className="text-xs text-gray-500">APR*</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step1LoanDetails;