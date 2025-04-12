
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Award, Calendar, Plus, FileCheck, Trash2, School } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCertificates } from "@/contexts/CertificateContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { format } from "date-fns";

export default function Certificates() {
  const { user } = useAuth();
  const { getUserCertificates, addCertificate, deleteCertificate } = useCertificates();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    issuingAuthority: "",
    issueDate: "",
    fileUrl: "",
  });
  
  if (!user) return null;
  
  const userCertificates = getUserCertificates(user.id);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addCertificate({
      ...formData,
      userId: user.id,
    });
    
    setOpen(false);
    setFormData({
      name: "",
      issuingAuthority: "",
      issueDate: "",
      fileUrl: "",
    });
  };
  
  const handleDelete = (certificateId: string) => {
    deleteCertificate(certificateId);
  };

  return (
    <ProtectedRoute allowedRoles={["student", "teacher"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-[#D6A4A4]/10 dark:bg-[#D6A4A4]/20 px-4 py-1 rounded-full inline-block">My Certificates</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your professional certifications and achievements</p>
            </div>
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
                    <DialogTitle>Add New Certificate</DialogTitle>
                    <DialogDescription>
                      Enter details about your certification or achievement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Certificate Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Advanced Python Programming"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                      <Input
                        id="issuingAuthority"
                        name="issuingAuthority"
                        placeholder="e.g., Coursera, Microsoft, University"
                        value={formData.issuingAuthority}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input
                        id="issueDate"
                        name="issueDate"
                        type="date"
                        value={formData.issueDate}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fileUrl">Certificate File (Optional)</Label>
                      <Input
                        id="fileUrl"
                        name="fileUrl"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="input-field"
                      />
                      <p className="text-xs text-muted-foreground">Upload a PDF or image of your certificate (max 5MB)</p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="btn-sakura">Add Certificate</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userCertificates.length > 0 ? (
              userCertificates.map(certificate => (
                <Card key={certificate.id} className="sakura-card overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 bg-[#F4F4F9]/50 dark:bg-[#2B2D42]/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5 text-[#D6A4A4]" />
                          <CardTitle className="text-xl text-gray-800 dark:text-gray-100">{certificate.name}</CardTitle>
                        </div>
                        <CardDescription className="text-sm font-medium mt-1 flex items-center">
                          <School className="h-3 w-3 mr-1" />
                          {certificate.issuingAuthority}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(certificate.id)}
                        className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Calendar className="h-3 w-3 mr-1" />
                        Issued on: {format(new Date(certificate.issueDate), 'PP')}
                      </div>
                      {certificate.fileUrl && (
                        <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-auto">
                          <FileCheck className="h-3 w-3 mr-1" />
                          View Certificate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3 pb-3 text-xs bg-[#F4F4F9]/30 dark:bg-[#2B2D42]/20 text-gray-500 dark:text-gray-400">
                    Added on {format(new Date(), 'PPP')}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3">
                <Card className="sakura-card">
                  <CardContent className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-[#D6A4A4]/70" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 bg-[#D6A4A4]/10 dark:bg-[#D6A4A4]/20 px-3 py-1 rounded-full inline-block">No certificates yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Add your first certificate to showcase your skills, qualifications, and achievements to potential employers.
                    </p>
                    <DialogTrigger asChild>
                      <Button className="btn-sakura px-6 py-3">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Certificate
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
