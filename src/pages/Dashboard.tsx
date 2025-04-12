
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcademic } from "@/contexts/AcademicContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Book, Award, Users, GraduationCap } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { academicRecords, projects, internships, calculateCGPA } = useAcademic();
  
  if (!user) return null;
  
  // Admin Dashboard
  const AdminDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-[#D6A4A4] mr-2" />
                <div className="text-2xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 text-[#D6A4A4] mr-2" />
                <div className="text-2xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {new Date().toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="sakura-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System activity in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 text-muted-foreground">
              No recent activity
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Teacher Dashboard
  const TeacherDashboard = () => {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Students Assigned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-[#D6A4A4] mr-2" />
                <div className="text-2xl font-bold">1</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{user.department}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="sakura-card">
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>Average SGPA across semesters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { semester: 'Semester 1', sgpa: academicRecords.student1?.[0]?.sgpa || 0 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="sgpa" fill="#D6A4A4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  // Student Dashboard
  const StudentDashboard = () => {
    const studentRecords = academicRecords[user.id] || [];
    const studentProjects = projects.filter(p => p.studentId === user.id);
    const studentInternships = internships.filter(i => i.studentId === user.id);
    const cgpa = calculateCGPA(user.id);
    
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Roll Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{user.rollNo}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Program & Branch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{user.program} - {user.branch}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                CGPA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cgpa}</div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Projects & Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="text-xl font-bold">
                  {studentProjects.length + studentInternships.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>SGPA across semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={studentRecords.map(record => ({
                      semester: `Semester ${record.semester}`,
                      sgpa: record.sgpa || 0
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="semester" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="sgpa" fill="#D6A4A4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="sakura-card">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your latest academic activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentProjects.length > 0 ? (
                  <div className="flex items-start space-x-4">
                    <Award className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                    <div>
                      <p className="font-medium">New Project Added</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {studentProjects[0].title}
                      </p>
                    </div>
                  </div>
                ) : null}
                
                {studentInternships.length > 0 ? (
                  <div className="flex items-start space-x-4">
                    <Book className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                    <div>
                      <p className="font-medium">Internship Updated</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {studentInternships[0].company} - {studentInternships[0].role}
                      </p>
                    </div>
                  </div>
                ) : null}
                
                {studentRecords.length > 0 ? (
                  <div className="flex items-start space-x-4">
                    <GraduationCap className="h-5 w-5 text-[#D6A4A4] mt-0.5" />
                    <div>
                      <p className="font-medium">Semester Marks Updated</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Semester {studentRecords[0].semester} - SGPA: {studentRecords[0].sgpa}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  // Render dashboard based on user role
  const getDashboardByRole = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "student":
        return <StudentDashboard />;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden md:block">
            <DarkModeToggle />
          </div>
        </div>
        
        {getDashboardByRole()}
      </div>
    </MainLayout>
  );
}

// Import the dark mode toggle component at the top of the file
import { DarkModeToggle } from "@/components/DarkModeToggle";
