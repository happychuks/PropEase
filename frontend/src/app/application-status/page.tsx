'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

interface ApplicationStatus {
  id: string;
  applicantName: string;
  applicationStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export default function ApplicationStatusPage() {
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationStatus | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'WITHDRAWN':
        return <FileText className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'WITHDRAWN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Your application is pending review. We will get back to you within 2-3 business days.';
      case 'UNDER_REVIEW':
        return 'Your application is currently under review. Our team is evaluating your information.';
      case 'APPROVED':
        return 'Congratulations! Your application has been approved. You will receive further instructions via email.';
      case 'REJECTED':
        return 'Unfortunately, your application was not approved at this time. Please check the review notes for more information.';
      case 'WITHDRAWN':
        return 'Your application has been withdrawn.';
      default:
        return 'Status unknown.';
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setApplication(null);
    const loadingToast = showLoading('Checking application status...');

    try {
      const response = await api.get(`/applications/status?email=${encodeURIComponent(email)}`);
      dismiss(loadingToast);
      setApplication(response.data.data);
      showSuccess('Application status retrieved successfully!');
    } catch (err: any) {
      dismiss(loadingToast);
      console.error('Application status check error:', err);
      showError(err.response?.data?.message || 'Failed to check application status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Check Application Status</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Enter your email address to check the status of your tenancy application.
          </p>
        </div>

        {/* Search Form */}
        <Card className="w-full max-w-2xl mx-auto mb-6 sm:mb-8 bg-white border border-gray-200 shadow-lg">
          <CardHeader className="p-4 sm:p-6 bg-blue-50 border-b border-blue-200">
            <CardTitle className="text-center text-lg sm:text-xl text-gray-800">Application Status Check</CardTitle>
            <CardDescription className="text-center text-sm sm:text-base text-gray-700">
              Enter the email address you used when submitting your application
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Check Status'}
              </Button>
            </form>
          </CardContent>
        </Card>


        {/* Application Status Result */}
        {application && (
          <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-lg">
            <CardHeader className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg sm:text-xl text-gray-800">Application Status</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-gray-700">
                    Application for {application.applicantName}
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(application.applicationStatus)}`}>
                  {application.applicationStatus.replace(/_/g, ' ')}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
              {/* Status Icon and Message */}
              <div className="flex items-start space-x-3">
                {getStatusIcon(application.applicationStatus)}
                <div>
                  <p className="text-gray-800">{getStatusMessage(application.applicationStatus)}</p>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Submitted:</span>{' '}
                      {new Date(application.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    {application.reviewedAt && (
                      <div>
                        <span className="font-medium">Reviewed:</span>{' '}
                        {new Date(application.reviewedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Application ID</h4>
                  <p className="text-sm text-gray-600 font-mono">{application.id}</p>
                </div>
              </div>

              {/* Review Notes */}
              {application.reviewNotes && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Review Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{application.reviewNotes}</p>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
                <div className="text-sm text-gray-700">
                  {application.applicationStatus === 'PENDING' && (
                    <p>Please wait for our team to review your application. You will receive an email notification once the review is complete.</p>
                  )}
                  {application.applicationStatus === 'UNDER_REVIEW' && (
                    <p>Our team is currently reviewing your application. This process typically takes 1-2 business days.</p>
                  )}
                  {application.applicationStatus === 'APPROVED' && (
                    <p>You will receive an email with further instructions on how to proceed with your tenancy. This may include login credentials for your tenant portal.</p>
                  )}
                  {application.applicationStatus === 'REJECTED' && (
                    <p>If you have any questions about this decision, please contact our support team. You may also submit a new application in the future.</p>
                  )}
                  {application.applicationStatus === 'WITHDRAWN' && (
                    <p>Your application has been withdrawn. If you would like to apply again, you can submit a new application.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Questions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    How long does the review process take?
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    What happens after my application is approved?
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Can I update my application after submission?
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Email: support@propease.com
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Phone: (555) 123-4567
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Hours: Mon-Fri 9AM-6PM
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Still have questions?{' '}
                <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
                  Contact our support team
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
