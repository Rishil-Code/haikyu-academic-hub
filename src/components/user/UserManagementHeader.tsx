
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "@/components/user/CreateUserDialog";

interface UserManagementHeaderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserManagementHeader({ open, setOpen }: UserManagementHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
        <p className="text-indigo-200 mt-1">Create and manage student and teacher accounts</p>
      </div>
      <Button 
        className="btn-haikyu"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create User
      </Button>
      <CreateUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}
