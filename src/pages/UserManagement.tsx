
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserManagementHeader } from "@/components/user/UserManagementHeader";
import { TeacherList } from "@/components/user/TeacherList";
import { StudentList } from "@/components/user/StudentList";

export default function UserManagement() {
  const [open, setOpen] = React.useState(false);
  const { users } = useAuth();

  const teacherUsers = users.filter(user => user.role === "teacher");
  const studentUsers = users.filter(user => user.role === "student");

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <UserManagementHeader open={open} setOpen={setOpen} />
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border border-indigo-500/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <GraduationCap className="mr-2 h-5 w-5 text-indigo-300" />
                  Teachers
                </CardTitle>
                <CardDescription className="text-indigo-200">Manage teacher accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <TeacherList teachers={teacherUsers} />
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-800/90 to-purple-800/90 border border-indigo-500/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="mr-2 h-5 w-5 text-indigo-300" />
                  Students
                </CardTitle>
                <CardDescription className="text-indigo-200">Manage student accounts</CardDescription>
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
