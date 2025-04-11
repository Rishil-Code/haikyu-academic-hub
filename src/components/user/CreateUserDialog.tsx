
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { RoleSelector } from "@/components/user/forms/RoleSelector";
import { TeacherForm } from "@/components/user/forms/TeacherForm";
import { StudentForm } from "@/components/user/forms/StudentForm";
import { useUserForm } from "@/hooks/useUserForm";

interface CreateUserDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateUserDialog({ open, setOpen }: CreateUserDialogProps) {
  const { createUser } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const { formData, handleChange, handleSelectChange, resetForm, showPassword, togglePasswordVisibility } = useUserForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    
    if (!formData.gender) {
      toast.error("Gender is required");
      return;
    }
    
    const userData = {
      id: formData.id,
      name: formData.name,
      role,
      password: formData.password,
      gender: formData.gender as "male" | "female" | "other",
      ...(role === "teacher" ? {
        department: formData.department,
      } : {}),
      ...(role === "student" ? {
        rollNo: formData.rollNo,
        program: formData.program as "BTech" | "MTech",
        branch: formData.branch,
      } : {}),
    };
    
    createUser(userData);
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="card-modern sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new teacher or student account to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <RoleSelector role={role} setRole={setRole} />
            
            {role === "teacher" ? 
              <TeacherForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              /> : 
              <StudentForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            }
          </div>
          <DialogFooter>
            <Button type="submit" className="btn-haikyu">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
