import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Define form data types
export interface LoanDetails {
  loanAmount: string;
  loanType: 'Personal' | 'Business' | 'Mortgage' | '';
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

export interface FormData extends LoanDetails, ContactDetails {}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface FormErrors {
  loanAmount?: string;
  loanType?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface SubmissionState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  result: any;
}

interface FormState {
  // Current step (1-based)
  currentStep: number;
  
  // Authentication state
  auth: AuthState;
  
  // Form data
  formData: FormData;
  
  // Validation errors
  errors: FormErrors;
  
  // Submission state
  submission: SubmissionState;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setAuth: (auth: AuthState) => void;
  logout: () => void;
  updateLoanDetails: (details: Partial<LoanDetails>) => void;
  updateContactDetails: (details: Partial<ContactDetails>) => void;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  setSubmissionState: (state: Partial<SubmissionState>) => void;
  resetForm: () => void;
  
  // Validation helpers
  validateStep1: () => boolean;
  validateStep2: () => boolean;
}

// Create Zustand store with devtools for debugging
export const useFormStore = create<FormState>()(
  devtools(
    (set, get) => ({
      currentStep: 1,
      
      auth: {
        isAuthenticated: false,
        user: null,
        token: localStorage.getItem('token')
      },
      
      formData: {
        loanAmount: '',
        loanType: '',
        name: '',
        email: '',
        phone: ''
      },
      
      errors: {},
      
      submission: {
        isLoading: false,
        isSuccess: false,
        error: null,
        result: null
      },
      
      setCurrentStep: (step) => {
        set({ currentStep: step }, false, 'setCurrentStep');
      },
      
      setAuth: (auth) => {
        if (auth.token) {
          localStorage.setItem('token', auth.token);
        } else {
          localStorage.removeItem('token');
        }
        set({ auth }, false, 'setAuth');
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({
          auth: {
            isAuthenticated: false,
            user: null,
            token: null
          }
        }, false, 'logout');
      },
      
      updateLoanDetails: (details) => {
        set(
          (state) => ({
            formData: { ...state.formData, ...details }
          }),
          false,
          'updateLoanDetails'
        );
      },
      
      updateContactDetails: (details) => {
        set(
          (state) => ({
            formData: { ...state.formData, ...details }
          }),
          false,
          'updateContactDetails'
        );
      },
      
      setErrors: (errors) => {
        set({ errors }, false, 'setErrors');
      },
      
      clearErrors: () => {
        set({ errors: {} }, false, 'clearErrors');
      },
      
      setSubmissionState: (state) => {
        set(
          (current) => ({
            submission: { ...current.submission, ...state }
          }),
          false,
          'setSubmissionState'
        );
      },
      
      resetForm: () => {
        set({
          currentStep: 1,
          formData: {
            loanAmount: '',
            loanType: '',
            name: '',
            email: '',
            phone: ''
          },
          errors: {},
          submission: {
            isLoading: false,
            isSuccess: false,
            error: null,
            result: null
          }
        }, false, 'resetForm');
      },
      
      validateStep1: () => {
        const { formData } = get();
        const newErrors: FormErrors = {};
        
        // Validate loan amount
        if (!formData.loanAmount.trim()) {
          newErrors.loanAmount = 'Loan amount is required';
        } else if (isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
          newErrors.loanAmount = 'Please enter a valid loan amount';
        } else if (Number(formData.loanAmount) < 1000) {
          newErrors.loanAmount = 'Minimum loan amount is $1,000';
        } else if (Number(formData.loanAmount) > 10000000) {
          newErrors.loanAmount = 'Maximum loan amount is $10,000,000';
        }
        
        // Validate loan type
        if (!formData.loanType) {
          newErrors.loanType = 'Please select a loan type';
        }
        
        set({ errors: newErrors }, false, 'validateStep1');
        return Object.keys(newErrors).length === 0;
      },
      
      validateStep2: () => {
        const { formData } = get();
        const newErrors: FormErrors = {};
        
        // Validate name
        if (!formData.name.trim()) {
          newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
          newErrors.name = 'Name contains invalid characters';
        }
        
        // Validate email
        if (!formData.email.trim()) {
          newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          newErrors.email = 'Please enter a valid email address';
        }
        
        // Validate phone
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        } else {
          // Remove all non-digits for validation
          const digitsOnly = formData.phone.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
          } else if (digitsOnly.length > 11) {
            newErrors.phone = 'Phone number is too long';
          }
        }
        
        set({ errors: newErrors }, false, 'validateStep2');
        return Object.keys(newErrors).length === 0;
      }
    }),
    {
      name: 'financial-form-store' // Name for Redux DevTools
    }
  )
);

// React Context for providing the store (optional, but provides better React integration)
const FormContext = createContext<typeof useFormStore | null>(null);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <FormContext.Provider value={useFormStore}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use form context (optional alternative to direct Zustand usage)
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context();
};