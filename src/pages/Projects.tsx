
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Calendar, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Projects() {
  const { user } = useAuth();
  const { projects, addProject } = useAcademic();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  
  // Improved loading and error handling
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading projects:", err);
        setError("Failed to load projects. Please refresh the page.");
        setIsLoading(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  if (!user) {
    return (
      <MainLayout>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-700 dark:text-gray-300">Please log in to view this page.</p>
        </div>
      </MainLayout>
    );
  }
  
  // Make sure to properly filter projects for the current user
  const userProjects = projects.filter(project => project.studentId === user.id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      addProject({
        ...formData,
        studentId: user.id,
      });
      
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Handle error state
  if (error) {
    return (
      <ProtectedRoute allowedRoles={["student"]}>
        <MainLayout>
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center">
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <Button 
              className="mt-4 bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">My Projects</h1>
              <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
                Manage your academic and personal projects
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-sakura">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sakura-card sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle className="text-gray-800 dark:text-white">Add New Project</DialogTitle>
                    <DialogDescription>
                      Enter details about your academic or personal project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-800 dark:text-gray-200">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Smart Attendance System"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Project Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your project, technologies used, and achievements..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="input-field resize-none bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-gray-800 dark:text-gray-200">Start Date</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-gray-800 dark:text-gray-200">End Date</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="btn-sakura">Add Project</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading your projects...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {userProjects && userProjects.length > 0 ? (
                userProjects.map(project => (
                  <Card key={project.id} className="sakura-card overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-2 bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-[#D6A4A4]" />
                            <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{project.title}</CardTitle>
                          </div>
                          <CardDescription className="flex items-center text-sm mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(project.startDate), 'PPP')} - {format(new Date(project.endDate), 'PPP')}
                          </CardDescription>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-[#D6A4A4]/30 text-[#D6A4A4] dark:bg-[#D6A4A4]/40 dark:text-white">
                          Project
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 text-xs bg-[#F4F4F9]/50 dark:bg-[#2B2D42]/30 text-gray-500 dark:text-gray-400">
                      Added on {format(new Date(), 'PPP')}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-2">
                  <Card className="sakura-card overflow-hidden bg-[#F4F4F9]/50 dark:bg-[#282836]/50">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-[#D6A4A4]/70" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">No projects yet</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                        No records found. Please add your project details to showcase your skills and achievements.
                      </p>
                      <DialogTrigger asChild>
                        <Button className="btn-sakura px-6 py-3">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Project
                        </Button>
                      </DialogTrigger>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
