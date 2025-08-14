import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  totalSteps = 2 
}) => {
  const steps = [
    { number: 1, label: 'Loan Details', description: 'Amount & Type' },
    { number: 2, label: 'Contact Info', description: 'Personal Details' }
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
        
        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-out
                    ${isCompleted 
                      ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-lg scale-105' 
                      : isCurrent
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-100'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold text-sm">{step.number}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div 
                    className={`
                      font-medium text-sm transition-colors duration-200
                      ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                    `}
                  >
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Step Counter */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;