
/**
 * Lead Submission API
 * Handles communication with the backend API for lead processing
 */

// Use Vite environment variable for API base URL, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface LeadData {
  loanAmount: string;
  loanType: string;
  name: string;
  email: string;
  phone: string;
  userId?: number | null;
}

export interface SubmissionResult {
  leadId: string;
  accountId: string;
  nextStepUrl: string;
  estimatedProcessingTime: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: SubmissionResult;
  errors?: Record<string, string>;
}

/**
 * Submit lead data to the backend API
 */
export async function submitLead(leadData: LeadData): Promise<SubmissionResult> {
  try {
    console.log('🚀 Submitting lead data:', leadData);


    const response = await fetch(`${API_BASE_URL}/api/submit-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const result: ApiResponse = await response.json();

    if (!response.ok) {
      // Handle API errors
      if (result.errors) {
        // Format validation errors for display
        const errorMessages = Object.values(result.errors).filter(Boolean);
        throw new Error(`Validation Error: ${errorMessages.join(', ')}`);
      }
      
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    if (!result.data) {
      throw new Error('Invalid response format from server');
    }

    console.log('✅ Lead submission successful:', result.data);
    return result.data;

  } catch (error) {
    console.error('❌ Lead submission failed:', error);

    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to our servers. Please check your internet connection and try again.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('An unexpected error occurred while submitting your application.');
  }
}

/**
 * Check API health status
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
  const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Retry mechanism for failed submissions
 */
export async function submitLeadWithRetry(
  leadData: LeadData, 
  maxRetries: number = 3,
  delay: number = 1000
): Promise<SubmissionResult> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await submitLead(leadData);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      console.warn(`🔄 Attempt ${attempt}/${maxRetries} failed:`, lastError.message);
      
      // Don't retry on validation errors (client-side issues)
      if (lastError.message.includes('Validation Error')) {
        throw lastError;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Maximum retry attempts exceeded');
}

/**
 * Production considerations:
 * 
 * 1. Environment Configuration:
 *    - Replace localhost URL with environment variable
 *    - Use different endpoints for dev/staging/production
 *    
 * 2. Security:
 *    - Add CSRF token handling
 *    - Implement proper API authentication
 *    - Validate SSL certificates
 *    
 * 3. Monitoring:
 *    - Add analytics tracking for form submissions
 *    - Log performance metrics
 *    - Track conversion rates
 *    
 * 4. Error Handling:
 *    - Implement user-friendly error messages
 *    - Add error reporting to monitoring service
 *    - Handle rate limiting gracefully
 *    
 * Example production config:
 * 
 * const API_BASE_URL = process.env.NODE_ENV === 'production' 
 *   ? 'https://api.yourcompany.com' 
 *   : 'http://localhost:3001';
 */