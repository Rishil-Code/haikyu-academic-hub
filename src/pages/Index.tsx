
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-haikyu-navy to-haikyu-black py-16 sm:py-24">
        <div 
          className="absolute inset-0 opacity-20 volleyball-pattern"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              SVU Student Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              A comprehensive platform for Sri Venkateswara University College to manage student academic records, projects, and internships.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                className="btn-haikyu text-lg"
                onClick={() => navigate("/login")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-haikyu-black sm:text-4xl">
              Everything you need to manage student performance
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Designed for administrators, teachers, and students to streamline academic workflows and improve collaboration.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-haikyu-orange">
                  For Administrators
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Create teacher and student accounts, manage user permissions, and oversee system operations.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-haikyu-orange">
                  For Teachers
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Upload and grade student marks, calculate SGPA/CGPA, and view student projects and internships.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="text-lg font-semibold leading-7 text-haikyu-orange">
                  For Students
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    View academic performance, track SGPA/CGPA, and manage projects and internship records.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Login section */}
      <div className="bg-haikyu-navy py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Login to access your personalized dashboard.
            </p>
            <div className="mt-10 flex items-center justify-center">
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
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Sri Venkateswara University College. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
