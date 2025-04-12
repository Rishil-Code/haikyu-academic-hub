
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function Login() {
  const { user } = useAuth();

  // Add dark mode check on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4F4F9] to-white dark:from-[#1E1E2F] dark:to-[#282836] p-4 relative overflow-hidden">
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
      
      <div className="absolute top-4 right-4">
        <DarkModeToggle />
      </div>
      
      <div className="mb-8 text-center animate-fade-in relative z-10">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-3xl bg-white/30 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center p-4 shadow-lg border border-[#D6A4A4]/30 animate-float">
            <img src={volleyballLogo} alt="SVU Logo" className="h-12 w-12" />
          </div>
        </div>
        <div className="px-4 py-2 rounded-full bg-[#2B2D42]/10 dark:bg-white/10 backdrop-blur-sm inline-block mb-2">
          <h1 className="text-4xl font-bold text-[#2B2D42] dark:text-white text-shadow-lg">
            SVU Student Management
          </h1>
        </div>
        <p className="mt-2 text-lg text-[#6D6875] dark:text-gray-300">Sri Venkateswara University College</p>
      </div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <LoginForm />
      </div>
      
      <div className="mt-12 text-center relative z-10">
        <div className="w-32 h-1 bg-[#D6A4A4]/30 mx-auto mb-4 rounded-full"></div>
        <p className="text-sm text-[#6D6875] dark:text-gray-400">
          Powered by SVU © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
