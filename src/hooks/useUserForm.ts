
import { useState } from "react";

interface FormData {
  id: string;
  name: string;
  password: string;
  department: string;
  gender: string;
  rollNo: string;
  program: string;
  branch: string;
}

export const useUserForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    name: "",
    password: "",
    department: "",
    gender: "male", // Default gender
    rollNo: "",
    program: "BTech",
    branch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      password: "",
      department: "",
      gender: "male",
      rollNo: "",
      program: "BTech",
      branch: "",
    });
  };

  return {
    formData,
    handleChange,
    handleSelectChange,
    togglePasswordVisibility,
    showPassword,
    resetForm
  };
};
