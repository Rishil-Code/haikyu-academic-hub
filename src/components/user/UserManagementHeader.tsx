
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
    <div className="flex flex-col items-center mb-6 bg-gradient-to-r from-gray-100/90 to-gray-200/90 dark:from-[#1E1E2F]/90 dark:to-[#2B2D42]/90 p-4 rounded-xl shadow-md">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white bg-[#D6A4A4]/30 px-3 py-1 rounded-full inline-block">User Management</h1>
        <p className="text-gray-700 dark:text-indigo-200 mt-1">Create and manage student and teacher accounts</p>
      </div>
      <div className="w-full flex justify-center mt-2">
        <Button 
          className="bg-[#D6A4A4] hover:bg-[#C98C8C] text-white font-medium px-6 py-2 rounded-xl shadow-md"
          onClick={() => setOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Create User
        </Button>
      </div>
      <CreateUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}
