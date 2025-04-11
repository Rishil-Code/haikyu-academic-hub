
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
    
    if (!formData.id) {
      toast.error("User ID is required");
      return;
    }
    
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }
    
    if (!formData.gender) {
      toast.error("Gender is required");
      return;
    }
    
    if (role === "teacher" && !formData.department) {
      toast.error("Department is required for teachers");
      return;
    }
    
    if (role === "student") {
      if (!formData.rollNo) {
        toast.error("Roll Number is required for students");
        return;
      }
      if (!formData.branch) {
        toast.error("Branch is required for students");
        return;
      }
    }
    
    const userData = {
      ...formData,
      role,
      gender: formData.gender as "male" | "female" | "other",
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
            <DialogTitle className="text-cherry-text">Create New User</DialogTitle>
            <DialogDescription className="text-cherry-rosegold">
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
            <Button type="submit" className="btn-cherry">Create User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
