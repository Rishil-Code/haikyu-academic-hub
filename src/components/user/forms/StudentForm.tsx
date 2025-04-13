
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff } from "lucide-react";

interface StudentFormProps {
  formData: {
    id: string;
    name: string;
    password: string;
    gender: string;
    rollNo: string;
    program: string;
    branch: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  programDepartments: Record<string, string[]>;
  availableDepartments: string[];
}

export function StudentForm({
  formData,
  handleChange,
  handleSelectChange,
  showPassword,
  togglePasswordVisibility,
  programDepartments,
  availableDepartments
}: StudentFormProps) {
  const programs = Object.keys(programDepartments);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Student ID</Label>
          <Input
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="student1"
            className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Min. 6 characters"
            className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20 pr-10"
            required
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNo" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Roll Number</Label>
          <Input
            id="rollNo"
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="CSE123"
            className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Gender</Label>
          <RadioGroup
            defaultValue={formData.gender}
            onValueChange={(value) => handleSelectChange("gender", value)}
            className="flex space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="male" className="text-[#2B2D42]">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="female" className="text-[#2B2D42]">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" className="text-[#D6A4A4] border-[#D6A4A4]" />
              <Label htmlFor="other" className="text-[#2B2D42]">Other</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="program" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Program</Label>
          <Select
            value={formData.program}
            onValueChange={(value) => handleSelectChange("program", value)}
          >
            <SelectTrigger id="program" className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {programs.map(program => (
                <SelectItem key={program} value={program}>{program}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branch" className="text-[#2B2D42] font-medium bg-[#F4F4F9] px-2 py-1 rounded-md">Branch/Department</Label>
          <Select
            value={formData.branch}
            onValueChange={(value) => handleSelectChange("branch", value)}
            disabled={!formData.program}
          >
            <SelectTrigger id="branch" className="border-[#E2E2E7] focus:border-[#D6A4A4] focus:ring-[#D6A4A4]/20">
              <SelectValue placeholder={formData.program ? "Select Branch" : "Select Program First"} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {availableDepartments.map(department => (
                <SelectItem key={department} value={department}>{department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
