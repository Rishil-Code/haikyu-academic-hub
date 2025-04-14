
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Calendar, Plus, FileCheck, Trash2, School, Loader2, Upload, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCertificates } from "@/contexts/CertificateContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { format } from "date-fns";
import { toast } from "sonner";
import { retrieveUsers } from "@/utils/storage";

export default function Certificates() {
  const { user } = useAuth();
  const { getVisibleCertificates, addCertificate, deleteCertificate, isLoading: uploading, uploadCertificateFile } = useCertificates();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    issuingAuthority: "",
    issueDate: "",
    description: "",
    fileUrl: "",
  });
  
  // Get all users
  const allUsers = retrieveUsers() || [];
  
  // Get certificates based on user role
  const visibleCertificates = getVisibleCertificates();
  
  // Improved loading and error handling
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Error loading certificates:", err);
      setError("Failed to load certificates. Please refresh the page.");
      setIsLoading(false);
    }
  }, []);
  
  // Handle case where user is not available
  if (!user) {
    return (
      <MainLayout>
        <div className="bg-[#F4F4F9]/50 dark:bg-[#282836]/50 p-6 rounded-lg text-center">
          <p className="text-gray-700 dark:text-gray-300">Please log in to view this page.</p>
        </div>
      </MainLayout>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileUrl = "";
      if (selectedFile) {
        fileUrl = await uploadCertificateFile(selectedFile);
      }
      
      // Get the user data to attach to certificate
      const userData = allUsers.find(u => u.id === user.id);
      
      addCertificate({
        ...formData,
        fileUrl,
        userId: user.id,
        userData: userData,
      });
      
      setOpen(false);
      setFormData({
        name: "",
        issuingAuthority: "",
        issueDate: "",
        description: "",
        fileUrl: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error adding certificate:", error);
      toast.error("Failed to upload certificate. Please try again.");
    }
  };
  
  const handleDelete = (certificateId: string) => {
    try {
      deleteCertificate(certificateId);
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Failed to delete certificate. Please try again.");
    }
  };

  // Handle error state
  if (error) {
    return (
      <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
        <MainLayout>
          <div className="flex items-center justify-center p-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center max-w-md">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  // Determine page title based on user role
  const getPageTitle = () => {
    if (user.role === 'student') {
      return "My Certificates";
    } else if (user.role === 'teacher') {
      return "Student Certificates";
    } else {
      return "All Certificates";
    }
  };

  // Determine if the user can add certificates (only students can)
  const canAddCertificates = user.role === 'student';

  return (
    <ProtectedRoute allowedRoles={["student", "teacher", "admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-4 py-1 rounded-full inline-block text-gray-800 dark:text-white">{getPageTitle()}</h1>
              <p className="text-gray-500 dark:text-gray-300 mt-1 ml-2">
                {user.role === 'student' 
                  ? "Manage your professional certifications and achievements" 
                  : "View student certifications and achievements"}
              </p>
            </div>
            {canAddCertificates && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-sakura">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certificate
                  </Button>
                </DialogTrigger>
                <DialogContent className="sakura-card sm:max-w-[550px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle className="text-gray-800 dark:text-white">Add New Certificate</DialogTitle>
                      <DialogDescription>
                        Enter details about your certification or achievement
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-800 dark:text-gray-200">Certificate Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Advanced Python Programming"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issuingAuthority" className="text-gray-800 dark:text-gray-200">Issuing Authority</Label>
                        <Input
                          id="issuingAuthority"
                          name="issuingAuthority"
                          placeholder="e.g., Coursera, Microsoft, University"
                          value={formData.issuingAuthority}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issueDate" className="text-gray-800 dark:text-gray-200">Issue Date</Label>
                        <Input
                          id="issueDate"
                          name="issueDate"
                          type="date"
                          value={formData.issueDate}
                          onChange={handleChange}
                          required
                          className="input-field bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-800 dark:text-gray-200">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Briefly describe what you learned or achieved..."
                          value={formData.description}
                          onChange={handleChange}
                          className="input-field resize-none min-h-[80px] bg-white dark:bg-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fileUrl" className="text-gray-800 dark:text-gray-200">Certificate File (Optional)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="fileUrl"
                            name="fileUrl"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="input-field bg-white dark:bg-gray-800"
                          />
                          {selectedFile && (
                            <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-1 px-2 rounded-md">
                              {selectedFile.name}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">Upload a PDF or image of your certificate (max 5MB)</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="btn-sakura" disabled={uploading}>
                        {uploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Add Certificate
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12 bg-[#F4F4F9]/50 dark:bg-[#282836]/50 rounded-lg">
              <Loader2 className="h-8 w-8 animate-spin text-[#D6A4A4]" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading certificates...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleCertificates && visibleCertificates.length > 0 ? (
                visibleCertificates.map(certificate => {
                  // Find certificate owner
                  const certOwner = allUsers.find(u => u.id === certificate.userId);
                  const isOwner = user.id === certificate.userId;
                  
                  return (
                    <Card key={certificate.id} className="sakura-card overflow-hidden hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-2 bg-[#F4F4F9]/70 dark:bg-[#2B2D42]/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-[#D6A4A4]" />
                              <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{certificate.name}</CardTitle>
                            </div>
                            <CardDescription className="text-sm font-medium mt-1 flex items-center text-gray-600 dark:text-gray-300">
                              <School className="h-3 w-3 mr-1" />
                              {certificate.issuingAuthority}
                            </CardDescription>
                            {!isOwner && certOwner && (
                              <div className="mt-1 text-xs bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300">
                                {certOwner.name} ({certOwner.studentId || certOwner.teacherId})
                              </div>
                            )}
                          </div>
                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(certificate.id)}
                              className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-3">
                        {certificate.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{certificate.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="h-3 w-3 mr-1" />
                            Issued on: {format(new Date(certificate.issueDate), 'PPP')}
                          </div>
                          {certificate.fileUrl && (
                            <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-auto bg-white dark:bg-gray-800">
                              <FileCheck className="h-3 w-3 mr-1" />
                              View Certificate
                            </Button>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 pb-3 text-xs bg-[#F4F4F9]/50 dark:bg-[#2B2D42]/30 text-gray-500 dark:text-gray-400">
                        Added on {certificate.uploadDate ? format(new Date(certificate.uploadDate), 'PPP') : format(new Date(), 'PPP')}
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="md:col-span-2 lg:col-span-3">
                  <Card className="sakura-card bg-[#F4F4F9]/50 dark:bg-[#282836]/50">
                    <CardContent className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Award className="h-8 w-8 text-[#D6A4A4]/70" />
                      </div>
                      <h3 className="text-xl font-medium mb-2 bg-[#D6A4A4]/20 dark:bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block text-gray-800 dark:text-white">
                        No certificates yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        {user.role === 'student' 
                          ? "Add your first certificate to showcase your skills, qualifications, and achievements to potential employers."
                          : "No certificates found. Students have not uploaded any certificates yet."}
                      </p>
                      {canAddCertificates && (
                        <DialogTrigger asChild>
                          <Button className="btn-sakura px-6 py-3">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Your First Certificate
                          </Button>
                        </DialogTrigger>
                      )}
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
