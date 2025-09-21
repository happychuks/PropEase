'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationAPI, ProspectiveTenantApplicationRequest } from '@/lib/api';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useEmailValidation } from '@/hooks/useEmailValidation';

// Form validation schema
const applicationSchema = z.object({
  applicantEmail: z.string().email('Please enter a valid email address'),
  applicantName: z.string().min(2, 'Name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'STUDENT', 'RETIRED'], {
    message: 'Please select your employment status',
  }),
  employerName: z.string().optional(),
  familySize: z.number().min(1, 'Family size must be at least 1').max(20, 'Family size cannot exceed 20'),
  desiredAccommodationType: z.enum([
    'STUDIO', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 
    'MINI_FLAT', 'SELF_CONTAINED', 'DUPLEX'
  ], {
    message: 'Please select your desired accommodation type',
  }),
  previousAddress: z.string().min(5, 'Please enter your previous address'),
  reasonForLeaving: z.string().min(10, 'Please provide a reason for leaving (at least 10 characters)'),
  yearlyRentCapacity: z.number().min(1000, 'Yearly rent capacity must be at least $1,000'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  onSuccess?: (applicationId: string) => void;
}

export function ApplicationForm({ onSuccess }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailValidated, setEmailValidated] = useState(false);
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const { validateEmail, isValid, isAvailable, message, isLoading: emailLoading, resetValidation } = useEmailValidation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const employmentStatus = watch('employmentStatus');
  const applicantEmail = watch('applicantEmail');

  // Debounced email validation
  useEffect(() => {
    if (applicantEmail && applicantEmail.includes('@')) {
      const timeoutId = setTimeout(() => {
        validateEmail(applicantEmail).then((result) => {
          setEmailValidated(result.isValid && result.isAvailable);
        });
      }, 500); // 500ms delay

      return () => clearTimeout(timeoutId);
    } else {
      setEmailValidated(false);
      resetValidation();
    }
  }, [applicantEmail, validateEmail, resetValidation]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!emailValidated) {
      if (isValid && !isAvailable) {
        showError('This email is already registered or used in an application. Please use a different email.');
      } else {
        showError('Please ensure your email is valid and available');
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    const loadingToast = showLoading('Submitting your application...');

    try {
      const applicationData: ProspectiveTenantApplicationRequest = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString(),
        employerName: data.employerName || undefined,
      };

      const response = await applicationAPI.submit(applicationData);
      
      if (response.data.success) {
        dismiss(loadingToast);
        showSuccess('Application submitted successfully! We will review it shortly.');
        setSubmitStatus('success');
        reset();
        onSuccess?.(response.data.data.id);
      } else {
        dismiss(loadingToast);
        showError(response.data.message || 'Failed to submit application');
        setSubmitStatus('error');
      }
    } catch (error: unknown) {
      dismiss(loadingToast);
      const errorMessage = (error as any)?.response?.data?.message || 
        'An error occurred while submitting your application. Please try again.';
      showError(errorMessage);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-green-50 border-green-300 shadow-lg animate-fade-in-up">
        <CardHeader className="text-center p-6 sm:p-8">
          <CheckCircle className="h-16 w-16 text-green-700 mx-auto mb-4 animate-pulse-glow" />
          <CardTitle className="text-2xl sm:text-3xl font-bold text-green-900">Application Submitted!</CardTitle>
          <CardDescription className="text-green-800 text-base sm:text-lg mt-4">
            Your application has been successfully submitted. We will review it shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center p-6 sm:p-8 pt-0">
          <p className="text-gray-700 text-sm sm:text-base mb-6">
            You can check your application status using your email on the &quot;Check Status&quot; page.
          </p>
          <Button 
            onClick={() => setSubmitStatus('idle')}
            variant="outline"
            className="w-full sm:w-auto border-green-400 text-green-800 hover:bg-green-100 hover:border-green-500"
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white border border-gray-200 shadow-2xl animate-fade-in-up">
      <CardHeader className="bg-blue-50 rounded-t-lg p-6 sm:p-8 border-b border-blue-200">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800">
          Tenancy Application Form
        </CardTitle>
        <CardDescription className="text-center text-gray-700 text-base sm:text-lg mt-4">
          Please fill out all the required information below. We&apos;ll review your application and get back to you soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-blue-300 pb-2 sm:pb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="applicantName">Full Name *</Label>
                <Input
                  id="applicantName"
                  {...register('applicantName')}
                  placeholder="Enter your full name"
                  className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.applicantName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-blue-400'}`}
                />
                {errors.applicantName && (
                  <p className="text-sm text-red-600 mt-1">{errors.applicantName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="applicantEmail">Email Address *</Label>
                <div className="relative">
                  <Input
                    id="applicantEmail"
                    type="email"
                    {...register('applicantEmail')}
                    placeholder="Enter your email address"
                    className={`pr-10 ${
                      errors.applicantEmail 
                        ? 'border-red-500 bg-red-50' 
                        : emailValidated 
                        ? 'border-green-500 bg-green-50' 
                        : isValid && !isAvailable 
                        ? 'border-red-500 bg-red-50' 
                        : ''
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailLoading ? (
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    ) : emailValidated ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isValid && !isAvailable ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
                {errors.applicantEmail && (
                  <p className="text-sm text-red-600 mt-1">{errors.applicantEmail.message}</p>
                )}
                {message && !errors.applicantEmail && (
                  <p className={`mt-1 text-xs ${
                    emailValidated 
                      ? 'text-green-600' 
                      : isValid && !isAvailable 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}>
                    {message}
                  </p>
                )}
                {!emailValidated && isValid && !isAvailable && !errors.applicantEmail && (
                  <p className="mt-1 text-xs text-red-600 font-medium">
                    ⚠️ This email cannot be used for applications
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="Enter your phone number"
                  className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-blue-400'}`}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  className={`transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-blue-400'}`}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Employment & Financial */}
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-green-300 pb-2 sm:pb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Employment & Financial
            </h3>
            
            <div>
              <Label htmlFor="employmentStatus">Employment Status *</Label>
              <select
                id="employmentStatus"
                {...register('employmentStatus')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                  errors.employmentStatus ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <option value="">Select your employment status</option>
                <option value="EMPLOYED">Employed</option>
                <option value="SELF_EMPLOYED">Self-employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="STUDENT">Student</option>
                <option value="RETIRED">Retired</option>
              </select>
              {errors.employmentStatus && (
                <p className="text-sm text-red-600 mt-1">{errors.employmentStatus.message}</p>
              )}
            </div>

            {employmentStatus === 'EMPLOYED' && (
              <div>
                <Label htmlFor="employerName">Employer Name</Label>
                <Input
                  id="employerName"
                  {...register('employerName')}
                  placeholder="Enter your employer's name"
                  className={`transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.employerName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-green-400'}`}
                />
                {errors.employerName && (
                  <p className="text-sm text-red-600 mt-1">{errors.employerName.message}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="yearlyRentCapacity">Yearly Rent Capacity ($) *</Label>
              <Input
                id="yearlyRentCapacity"
                type="number"
                {...register('yearlyRentCapacity', { valueAsNumber: true })}
                placeholder="Enter your yearly rent capacity"
                className={`transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.yearlyRentCapacity ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-green-400'}`}
              />
              {errors.yearlyRentCapacity && (
                <p className="text-sm text-red-600 mt-1">{errors.yearlyRentCapacity.message}</p>
              )}
            </div>
          </div>

          {/* Housing Preferences */}
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-purple-300 pb-2 sm:pb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Housing Preferences
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="familySize">Family Size *</Label>
                <Input
                  id="familySize"
                  type="number"
                  min="1"
                  max="20"
                  {...register('familySize', { valueAsNumber: true })}
                  placeholder="Number of family members"
                  className={`transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${errors.familySize ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-purple-400'}`}
                />
                {errors.familySize && (
                  <p className="text-sm text-red-600 mt-1">{errors.familySize.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="desiredAccommodationType">Desired Accommodation Type *</Label>
                <select
                  id="desiredAccommodationType"
                  {...register('desiredAccommodationType')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ${
                    errors.desiredAccommodationType ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <option value="">Select accommodation type</option>
                  <option value="STUDIO">Studio</option>
                  <option value="ONE_BEDROOM">1 Bedroom</option>
                  <option value="TWO_BEDROOM">2 Bedroom</option>
                  <option value="THREE_BEDROOM">3 Bedroom</option>
                  <option value="MINI_FLAT">Mini Flat (Room/Parlor)</option>
                  <option value="SELF_CONTAINED">Self Contained</option>
                  <option value="DUPLEX">Duplex</option>
                </select>
                {errors.desiredAccommodationType && (
                  <p className="text-sm text-red-600 mt-1">{errors.desiredAccommodationType.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Previous Residence */}
          <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-orange-50 rounded-xl border border-orange-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-orange-300 pb-2 sm:pb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              Previous Residence
            </h3>
            
            <div>
              <Label htmlFor="previousAddress">Previous Address *</Label>
              <Input
                id="previousAddress"
                {...register('previousAddress')}
                placeholder="Enter your previous address"
                className={`transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${errors.previousAddress ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-orange-400'}`}
              />
              {errors.previousAddress && (
                <p className="text-sm text-red-600 mt-1">{errors.previousAddress.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="reasonForLeaving">Reason for Leaving *</Label>
              <textarea
                id="reasonForLeaving"
                {...register('reasonForLeaving')}
                placeholder="Please explain why you're leaving your current residence"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.reasonForLeaving ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 hover:border-orange-400'
                }`}
              />
              {errors.reasonForLeaving && (
                <p className="text-sm text-red-600 mt-1">{errors.reasonForLeaving.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                <>
                  Submit Application
                  <CheckCircle className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
