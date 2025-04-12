
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

interface FormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export function StudentForm({ formData, handleChange, handleSelectChange, showPassword, togglePasswordVisibility }: FormProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id" className="text-[#2B2D42] font-medium">Student ID</Label>
          <Input
            id="id"
            name="id"
            placeholder="e.g., student2"
            value={formData.id}
            onChange={handleChange}
            required
            autoComplete="off"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#2B2D42] font-medium">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            autoComplete="off"
            className="input-field"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#2B2D42] font-medium">Password</Label>
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
            className="input-field pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6D6875] hover:text-[#2B2D42]"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNo" className="text-[#2B2D42] font-medium">Roll Number</Label>
          <Input
            id="rollNo"
            name="rollNo"
            placeholder="e.g., CS2021002"
            value={formData.rollNo}
            onChange={handleChange}
            required
            autoComplete="off"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="program" className="text-[#2B2D42] font-medium">Program</Label>
          <Select
            value={formData.program}
            onValueChange={(value) => handleSelectChange("program", value)}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select program" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#E2E2E7] text-[#2B2D42]">
              <SelectItem value="BTech">BTech</SelectItem>
              <SelectItem value="MTech">MTech</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="branch" className="text-[#2B2D42] font-medium">Branch</Label>
          <Input
            id="branch"
            name="branch"
            placeholder="e.g., Computer Science"
            value={formData.branch}
            onChange={handleChange}
            required
            autoComplete="off"
            className="input-field"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[#2B2D42] font-medium">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
          >
            <SelectTrigger className="input-field">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#E2E2E7] text-[#2B2D42]">
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
