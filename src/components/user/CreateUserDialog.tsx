
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateUserDialog({ open, setOpen }: CreateUserDialogProps) {
  const { createUser } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    password: "",
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    
    const userData = {
      id: formData.id,
      name: formData.name,
      role,
      password: formData.password,
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
      password: "",
      department: "",
      gender: "",
      rollNo: "",
      program: "BTech",
      branch: "",
    });
  };

  return (
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
            
            {role === "teacher" ? <TeacherForm 
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            /> : <StudentForm 
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
            />}
          </div>
          <DialogFooter>
            <Button type="submit" className="btn-haikyu">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface FormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

function TeacherForm({ formData, handleChange, handleSelectChange, showPassword, togglePasswordVisibility }: FormProps) {
  return (
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
            autoComplete="off"
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
}

function StudentForm({ formData, handleChange, handleSelectChange, showPassword, togglePasswordVisibility }: FormProps) {
  return (
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
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="off"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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
            autoComplete="off"
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
          autoComplete="off"
        />
      </div>
    </>
  );
}
