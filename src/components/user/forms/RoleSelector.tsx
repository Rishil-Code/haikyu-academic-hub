
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
  );
}
