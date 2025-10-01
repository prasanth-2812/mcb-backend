// Validation utility functions and constants for form validation

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  phoneWithSpaces: /^[\+]?[1-9][\d\s\-\(\)]{0,20}$/,
  name: /^[a-zA-Z\s'-]+$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  mediumPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
  url: /^https?:\/\/.+/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/,
  github: /^https?:\/\/(www\.)?github\.com\/.+/,
};

// User-friendly error messages
export const ERROR_MESSAGES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  name: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
  password: {
    tooShort: 'Password must be at least 8 characters long',
    tooLong: 'Password must be no more than 50 characters',
    weak: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    medium: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    strong: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    noMatch: 'Passwords do not match',
  },
  confirmPassword: 'Passwords do not match',
  minLength: (min: number) => `Must be at least ${min} characters long`,
  maxLength: (max: number) => `Must be no more than ${max} characters long`,
  url: 'Please enter a valid URL',
  linkedin: 'Please enter a valid LinkedIn profile URL',
  github: 'Please enter a valid GitHub profile URL',
  terms: 'You must agree to the terms and conditions',
  file: {
    required: 'File upload is required',
    tooLarge: 'File size must be less than 10MB',
    invalidType: 'Invalid file type. Please upload PDF, DOC, or DOCX files',
  },
  coverLetter: {
    tooLong: 'Cover letter must be no more than 2000 characters',
  },
  skills: {
    tooMany: 'You can add up to 20 skills',
    duplicate: 'This skill has already been added',
    invalid: 'Skill name contains invalid characters',
  },
};

// Validation rules for different form fields
export const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 50,
    custom: (value: string) => {
      if (value.length < 8) return ERROR_MESSAGES.password.tooShort;
      if (value.length > 50) return ERROR_MESSAGES.password.tooLong;
      if (!VALIDATION_PATTERNS.mediumPassword.test(value)) {
        return ERROR_MESSAGES.password.medium;
      }
      return null;
    },
  },
  confirmPassword: {
    required: true,
    custom: (value: string, formData?: any) => {
      if (formData && value !== formData.password) {
        return ERROR_MESSAGES.confirmPassword;
      }
      return null;
    },
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: VALIDATION_PATTERNS.name,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: VALIDATION_PATTERNS.name,
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: VALIDATION_PATTERNS.name,
  },
  phone: {
    required: true,
    pattern: VALIDATION_PATTERNS.phoneWithSpaces,
  },
  location: {
    required: false,
    maxLength: 100,
  },
  role: {
    required: false,
    maxLength: 100,
  },
  jobType: {
    required: false,
    maxLength: 50,
  },
  preferredLocation: {
    required: false,
    maxLength: 100,
  },
  coverLetter: {
    required: false,
    maxLength: 2000,
  },
  skill: {
    required: false,
    minLength: 2,
    maxLength: 30,
    custom: (value: string, formData?: any) => {
      if (value && !/^[a-zA-Z0-9\s\-_&+]+$/.test(value)) {
        return ERROR_MESSAGES.skills.invalid;
      }
      if (formData && formData.skills && formData.skills.includes(value)) {
        return ERROR_MESSAGES.skills.duplicate;
      }
      if (formData && formData.skills && formData.skills.length >= 20) {
        return ERROR_MESSAGES.skills.tooMany;
      }
      return null;
    },
  },
  linkedin: {
    required: false,
    pattern: VALIDATION_PATTERNS.linkedin,
  },
  github: {
    required: false,
    pattern: VALIDATION_PATTERNS.github,
  },
  website: {
    required: false,
    pattern: VALIDATION_PATTERNS.url,
  },
};

// Main validation function
export function validateField(
  fieldName: string,
  value: string,
  rules: ValidationRule,
  formData?: any
): string | null {
  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return ERROR_MESSAGES.required;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  const trimmedValue = value.trim();

  // Min length validation
  if (rules.minLength && trimmedValue.length < rules.minLength) {
    return ERROR_MESSAGES.minLength(rules.minLength);
  }

  // Max length validation
  if (rules.maxLength && trimmedValue.length > rules.maxLength) {
    return ERROR_MESSAGES.maxLength(rules.maxLength);
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(trimmedValue)) {
    switch (fieldName) {
      case 'email':
        return ERROR_MESSAGES.email;
      case 'phone':
        return ERROR_MESSAGES.phone;
      case 'firstName':
      case 'lastName':
      case 'fullName':
        return ERROR_MESSAGES.name;
      case 'linkedin':
        return ERROR_MESSAGES.linkedin;
      case 'github':
        return ERROR_MESSAGES.github;
      case 'website':
        return ERROR_MESSAGES.url;
      default:
        return 'Invalid format';
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(trimmedValue, formData);
  }

  return null;
}

// Validate entire form
export function validateForm(
  formData: any,
  rules: { [key: string]: ValidationRule }
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(fieldName => {
    const value = formData[fieldName];
    const fieldRules = rules[fieldName];
    const error = validateField(fieldName, value, fieldRules, formData);
    
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

// Check if form is valid
export function isFormValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Get field-specific validation rules
export function getFieldRules(fieldName: string): ValidationRule {
  return VALIDATION_RULES[fieldName as keyof typeof VALIDATION_RULES] || {};
}

// Password strength checker
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (password.length < 8) {
    return { score: 0, label: 'Too short', color: '#F44336' };
  }

  let score = 0;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return { score: 1, label: 'Weak', color: '#F44336' };
    case 2:
      return { score: 2, label: 'Fair', color: '#FF9800' };
    case 3:
      return { score: 3, label: 'Good', color: '#4CAF50' };
    case 4:
      return { score: 4, label: 'Strong', color: '#4CAF50' };
    default:
      return { score: 0, label: 'Too short', color: '#F44336' };
  }
}

// Phone number formatter
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else if (cleaned.length <= 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else {
    return `+${cleaned.slice(0, -10)} (${cleaned.slice(-10, -7)}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }
}

// Email validation with detailed feedback
export function validateEmailDetailed(email: string): {
  isValid: boolean;
  message: string;
} {
  if (!email || email.trim() === '') {
    return { isValid: false, message: ERROR_MESSAGES.required };
  }

  const trimmedEmail = email.trim();
  
  if (!VALIDATION_PATTERNS.email.test(trimmedEmail)) {
    if (!trimmedEmail.includes('@')) {
      return { isValid: false, message: 'Email must contain @ symbol' };
    }
    if (trimmedEmail.split('@').length !== 2) {
      return { isValid: false, message: 'Email must contain only one @ symbol' };
    }
    if (!trimmedEmail.split('@')[1].includes('.')) {
      return { isValid: false, message: 'Email must contain a domain with a dot' };
    }
    return { isValid: false, message: ERROR_MESSAGES.email };
  }

  return { isValid: true, message: '' };
}

// Real-time validation hook
export function useValidation() {
  const validateFieldRealTime = (
    fieldName: string,
    value: string,
    formData?: any
  ): string | null => {
    const rules = getFieldRules(fieldName);
    return validateField(fieldName, value, rules, formData);
  };

  const validateFormRealTime = (
    formData: any,
    fieldsToValidate: string[] = []
  ): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    fieldsToValidate.forEach(fieldName => {
      const value = formData[fieldName];
      const rules = getFieldRules(fieldName);
      const error = validateField(fieldName, value, rules, formData);
      
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  };

  return {
    validateField: validateFieldRealTime,
    validateForm: validateFormRealTime,
    isFormValid,
    getPasswordStrength,
    formatPhoneNumber,
    validateEmailDetailed,
  };
}

export default {
  validateField,
  validateForm,
  isFormValid,
  getFieldRules,
  getPasswordStrength,
  formatPhoneNumber,
  validateEmailDetailed,
  VALIDATION_PATTERNS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  useValidation,
};
