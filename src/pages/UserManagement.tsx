
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserManagementHeader } from "@/components/user/UserManagementHeader";
import { TeacherList } from "@/components/user/TeacherList";
import { StudentList } from "@/components/user/StudentList";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function UserManagement() {
  const [open, setOpen] = React.useState(false);
  const { users } = useAuth();

  const teacherUsers = users.filter(user => user.role === "teacher");
  const studentUsers = users.filter(user => user.role === "student");

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <UserManagementHeader open={open} setOpen={setOpen} />
            <DarkModeToggle />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="sakura-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-slate-800 dark:text-white">
                  <GraduationCap className="mr-2 h-5 w-5 text-[#D6A4A4]" />
                  Teachers
                </CardTitle>
                <CardDescription className="text-[#6D6875] dark:text-gray-400">Manage teacher accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <TeacherList teachers={teacherUsers} />
              </CardContent>
            </Card>
            
            <Card className="sakura-card">
              <CardHeader>
                <CardTitle className="flex items-center text-xl font-semibold text-slate-800 dark:text-white">
                  <BookOpen className="mr-2 h-5 w-5 text-[#D6A4A4]" />
                  Students
                </CardTitle>
                <CardDescription className="text-[#6D6875] dark:text-gray-400">Manage student accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <StudentList students={studentUsers} />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
