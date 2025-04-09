
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Briefcase, Calendar, Plus, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { format } from "date-fns";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Internships() {
  const { user } = useAuth();
  const { internships, addInternship } = useAcademic();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  
  if (!user) return null;
  
  const userInternships = internships.filter(internship => internship.studentId === user.id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addInternship({
      ...formData,
      studentId: user.id,
    });
    
    setOpen(false);
    setFormData({
      company: "",
      role: "",
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
            <h1 className="text-3xl font-bold tracking-tight">My Internships</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-haikyu">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Internship
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add New Internship</DialogTitle>
                    <DialogDescription>
                      Enter details about your internship experience
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="e.g., Karasuno Tech Solutions"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Your Role</Label>
                        <Input
                          id="role"
                          name="role"
                          placeholder="e.g., Python Developer Intern"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description of Work</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your responsibilities, projects, and skills learned..."
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
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
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="btn-haikyu">Add Internship</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <p className="text-gray-500">
            Manage your internship experiences
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {userInternships.length > 0 ? (
              userInternships.map(internship => (
                <Card key={internship.id} className="haikyu-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-5 w-5 text-haikyu-orange" />
                          <CardTitle className="text-xl">{internship.company}</CardTitle>
                        </div>
                        <CardDescription className="text-sm font-medium mt-1">
                          {internship.role}
                        </CardDescription>
                        <CardDescription className="flex items-center text-xs mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-xs px-2 py-1 rounded-full bg-haikyu-orange/20 text-haikyu-orange">
                        Internship
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-700">{internship.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 text-xs text-gray-500">
                    Added on {format(new Date(), 'PPP')}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Briefcase className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No internships yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first internship to showcase your professional experience
                    </p>
                    <DialogTrigger asChild>
                      <Button className="btn-haikyu">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Internship
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
