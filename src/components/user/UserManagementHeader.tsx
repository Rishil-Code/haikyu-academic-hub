
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
    <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-[#1E1E2F]/90 to-[#2B2D42]/90 p-4 rounded-xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block">User Management</h1>
        <p className="text-indigo-200 mt-1">Create and manage student and teacher accounts</p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          className="btn-haikyu bg-[#D6A4A4] hover:bg-[#C98C8C] text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create User
        </Button>
      </div>
      <CreateUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}
