
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, User, UserRole } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User as UserIcon, GraduationCap, BookOpen } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserManagement() {
  const { users, createUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("student");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: "",
    gender: "",
    rollNo: "",
    program: "BTech",
    branch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData: User = {
      id: formData.id,
      name: formData.name,
      role,
      ...(role === "teacher" ? {
        department: formData.department,
        gender: formData.gender as "male" | "female" | "other",
      } : {}),
      ...(role === "student" ? {
        rollNo: formData.rollNo,
        program: formData.program as "BTech" | "MTech",
        branch: formData.branch,
      } : {}),
    };
    
    createUser(userData);
    setOpen(false);
    
    // Reset form
    setFormData({
      id: "",
      name: "",
      department: "",
      gender: "",
      rollNo: "",
      program: "BTech",
      branch: "",
    });
  };

  const teacherUsers = users.filter(user => user.role === "teacher");
  const studentUsers = users.filter(user => user.role === "student");

  const TeacherForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">Teacher ID</Label>
          <Input
            id="id"
            name="id"
            placeholder="e.g., teacher2"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Dr. John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            name="department"
            placeholder="e.g., Computer Science"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );

  const StudentForm = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id">Student ID</Label>
          <Input
            id="id"
            name="id"
            placeholder="e.g., student2"
            value={formData.id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNo">Roll Number</Label>
          <Input
            id="rollNo"
            name="rollNo"
            placeholder="e.g., CS2021002"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="program">Program</Label>
          <Select
            value={formData.program}
            onValueChange={(value) => handleSelectChange("program", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTech">BTech</SelectItem>
              <SelectItem value="MTech">MTech</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Input
          id="branch"
          name="branch"
          placeholder="e.g., Computer Science"
          value={formData.branch}
          onChange={handleChange}
          required
        />
      </div>
    </>
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="btn-haikyu">
                  <Plus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new teacher or student account to the system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Select Role</Label>
                      <RadioGroup
                        value={role}
                        onValueChange={(value) => setRole(value as UserRole)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="teacher" id="role-teacher" />
                          <Label htmlFor="role-teacher">Teacher</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student" id="role-student" />
                          <Label htmlFor="role-student">Student</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {role === "teacher" ? <TeacherForm /> : <StudentForm />}
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="btn-haikyu">Create User</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-haikyu-orange" />
                  Teachers
                </CardTitle>
                <CardDescription>Manage teacher accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {teacherUsers.length > 0 ? (
                  <div className="space-y-4">
                    {teacherUsers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-haikyu-navy text-white flex items-center justify-center font-medium">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-gray-500">
                              {teacher.department}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">ID: {teacher.id}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    No teachers found
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-haikyu-orange" />
                  Students
                </CardTitle>
                <CardDescription>Manage student accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {studentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {studentUsers.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-md bg-gray-50 border"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-haikyu-navy text-white flex items-center justify-center font-medium">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">
                              {student.program} - {student.branch}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Roll: {student.rollNo}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    No students found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
