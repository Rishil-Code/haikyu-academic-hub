
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { Search } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function StudentRecords() {
  const { users } = useAuth();
  const { academicRecords, projects, internships, calculateCGPA } = useAcademic();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  const studentUsers = users.filter(user => user.role === "student");
  const filteredStudents = studentUsers.filter(
    student => student.name.toLowerCase().includes(search.toLowerCase()) ||
              (student.rollNo || "").toLowerCase().includes(search.toLowerCase())
  );
  
  const COLORS = ['#F4A261', '#2B3A67', '#F9C784', '#1A1F2C', '#E76F51'];
  
  // Get the selected student's data
  const selectedStudentData = selectedStudent 
    ? studentUsers.find(s => s.id === selectedStudent)
    : null;
    
  const studentAcademicRecords = selectedStudent 
    ? academicRecords[selectedStudent] || []
    : [];
    
  const studentProjects = selectedStudent 
    ? projects.filter(p => p.studentId === selectedStudent)
    : [];
    
  const studentInternships = selectedStudent 
    ? internships.filter(i => i.studentId === selectedStudent)
    : [];
    
  const cgpa = selectedStudent ? calculateCGPA(selectedStudent) : 0;
  
  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
          <p className="text-gray-500">
            View detailed academic records for all students
          </p>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Student List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search students..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <Button
                          key={student.id}
                          variant="outline"
                          className={`w-full justify-start text-left ${selectedStudent === student.id ? 'bg-haikyu-orange/20 border-haikyu-orange' : ''}`}
                          onClick={() => setSelectedStudent(student.id)}
                        >
                          <div className="h-6 w-6 rounded-full bg-haikyu-navy text-white flex items-center justify-center text-xs font-medium mr-2">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-gray-500">{student.rollNo}</p>
                          </div>
                        </Button>
                      ))
                    ) : (
                      <div className="text-center p-4 text-muted-foreground">
                        No students found
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              {selectedStudentData ? (
                <Tabs defaultValue="academic">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{selectedStudentData.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedStudentData.program} - {selectedStudentData.branch} | Roll No: {selectedStudentData.rollNo}
                        </p>
                      </div>
                      <div className="bg-haikyu-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                        CGPA: {cgpa}
                      </div>
                    </div>
                    <TabsList className="mt-4">
                      <TabsTrigger value="academic">Academic Records</TabsTrigger>
                      <TabsTrigger value="projects">Projects</TabsTrigger>
                      <TabsTrigger value="internships">Internships</TabsTrigger>
                    </TabsList>
                  </CardHeader>
                  
                  <CardContent>
                    <TabsContent value="academic">
                      {studentAcademicRecords.length > 0 ? (
                        <div className="space-y-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Semester Performance</h3>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <BarChart
                                    data={studentAcademicRecords.map(record => ({
                                      semester: `Sem ${record.semester}`,
                                      sgpa: record.sgpa || 0
                                    }))}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="semester" />
                                    <YAxis domain={[0, 10]} />
                                    <Tooltip />
                                    <Bar dataKey="sgpa" fill="#F4A261" />
                                  </BarChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-medium mb-2">Subject Distribution</h3>
                              <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={studentAcademicRecords[0]?.subjects.map(subject => ({
                                        name: subject.name,
                                        value: subject.mid1 && subject.mid2 && subject.semExam 
                                          ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
                                          : 0
                                      }))}
                                      cx="50%"
                                      cy="50%"
                                      outerRadius={80}
                                      fill="#8884d8"
                                      dataKey="value"
                                      nameKey="name"
                                      label={({ name }) => name}
                                    >
                                      {studentAcademicRecords[0]?.subjects.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                      ))}
                                    </Pie>
                                    <Tooltip />
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Semester Details</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Semester</TableHead>
                                  <TableHead>Subjects</TableHead>
                                  <TableHead>Labs</TableHead>
                                  <TableHead className="text-right">SGPA</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {studentAcademicRecords.map(record => (
                                  <TableRow key={record.semester}>
                                    <TableCell className="font-medium">Semester {record.semester}</TableCell>
                                    <TableCell>{record.subjects.length}</TableCell>
                                    <TableCell>{record.labs.length}</TableCell>
                                    <TableCell className="text-right font-bold">{record.sgpa}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          No academic records found for this student
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="projects">
                      {studentProjects.length > 0 ? (
                        <div className="space-y-4">
                          {studentProjects.map(project => (
                            <div 
                              key={project.id}
                              className="p-4 border rounded-md bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{project.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-xs px-2 py-1 rounded-full bg-haikyu-orange/20 text-haikyu-orange">
                                  Project
                                </div>
                              </div>
                              <p className="mt-2 text-sm">{project.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          No projects found for this student
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="internships">
                      {studentInternships.length > 0 ? (
                        <div className="space-y-4">
                          {studentInternships.map(internship => (
                            <div 
                              key={internship.id}
                              className="p-4 border rounded-md bg-gray-50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{internship.company}</h3>
                                  <p className="text-sm font-medium text-haikyu-orange">
                                    {internship.role}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-xs px-2 py-1 rounded-full bg-haikyu-orange/20 text-haikyu-orange">
                                  Internship
                                </div>
                              </div>
                              <p className="mt-2 text-sm">{internship.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          No internships found for this student
                        </div>
                      )}
                    </TabsContent>
                  </CardContent>
                </Tabs>
              ) : (
                <CardContent className="flex items-center justify-center h-full min-h-[300px]">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      Select a student to view their records
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
