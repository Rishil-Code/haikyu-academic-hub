
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
    <div className="min-h-screen flex flex-col items-center justify-center cherry-gradient-bg p-4 relative overflow-hidden">
      {/* Cherry Blossom Petals */}
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      <div className="cherry-petal"></div>
      
      <div className="mb-8 text-center animate-fade-in relative z-10">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-3xl bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 shadow-lg border border-cherry-pink/30 animate-float">
            <img src={volleyballLogo} alt="SVU Logo" className="h-12 w-12" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-cherry-text text-shadow-lg">
          SVU Student Management
        </h1>
        <p className="mt-2 text-lg text-cherry-rosegold">Sri Venkateswara University College</p>
      </div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center relative z-10">
        <div className="w-32 h-1 bg-cherry-pink/30 mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-cherry-rosegold">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
