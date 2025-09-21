'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  CreditCard, 
  MessageSquare, 
  Settings,
  LogOut,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { authAPI, User as UserType } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function TenantDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (authLoading) return; // Wait for auth to load

      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'TENANT') {
        router.push('/dashboard/landlord'); // Redirect non-tenants
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, user, authLoading, router]);

  const handleLogout = () => {
    logout();
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
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Tenant Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Welcome, {user?.firstName} {user?.lastName}!
                  </h2>
                  <p className="text-gray-700">
                    Manage your tenancy, payments, and communications all in one place.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">Next Payment Due</p>
                  <p className="text-2xl font-bold text-gray-900">$1,200</p>
                  <p className="text-xs text-gray-500">Due in 5 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">Open Requests</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-xs text-gray-500">Maintenance requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-700">Documents</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-xs text-gray-500">Available documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Information */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-800">
                <Home className="h-5 w-5 mr-2" />
                Property Information
              </CardTitle>
              <CardDescription className="text-gray-700">
                Details about your current residence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Property Address</p>
                  <p className="text-gray-900">123 Main Street, Apartment 4B</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Monthly Rent</p>
                  <p className="text-gray-900">$1,200.00</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Lease Start Date</p>
                  <p className="text-gray-900">January 1, 2024</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Lease End Date</p>
                  <p className="text-gray-900">December 31, 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="flex items-center text-gray-800">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-gray-700">
                Your latest transactions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Rent Payment</p>
                    <p className="text-xs text-gray-500">January 1, 2024</p>
                  </div>
                  <p className="text-sm font-medium text-green-600">$1,200.00</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Maintenance Request</p>
                    <p className="text-xs text-gray-500">December 28, 2023</p>
                  </div>
                  <p className="text-sm font-medium text-blue-600">In Progress</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Document Upload</p>
                    <p className="text-xs text-gray-500">December 25, 2023</p>
                  </div>
                  <p className="text-sm font-medium text-purple-600">Insurance Certificate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <CardTitle className="text-gray-800">Quick Actions</CardTitle>
              <CardDescription className="text-gray-700">
                Common tasks and features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                  <CreditCard className="h-6 w-6 mb-2" />
                  <span className="text-sm">Make Payment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Submit Request</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Documents</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
                  <Settings className="h-6 w-6 mb-2" />
                  <span className="text-sm">Account Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8">
          <Card className="bg-blue-50 border-blue-300 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-blue-700 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">More Features Coming Soon!</h3>
                <p className="text-blue-800">
                  We're working on adding payment processing, maintenance request tracking, 
                  document management, and more. Stay tuned for updates!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

