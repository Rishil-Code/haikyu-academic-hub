
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { SidebarMenu } from "./SidebarMenu";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import volleyballLogo from "@/assets/volleyball-logo.svg";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen purple-gradient-bg overflow-hidden">
      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-200 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-purple-900 border-r border-purple-700/50 shadow-sm transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-purple-700/50">
          <Link to="/dashboard" className="flex items-center space-x-2">
            {/* SVG Volleyball logo placeholder */}
            <div className="h-8 w-8 rounded-full bg-haikyu-orange flex items-center justify-center text-white font-bold">
              SV
            </div>
            <span className="text-lg font-bold text-white">SVU Management</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-purple-800/50"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="py-2">
          <SidebarMenu />
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-purple-900/80 backdrop-blur-sm border-b border-purple-700/50 shadow-sm flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:bg-purple-800/50"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <span className="text-lg font-semibold hidden sm:inline-block text-white">
              SVU Student Management
            </span>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-purple-100 hidden sm:block">
                {user.name} ({user.role})
              </div>
              <div className="h-8 w-8 rounded-full bg-haikyu-orange text-white flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0)}
              </div>
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
