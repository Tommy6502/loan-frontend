# Financial Lead Capture System

A production-ready, multi-step lead acquisition form designed for financial services companies. This system captures loan applications, integrates with Salesforce CRM, and provides a seamless user experience optimized for conversion.

## 🎯 Project Overview

This application provides a professional, two-step loan application form that can be seamlessly embedded into existing marketing websites built on low-code CMS platforms like Webflow or WordPress. The form captures essential lead information, validates data in real-time, and submits applications to both Salesforce CRM and internal systems.

## ✨ Key Features

- **Multi-Step Form Flow**: Intuitive 2-step process (Loan Details → Contact Information)
- **Real-Time Validation**: Client-side validation with instant feedback
- **Salesforce Integration**: Ready-to-use CRM integration (currently mocked for demo)
- **Responsive Design**: Mobile-first approach with premium UI/UX
- **Embeddable Widget**: Designed for easy integration into CMS platforms
- **Professional Animations**: Smooth transitions and micro-interactions
- **Error Handling**: Comprehensive error handling with retry mechanisms
- **Loading States**: Professional loading indicators and progress tracking
- **Security Focused**: Input sanitization and secure API communication

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd financial-lead-capture
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   This will start both the frontend (React) and backend (Express) servers concurrently.

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

4. **Test the Flow**
   - Fill out Step 1: Enter loan amount ($5,000+) and select loan type
   - Proceed to Step 2: Enter contact details
   - Submit to see the success state with mock Salesforce integration

## 🏗️ Architecture & Design Decisions

### State Management
**Choice: Zustand**
- Lightweight and performant
- Excellent TypeScript support
- DevTools integration for debugging
- Simpler than Redux for this use case
- Easy to integrate with React Context when needed

### Component Structure
```
/src
  /components
    ├── FormContainer.tsx      # Main form orchestration
    ├── ProgressIndicator.tsx  # Visual progress tracking  
    ├── Step1LoanDetails.tsx   # Loan amount & type
    └── Step2ContactDetails.tsx # Personal information
  /context
    └── FormContext.tsx        # Zustand store + React context
  /api
    └── leadSubmission.ts      # API communication layer
  App.tsx                      # Main application entry
```

### Backend Structure
```
/server
  ├── index.js              # Express server & API endpoints
  └── salesforceMock.js      # Mock Salesforce integration
```

### Validation Strategy
- **Step-by-step validation**: Each step validates before proceeding
- **Real-time feedback**: Errors clear as user corrects them
- **Comprehensive rules**: Email format, phone pattern, amount ranges
- **User-friendly messages**: Clear, actionable error descriptions

### API Design
- **RESTful endpoints**: Clean, predictable API structure
- **Comprehensive error handling**: Proper HTTP status codes
- **Validation layer**: Server-side validation mirrors client-side
- **Retry mechanisms**: Automatic retry with exponential backoff

## 🔌 Salesforce Integration

### Current Implementation (Mock)
The current implementation includes a fully functional mock that simulates real Salesforce API calls. This allows for complete testing and development without requiring Salesforce credentials.

**Mock Features:**
- Lead creation with proper field mapping
- Account creation simulation  
- Lead scoring calculation
- Realistic API response delays
- Comprehensive logging

### Production Implementation

To replace the mock with real Salesforce integration:

1. **Install Salesforce SDK**
   ```bash
   npm install jsforce
   ```

2. **Set Environment Variables**
   ```bash
   # .env
   SF_CLIENT_ID=your_connected_app_client_id
   SF_CLIENT_SECRET=your_connected_app_client_secret  
   SF_USERNAME=your_salesforce_username
   SF_PASSWORD=your_password
   SF_SECURITY_TOKEN=your_security_token
   SF_LOGIN_URL=https://login.salesforce.com (or test.salesforce.com for sandbox)
   ```

3. **Update Integration Code**
   Replace the mock functions in `server/salesforceMock.js` with real API calls:
   
   ```javascript
   import jsforce from 'jsforce';
   
   const conn = new jsforce.Connection({
     oauth2: {
       clientId: process.env.SF_CLIENT_ID,
       clientSecret: process.env.SF_CLIENT_SECRET,
     }
   });
   
   await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN);
   const result = await conn.sobject("Lead").create(leadData);
   ```

### Salesforce Field Mapping
```javascript
{
  FirstName: leadData.name.split(' ')[0],
  LastName: leadData.name.split(' ').slice(1).join(' '),
  Email: leadData.email,
  Phone: leadData.phone,
  Company: 'Financial Services Lead',
  LeadSource: 'Website Form',
  Status: 'New',
  Loan_Amount__c: parseFloat(leadData.loanAmount),    // Custom field
  Loan_Type__c: leadData.loanType,                     // Custom field  
  Lead_Score__c: calculateLeadScore(leadData)          // Custom field
}
```

## 🌐 CMS Integration Guide

### WordPress Integration

**Option 1: iframe Embed**
```html
<iframe 
  src="https://your-domain.com/loan-form" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

**Option 2: Direct Integration**
1. Upload built files to your WordPress media library
2. Use a plugin like "Insert Headers and Footers" to include:
   ```html
   <script src="/path/to/your/built-js-file.js"></script>
   <div id="financial-lead-form"></div>
   ```

### Webflow Integration

1. **Host Built Files**
   - Build project: `npm run build`  
   - Upload `dist/` files to your hosting provider or CDN

2. **Add Custom Code**
   - In Webflow, add an HTML Embed element
   - Include the built CSS and JS files:
   ```html
   <link rel="stylesheet" href="https://your-cdn.com/assets/style.css">
   <div id="root"></div>
   <script src="https://your-cdn.com/assets/main.js"></script>
   ```

### Generic CMS Integration

For any CMS that supports custom HTML:

```html
<!-- Include styles -->
<link rel="stylesheet" href="https://your-domain.com/loan-form/style.css">

<!-- Container -->
<div id="financial-lead-form"></div>

<!-- Include script -->
<script src="https://your-domain.com/loan-form/main.js"></script>
```

## 🎨 Customization

### Brand Colors
Update `tailwind.config.js` to match your brand:

```javascript
colors: {
  primary: {
    500: '#your-primary-color',
    600: '#your-primary-darker',
    // ... other shades
  }
}
```

### Layout Adjustments
- Modify `max-w-2xl` classes in components to adjust form width
- Update spacing classes to match your site's design system
- Customize animation durations in the config

### API Endpoints
Update the API base URL in `src/api/leadSubmission.ts`:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourcompany.com' 
  : 'http://localhost:3001';
```

## 🧪 Testing & Quality

### Validation Testing
- Test all form fields with various input types
- Verify error messages appear and clear correctly  
- Test edge cases (special characters, very long inputs)
- Validate phone number formatting works properly

### API Testing  
- Test successful submissions
- Test API error scenarios
- Test network failure handling
- Test retry mechanism functionality

### Cross-browser Testing
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)
- Test responsive design on various screen sizes

### Accessibility Testing
- Keyboard navigation works properly
- Screen readers can navigate the form
- Color contrast ratios meet WCAG guidelines
- Form labels are properly associated

## 📊 Analytics & Monitoring

### Recommended Tracking
- Form step completion rates
- Abandonment points
- Submission success rates
- API response times
- Error frequencies

### Integration Points
- Google Analytics events
- Salesforce lead source tracking
- Custom analytics dashboard
- Error reporting service (e.g., Sentry)

## 🚦 Production Deployment

### Environment Setup
1. **Set Production Environment Variables**
   ```bash
   NODE_ENV=production
   VITE_API_URL=https://your-api-domain.com
   SF_CLIENT_ID=your_production_salesforce_client_id
   # ... other Salesforce credentials
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Deploy Backend**
   - Deploy to your preferred hosting service (AWS, Heroku, DigitalOcean)
   - Ensure environment variables are configured
   - Set up SSL certificates

4. **Deploy Frontend**
   - Upload `dist/` folder to your CDN or static hosting
   - Configure your CMS to include the built files
   - Test the integration thoroughly

### Security Considerations
- Enable CORS only for your domains
- Implement rate limiting on API endpoints
- Validate and sanitize all inputs server-side
- Use HTTPS for all communications
- Implement proper API authentication

### Performance Optimizations
- Enable gzip compression
- Set up CDN for static assets
- Implement API response caching where appropriate
- Monitor Core Web Vitals

## 📝 UX Considerations & Best Practices

### Conversion Optimization
- **Progressive Disclosure**: Only show necessary fields at each step
- **Visual Hierarchy**: Clear progression and next steps
- **Trust Signals**: Security badges, testimonials, guarantees
- **Mobile Optimization**: Touch-friendly controls and proper input types

### Error Handling Philosophy  
- **Prevent Errors**: Validate as user types, provide helpful formatting
- **Clear Communication**: Specific, actionable error messages
- **Recovery Path**: Easy ways to fix errors and continue
- **Graceful Degradation**: Form works even if JavaScript fails

### Accessibility Standards
- **WCAG 2.1 AA Compliance**: Color contrast, keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and descriptions  
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Announcement**: Screen readers announce validation errors

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Add comprehensive comments for complex logic
3. Test all changes across different browsers  
4. Update documentation for any new features
5. Ensure accessibility standards are maintained

## 📞 Support

For technical support or questions about implementation:
- Check the mock API responses in browser dev tools
- Review the Zustand store state using Redux DevTools
- Test API endpoints directly using curl or Postman
- Verify all environment variables are properly set

---

This system provides a solid foundation for financial lead capture that can be easily customized and integrated into any marketing website. The modular architecture ensures maintainability while the comprehensive error handling and validation provide a professional user experience.