'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, User, LogOut, Menu, X, Building, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Home className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
              PropEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                {user?.role === 'LANDLORD' ? (
                  <Link 
                    href="/dashboard/landlord" 
                    className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center space-x-1"
                  >
                    <Building className="h-4 w-4" />
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : (
                  <Link 
                    href="/dashboard/tenant" 
                    className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <span>Dashboard</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                <Link 
                  href="/application-status" 
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Applications</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              // Non-authenticated user navigation
              <>
                <Link 
                  href="/apply" 
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center space-x-1"
                >
                  <FileText className="h-4 w-4" />
                  <span>Apply for Tenancy</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/application-status" 
                  className="relative text-gray-600 hover:text-gray-900 transition-all duration-300 group flex items-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Check Status</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {user.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 animate-fade-in-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                // Authenticated user mobile navigation
                <>
                  {user?.role === 'LANDLORD' ? (
                    <Link 
                      href="/dashboard/landlord" 
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Building className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  ) : (
                    <Link 
                      href="/dashboard/tenant" 
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link 
                    href="/application-status" 
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Applications</span>
                  </Link>
                </>
              ) : (
                // Non-authenticated user mobile navigation
                <>
                  <Link 
                    href="/apply" 
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Apply for Tenancy</span>
                  </Link>
                  <Link 
                    href="/application-status" 
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Check Status</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
