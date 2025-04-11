
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-800 p-4">
      <div className="mb-8 text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 shadow-lg border border-white/20">
            <img src={volleyballLogo} alt="SVU Logo" className="h-12 w-12 animate-bounce-slow" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white text-shadow-lg">
          SVU Student Management
        </h1>
        <p className="mt-2 text-lg text-indigo-200">Sri Venkateswara University College</p>
      </div>
      
      <div className="w-full max-w-md animate-fade-in">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center">
        <div className="w-32 h-1 bg-white/20 mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-indigo-200">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
