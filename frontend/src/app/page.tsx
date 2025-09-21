import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home as HomeIcon, Users, FileText, CheckCircle, Building, Shield, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 mb-6 shadow-lg border border-gray-200">
              <Sparkles className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm font-medium text-gray-800">Property Management Revolution</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Property Management
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block animate-gradient">
                Made Easy
              </span>
            </h1>
          </div>
          <div className="animate-fade-in-up delay-200">
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Streamline your property management with PropEase. Connect landlords and tenants 
              seamlessly with our comprehensive platform.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/apply">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
                Apply for Tenancy
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300 bg-white">
                Landlord Registration
              </Button>
            </Link>
          </div>
        </div>
      </section>

          {/* Features Section */}
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PropEase?
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Everything you need to manage properties efficiently with cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Easy Applications</CardTitle>
                <CardDescription className="text-gray-700">
                  Prospective tenants can apply online with a simple, guided form
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Quick Reviews</CardTitle>
                <CardDescription className="text-gray-700">
                  Landlords can review and approve applications with just a few clicks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Tenant Management</CardTitle>
                <CardDescription className="text-gray-700">
                  Manage tenants, payments, and complaints all in one place
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Property Portfolio</CardTitle>
                <CardDescription className="text-gray-700">
                  Track multiple properties and their rental status
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">Secure & Reliable</CardTitle>
                <CardDescription className="text-gray-700">
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-200 shadow-lg">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <HomeIcon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800">24/7 Access</CardTitle>
                <CardDescription className="text-gray-700">
                  Access your property management tools anytime, anywhere
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
            Ready to Get Started?
          </h2>
              <p className="text-xl text-blue-50 mb-8 animate-fade-in-up delay-200">
                Join thousands of landlords and tenants who trust PropEase for their property management needs.
              </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link href="/apply">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Your Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/application-status">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                Check Application Status
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}