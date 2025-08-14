import React from 'react';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useFormStore } from '../context/FormContext';
import ProgressIndicator from './ProgressIndicator';
import Step1LoanDetails from './Step1LoanDetails';
import Step2ContactDetails from './Step2ContactDetails';
import { submitLead } from '../api/leadSubmission';

const FormContainer: React.FC = () => {
  const {
    currentStep,
    formData,
    submission,
    setCurrentStep,
    validateStep1,
    validateStep2,
    setSubmissionState,
    resetForm
  } = useFormStore();

  // Handle next step navigation
  const handleNext = async () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        await handleSubmit();
      }
    }
  };

  // Handle previous step navigation
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { auth } = useFormStore.getState();
    
    setSubmissionState({ 
      isLoading: true, 
      error: null, 
      isSuccess: false 
    });

    try {
      const submitData = {
        ...formData,
        userId: auth.user?.id || null
      };
      
      const result = await submitLead(submitData);
      
      setSubmissionState({
        isLoading: false,
        isSuccess: true,
        error: null,
        result
      });
    } catch (error) {
      setSubmissionState({
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        result: null
      });
    }
  };

  // Handle starting over
  const handleStartOver = () => {
    resetForm();
  };

  // Render success state
  if (submission.isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg">
            Thank you {formData.name}! We've received your application for a{' '}
            <span className="font-semibold text-gray-900">
              ${Number(formData.loanAmount).toLocaleString()} {formData.loanType} loan
            </span>.
          </p>
          
          {submission.result?.isFirstTimeUser ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🔐</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Account Created!</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    We've created an account for you and sent login credentials to{' '}
                    <strong>{formData.email}</strong>.
                  </p>
                  <p className="text-xs text-blue-700">
                    📧 Check your email for your username and password to track your application progress.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                📧 A confirmation email has been sent to <strong>{formData.email}</strong> with your application details and next steps.
              </p>
            </div>
          )}

          {submission.result && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Processing time: {submission.result.estimatedProcessingTime}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Application ID: {submission.result.leadId}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                  Check your email for next steps
                </li>
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/loan-application-process'}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue to Full Application
            </button>
            
            <button
              onClick={handleStartOver}
              className="w-full text-gray-600 hover:text-gray-800 py-2 transition-colors duration-200"
            >
              Start Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (submission.error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something Went Wrong
            </h2>
            <p className="text-gray-600">
              We encountered an issue while processing your application.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{submission.error}</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={submission.isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submission.isLoading ? 'Retrying...' : 'Try Again'}
            </button>
            <button
              onClick={handleStartOver}
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render form steps
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} />

        {/* Form Content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && <Step1LoanDetails />}
          {currentStep === 2 && <Step2ContactDetails />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1 || submission.isLoading}
            className={`
              flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${currentStep === 1 || submission.isLoading
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex-1 text-center">
            <span className="text-sm text-gray-500">
              {currentStep} of 2 steps completed
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={submission.isLoading}
            className={`
              flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${submission.isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }
              text-white
            `}
          >
            {submission.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : currentStep === 2 ? (
              <>
                Submit Application
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your information is encrypted and secure. 
            By continuing, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormContainer;