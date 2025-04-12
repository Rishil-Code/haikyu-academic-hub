
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Calendar, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Projects() {
  const { user } = useAuth();
  const { projects, addProject } = useAcademic();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  
  if (!user) return null;
  
  // Make sure to properly filter projects for the current user
  const userProjects = projects.filter(project => project.studentId === user.id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
              <p className="text-gray-500 dark:text-gray-400">
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
                    <DialogTitle>Add New Project</DialogTitle>
                    <DialogDescription>
                      Enter details about your academic or personal project
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Smart Attendance System"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Project Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your project, technologies used, and achievements..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className="input-field resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          name="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={handleChange}
                          required
                          className="input-field"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          name="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={handleChange}
                          required
                          className="input-field"
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
          
          <div className="grid gap-6 md:grid-cols-2">
            {userProjects.length > 0 ? (
              userProjects.map(project => (
                <Card key={project.id} className="sakura-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-[#D6A4A4]" />
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center text-sm mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-[#D6A4A4]/20 text-[#D6A4A4] dark:bg-[#D6A4A4]/30 dark:text-white">
                        Project
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{project.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Added on {format(new Date(), 'PPP')}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2">
                <Card className="sakura-card">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first project to showcase your skills and achievements
                    </p>
                    <DialogTrigger asChild>
                      <Button className="btn-sakura">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Project
                      </Button>
                    </DialogTrigger>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
