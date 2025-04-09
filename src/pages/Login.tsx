
import React from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-haikyu-black">SVU Student Management</h1>
        <p className="mt-2 text-lg text-gray-600">Sri Venkateswara University College</p>
      </div>
      
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      
      <div className="mt-8 text-center">
        <div className="w-32 h-1 bg-haikyu-orange mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-gray-500">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
