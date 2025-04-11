
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
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      <CreateUserDialog open={open} setOpen={setOpen} />
    </div>
  );
}
