
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AcademicProvider } from "@/contexts/AcademicContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import GradeManagement from "./pages/GradeManagement";
import StudentRecords from "./pages/StudentRecords";
import Results from "./pages/Results";
import Projects from "./pages/Projects";
import Internships from "./pages/Internships";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AcademicProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/users" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/grades" 
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <GradeManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/students" 
                element={
                  <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                    <StudentRecords />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/results" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Results />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/projects" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Projects />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/internships" 
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <Internships />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AcademicProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
