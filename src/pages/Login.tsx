
import React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";

export default function Login() {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <img src={volleyballLogo} alt="SVU Logo" className="h-20 w-20 animate-bounce-slow" />
        </div>
        <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-haikyu-orange to-orange-400 bg-clip-text text-transparent">
          SVU Student Management
        </h1>
        <p className="mt-2 text-lg text-purple-200">Sri Venkateswara University College</p>
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center">
        <div className="w-32 h-1 bg-haikyu-orange mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-purple-200">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
