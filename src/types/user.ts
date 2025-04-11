
// Define user roles
export type UserRole = 'admin' | 'teacher' | 'student';

// Define user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  password?: string;
  department?: string;
  rollNo?: string;
  program?: 'BTech' | 'MTech';
  branch?: string;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  github?: string;
  linkedin?: string;
  phone?: string;
  address?: string;
  profilePic?: string;
}
