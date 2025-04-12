
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { GraduationCap } from "lucide-react";

export default function Results() {
  const { user } = useAuth();
  const { academicRecords, calculateCGPA } = useAcademic();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  
  if (!user) return null;
  
  // Ensure we're getting the correct student records
  const studentRecords = academicRecords[user.id] || [];
  const cgpa = calculateCGPA(user.id);
  
  // Get the selected semester record
  const semesterRecord = selectedSemester 
    ? studentRecords.find(record => record.semester === parseInt(selectedSemester))
    : studentRecords.length > 0 ? studentRecords[0] : null;

  // Set first semester as default if no selection and we have records
  useEffect(() => {
    if (studentRecords.length > 0 && !selectedSemester) {
      setSelectedSemester(studentRecords[0].semester.toString());
    }
  }, [studentRecords, selectedSemester]);
    
  // Prepare data for pie chart
  const getPerformanceData = () => {
    if (!semesterRecord) return [];
    
    const subjectPerformance = semesterRecord.subjects.map(subject => {
      const totalMarks = subject.mid1 !== null && subject.mid2 !== null && subject.semExam !== null
        ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
        : 0;
      return {
        name: subject.name,
        value: totalMarks,
      };
    });
    
    return subjectPerformance;
  };
  
  const COLORS = ['#D6A4A4', '#6D6875', '#B392AC', '#F4A9A8', '#8785A2'];

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Academic Results</h1>
              <p className="text-gray-500 dark:text-gray-400">
                View your semester-wise academic performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white dark:bg-[#282836] px-4 py-2 rounded-xl shadow-sm">
                <span className="text-sm font-medium">Your CGPA:</span>
                <span className="text-lg font-bold text-[#D6A4A4]">{cgpa}</span>
              </div>
              <DarkModeToggle />
            </div>
          </div>
          
          {studentRecords.length > 0 ? (
            <>
              <Card className="sakura-card">
                <CardHeader>
                  <CardTitle>Select Semester</CardTitle>
                  <CardDescription>Choose a semester to view detailed results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] input-field">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentRecords.map(record => (
                        <SelectItem 
                          key={record.semester} 
                          value={record.semester.toString()}
                        >
                          Semester {record.semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
              
              {semesterRecord ? (
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="sakura-card">
                    <CardHeader>
                      <CardTitle>Marks Breakdown</CardTitle>
                      <CardDescription>Semester {semesterRecord.semester} - SGPA: {semesterRecord.sgpa}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">Mid 1</TableHead>
                            <TableHead className="text-right">Mid 2</TableHead>
                            <TableHead className="text-right">Sem Exam</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {semesterRecord.subjects.map((subject, index) => {
                            const totalMarks = subject.mid1 !== null && subject.mid2 !== null && subject.semExam !== null
                              ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
                              : null;
                              
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{subject.name}</TableCell>
                                <TableCell className="text-right">{subject.mid1 ?? 'N/A'}</TableCell>
                                <TableCell className="text-right">{subject.mid2 ?? 'N/A'}</TableCell>
                                <TableCell className="text-right">{subject.semExam ?? 'N/A'}</TableCell>
                                <TableCell className="text-right font-bold">
                                  {totalMarks ? totalMarks.toFixed(0) : 'N/A'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                      
                      <div className="mt-6">
                        <h3 className="text-md font-semibold mb-2 dark:text-white">Laboratory Exams</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Lab</TableHead>
                              <TableHead className="text-right">Marks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {semesterRecord.labs.map((lab, index) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{lab.name}</TableCell>
                                <TableCell className="text-right">{lab.marks ?? 'N/A'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="sakura-card">
                    <CardHeader>
                      <CardTitle>Performance Analysis</CardTitle>
                      <CardDescription>Visual representation of your marks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getPerformanceData()}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {getPerformanceData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="sakura-card">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      {studentRecords.length > 0 
                        ? "Please select a semester to view results" 
                        : "No academic records found"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="sakura-card">
              <CardContent className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium mb-2 dark:text-white">No academic records found</h3>
                <p className="text-muted-foreground mb-4">
                  Your teacher has not yet added any academic records for you. Please check back later.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
