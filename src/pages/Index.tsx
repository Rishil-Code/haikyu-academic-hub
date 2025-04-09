
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    // If user is logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={volleyballLogo} alt="SVU Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-haikyu-black">SVU Student Management</span>
          </div>
          <Button 
            onClick={() => navigate("/login")}
            className="btn-haikyu"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-haikyu-navy to-haikyu-black py-20 sm:py-32">
        <div 
          className="absolute inset-0 opacity-20 volleyball-pattern"
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white animate-fade-in">
              Student Management System
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-8 text-gray-300">
              A comprehensive platform for Sri Venkateswara University College to manage student 
              academic records, projects, internships, and achievements.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="btn-haikyu w-full sm:w-auto text-lg"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                className="w-full sm:w-auto text-lg bg-white/10 text-white hover:bg-white/20"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-haikyu-black">
              Everything you need to manage student performance
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Designed for administrators, teachers, and students to streamline academic workflows and improve collaboration.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 bg-white">
              <div className="w-12 h-12 rounded-full bg-haikyu-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-haikyu-black">For Administrators</h3>
              <p className="mt-4 text-gray-600">
                Create and manage teacher and student accounts, monitor system performance, and oversee academic records.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 bg-white">
              <div className="w-12 h-12 rounded-full bg-haikyu-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-haikyu-black">For Teachers</h3>
              <p className="mt-4 text-gray-600">
                Upload and grade student marks, calculate SGPA/CGPA, and view student projects and internships.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 bg-white">
              <div className="w-12 h-12 rounded-full bg-haikyu-orange/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              </div>
              <h3 className="text-xl font-semibold text-haikyu-black">For Students</h3>
              <p className="mt-4 text-gray-600">
                View academic performance, track SGPA/CGPA, and manage projects and internship records.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-haikyu-navy py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Login to access your personalized dashboard.
            </p>
            <div className="mt-10 flex justify-center">
              <Button 
                className="bg-white text-haikyu-navy hover:bg-gray-100 text-lg"
                onClick={() => navigate("/login")}
              >
                Login Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src={volleyballLogo} alt="SVU Logo" className="h-6 w-6" />
              <span className="text-lg font-semibold text-haikyu-black">SVU Student Management</span>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Sri Venkateswara University College. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
