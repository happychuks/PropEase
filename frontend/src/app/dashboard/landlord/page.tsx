'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  LogOut,
  Plus,
  Eye,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Home,
  MapPin
} from 'lucide-react';
import { applicationAPI, authAPI, ProspectiveTenantApplication, User as UserType } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/contexts/AuthContext';

export default function LandlordDashboard() {
  const router = useRouter();
  const { showSuccess, showError, showLoading, dismiss } = useToast();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<ProspectiveTenantApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ProspectiveTenantApplication | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return; // Wait for auth to load

      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'LANDLORD') {
        router.push('/dashboard/tenant'); // Redirect non-landlords
        return;
      }

      await loadApplications();
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, user, authLoading, router]);

  const loadApplications = async () => {
    try {
      const response = await applicationAPI.getAll();
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (err: any) {
      console.error('Load applications error:', err);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleReviewApplication = async (applicationId: string, status: 'APPROVED' | 'REJECTED', notes?: string) => {
    setIsReviewing(true);
    const loadingToast = showLoading(`${status === 'APPROVED' ? 'Approving' : 'Rejecting'} application...`);
    
    try {
      const response = await applicationAPI.review(applicationId, {
        applicationStatus: status,
        reviewNotes: notes
      });
      
      if (response.data.success) {
        dismiss(loadingToast);
        showSuccess(`Application ${status.toLowerCase()} successfully!`);
        await loadApplications(); // Reload applications
        setSelectedApplication(null);
      }
    } catch (err: any) {
      dismiss(loadingToast);
      console.error('Review application error:', err);
      showError('Failed to review application. Please try again.');
      setError('Failed to review application');
    } finally {
      setIsReviewing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleLogout}>Go to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Landlord Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Total Applications</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-100">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Pending Review</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.applicationStatus === 'PENDING').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.applicationStatus === 'APPROVED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Rejected</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    {applications.filter(app => app.applicationStatus === 'REJECTED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-800">Prospective Tenant Applications</CardTitle>
                <CardDescription className="text-gray-700">
                  Review and manage tenant applications
                </CardDescription>
              </div>
              <Button onClick={loadApplications} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Applications Yet</h3>
                <p className="text-gray-700">Applications will appear here when prospective tenants submit them.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                            {application.applicantName}
                          </h3>
                          <Badge className={getStatusColor(application.applicationStatus)}>
                            {getStatusIcon(application.applicationStatus)}
                            <span className="ml-1 text-xs sm:text-sm">{application.applicationStatus.replace('_', ' ')}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{application.applicantEmail}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            {application.phoneNumber}
                          </div>
                          <div className="flex items-center sm:col-span-2 lg:col-span-1">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            Applied {formatDate(application.submittedAt)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-700 mt-3">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            Family Size: {application.familySize}
                          </div>
                          <div className="flex items-center">
                            <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{application.desiredAccommodationType.replace('_', ' ')}</span>
                          </div>
                          <div className="flex items-center sm:col-span-2 lg:col-span-1">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                            Budget: {formatCurrency(application.yearlyRentCapacity)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 sm:ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        
                        {application.applicationStatus === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleReviewApplication(application.id, 'APPROVED')}
                              disabled={isReviewing}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReviewApplication(application.id, 'REJECTED')}
                              disabled={isReviewing}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Close
                </Button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Full Name</p>
                      <p className="text-gray-900">{selectedApplication.applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{selectedApplication.applicantEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-gray-900">{selectedApplication.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                      <p className="text-gray-900">{formatDate(selectedApplication.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>

                {/* Employment & Financial */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Employment & Financial</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Employment Status</p>
                      <p className="text-gray-900">{selectedApplication.employmentStatus.replace('_', ' ')}</p>
                    </div>
                    {selectedApplication.employerName && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Employer</p>
                        <p className="text-gray-900">{selectedApplication.employerName}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600">Yearly Rent Capacity</p>
                      <p className="text-gray-900">{formatCurrency(selectedApplication.yearlyRentCapacity)}</p>
                    </div>
                  </div>
                </div>

                {/* Housing Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Housing Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Family Size</p>
                      <p className="text-gray-900">{selectedApplication.familySize}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Desired Accommodation</p>
                      <p className="text-gray-900">{selectedApplication.desiredAccommodationType.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {/* Previous Residence */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Previous Residence</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Previous Address</p>
                      <p className="text-gray-900">{selectedApplication.previousAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reason for Leaving</p>
                      <p className="text-gray-900">{selectedApplication.reasonForLeaving}</p>
                    </div>
                  </div>
                </div>

                {/* Application Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedApplication.applicationStatus)}
                    <Badge className={getStatusColor(selectedApplication.applicationStatus)}>
                      {selectedApplication.applicationStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                  {selectedApplication.reviewNotes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-600">Review Notes</p>
                      <p className="text-gray-900">{selectedApplication.reviewNotes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedApplication.applicationStatus === 'PENDING' && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleReviewApplication(selectedApplication.id, 'APPROVED');
                        setSelectedApplication(null);
                      }}
                      disabled={isReviewing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReviewApplication(selectedApplication.id, 'REJECTED');
                        setSelectedApplication(null);
                      }}
                      disabled={isReviewing}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
