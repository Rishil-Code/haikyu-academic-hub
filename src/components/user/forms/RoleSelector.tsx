
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRole } from "@/types/user";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function RoleSelector({ role, setRole }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-cherry-text">Select Role</Label>
      <RadioGroup
        value={role}
        onValueChange={(value) => setRole(value as UserRole)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="role-teacher" className="text-cherry-pink border-cherry-pink" />
          <Label htmlFor="role-teacher" className="text-cherry-text">Teacher</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="role-student" className="text-cherry-pink border-cherry-pink" />
          <Label htmlFor="role-student" className="text-cherry-text">Student</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
