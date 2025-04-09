
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic } from "@/contexts/AcademicContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Results() {
  const { user } = useAuth();
  const { academicRecords, calculateCGPA } = useAcademic();
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  
  if (!user) return null;
  
  const studentRecords = academicRecords[user.id] || [];
  const cgpa = calculateCGPA(user.id);
  
  // Get the selected semester record
  const semesterRecord = selectedSemester 
    ? studentRecords.find(record => record.semester === parseInt(selectedSemester))
    : null;
    
  // Prepare data for pie chart
  const getPerformanceData = () => {
    if (!semesterRecord) return [];
    
    const subjectPerformance = semesterRecord.subjects.map(subject => {
      const totalMarks = subject.mid1 && subject.mid2 && subject.semExam 
        ? (subject.mid1 + subject.mid2) / 2 + subject.semExam
        : 0;
      return {
        name: subject.name,
        value: totalMarks,
      };
    });
    
    return subjectPerformance;
  };
  
  const COLORS = ['#F4A261', '#2B3A67', '#F9C784', '#1A1F2C', '#E76F51'];

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Academic Results</h1>
          
          <div className="flex justify-between items-center">
            <p className="text-gray-500">
              View your semester-wise academic performance
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Your CGPA:</span>
              <span className="text-lg font-bold text-haikyu-orange">{cgpa}</span>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Select Semester</CardTitle>
              <CardDescription>Choose a semester to view detailed results</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
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
              <Card>
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
                        const totalMarks = subject.mid1 && subject.mid2 && subject.semExam 
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
                    <h3 className="text-md font-semibold mb-2">Laboratory Exams</h3>
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
              
              <Card>
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
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {studentRecords.length > 0 
                    ? "Please select a semester to view results" 
                    : "No academic records found"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
