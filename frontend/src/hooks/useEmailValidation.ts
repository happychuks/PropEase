import { useState, useCallback } from 'react';
import { authAPI } from '@/lib/api';

interface EmailValidationResult {
  isValid: boolean;
  isAvailable: boolean;
  message: string;
  isLoading: boolean;
}

export function useEmailValidation() {
  const [validationState, setValidationState] = useState<EmailValidationResult>({
    isValid: false,
    isAvailable: false,
    message: '',
    isLoading: false,
  });

  const validateEmail = useCallback(async (email: string): Promise<EmailValidationResult> => {
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const result = {
        isValid: false,
        isAvailable: false,
        message: 'Please enter a valid email address',
        isLoading: false,
      };
      setValidationState(result);
      return result;
    }

    setValidationState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authAPI.checkEmailAvailability(email);
      
      if (response.data.success) {
        const isAvailable = response.data.data.available;
        const result = {
          isValid: true,
          isAvailable: isAvailable,
          message: isAvailable 
            ? 'Email is available' 
            : 'Email is already registered or used in an application',
          isLoading: false,
        };
        setValidationState(result);
        return result;
      } else {
        const result = {
          isValid: false,
          isAvailable: false,
          message: response.data.message || 'Error checking email availability',
          isLoading: false,
        };
        setValidationState(result);
        return result;
      }
    } catch (error: any) {
      const result = {
        isValid: false,
        isAvailable: false,
        message: error.response?.data?.message || 'Error checking email availability',
        isLoading: false,
      };
      setValidationState(result);
      return result;
    }
  }, []);

  const resetValidation = useCallback(() => {
    setValidationState({
      isValid: false,
      isAvailable: false,
      message: '',
      isLoading: false,
    });
  }, []);

  return {
    ...validationState,
    validateEmail,
    resetValidation,
  };
}
