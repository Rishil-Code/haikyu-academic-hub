
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, GraduationCap, BookOpen } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { CreateUserDialog } from "@/components/user/CreateUserDialog";
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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <CreateUserDialog open={open} setOpen={setOpen} />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="purple-card">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <GraduationCap className="mr-2 h-5 w-5 text-haikyu-orange" />
                  Teachers
                </CardTitle>
                <CardDescription className="text-purple-200">Manage teacher accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <TeacherList teachers={teacherUsers} />
              </CardContent>
            </Card>
            
            <Card className="purple-card">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="mr-2 h-5 w-5 text-haikyu-orange" />
                  Students
                </CardTitle>
                <CardDescription className="text-purple-200">Manage student accounts</CardDescription>
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
