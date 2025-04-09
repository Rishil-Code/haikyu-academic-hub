
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAcademic, Subject, Laboratory } from "@/contexts/AcademicContext";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function GradeManagement() {
  const { users } = useAuth();
  const { updateMarks } = useAcademic();
  
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [semester, setSemester] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "", mid1: null, mid2: null, semExam: null, credits: 4 }
  ]);
  const [labs, setLabs] = useState<Laboratory[]>([
    { name: "", marks: null, credits: 2 }
  ]);
  
  const studentUsers = users.filter(user => user.role === "student");
  
  const handleAddSubject = () => {
    setSubjects([...subjects, { name: "", mid1: null, mid2: null, semExam: null, credits: 4 }]);
  };
  
  const handleRemoveSubject = (index: number) => {
    if (subjects.length > 1) {
      const updatedSubjects = [...subjects];
      updatedSubjects.splice(index, 1);
      setSubjects(updatedSubjects);
    }
  };
  
  const handleSubjectChange = (index: number, field: keyof Subject, value: string) => {
    const updatedSubjects = [...subjects];
    
    if (field === 'name') {
      updatedSubjects[index][field] = value;
    } else if (field === 'credits') {
      updatedSubjects[index][field] = parseInt(value) || 0;
    } else {
      // For marks fields (mid1, mid2, semExam)
      const numValue = value === "" ? null : parseInt(value);
      updatedSubjects[index][field] = numValue as any;
    }
    
    setSubjects(updatedSubjects);
  };
  
  const handleAddLab = () => {
    setLabs([...labs, { name: "", marks: null, credits: 2 }]);
  };
  
  const handleRemoveLab = (index: number) => {
    if (labs.length > 1) {
      const updatedLabs = [...labs];
      updatedLabs.splice(index, 1);
      setLabs(updatedLabs);
    }
  };
  
  const handleLabChange = (index: number, field: keyof Laboratory, value: string) => {
    const updatedLabs = [...labs];
    
    if (field === 'name') {
      updatedLabs[index][field] = value;
    } else if (field === 'credits') {
      updatedLabs[index][field] = parseInt(value) || 0;
    } else {
      // For marks field
      const numValue = value === "" ? null : parseInt(value);
      updatedLabs[index][field] = numValue as any;
    }
    
    setLabs(updatedLabs);
  };
  
  const handleSubmit = () => {
    if (!selectedStudent || !semester) {
      toast.error("Please select a student and semester");
      return;
    }
    
    // Validate subjects and labs
    const invalidSubjects = subjects.some(subject => !subject.name);
    const invalidLabs = labs.some(lab => !lab.name);
    
    if (invalidSubjects || invalidLabs) {
      toast.error("Please fill in all subject and lab names");
      return;
    }
    
    updateMarks(selectedStudent, parseInt(semester), subjects, labs);
  };

  return (
    <ProtectedRoute allowedRoles={["teacher", "admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Grade Management</h1>
          <p className="text-gray-500">
            Upload and manage student marks for each semester
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Select Student and Semester</CardTitle>
              <CardDescription>Choose a student and semester to enter or update marks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={selectedStudent}
                    onValueChange={setSelectedStudent}
                  >
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {studentUsers.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({student.rollNo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select
                    value={semester}
                    onValueChange={setSemester}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedStudent && semester && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Theory Subjects</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddSubject}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Subject
                    </Button>
                  </div>
                  <CardDescription>Enter marks for each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={index} className="grid gap-4 sm:grid-cols-12 items-center">
                        <div className="sm:col-span-4">
                          <Label htmlFor={`subject-${index}`}>Subject Name</Label>
                          <Input
                            id={`subject-${index}`}
                            placeholder="e.g., Python Programming"
                            value={subject.name}
                            onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`mid1-${index}`}>Mid 1</Label>
                          <Input
                            id={`mid1-${index}`}
                            type="number"
                            placeholder="Max 30"
                            value={subject.mid1 === null ? "" : subject.mid1.toString()}
                            onChange={(e) => handleSubjectChange(index, 'mid1', e.target.value)}
                            min="0"
                            max="30"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`mid2-${index}`}>Mid 2</Label>
                          <Input
                            id={`mid2-${index}`}
                            type="number"
                            placeholder="Max 30"
                            value={subject.mid2 === null ? "" : subject.mid2.toString()}
                            onChange={(e) => handleSubjectChange(index, 'mid2', e.target.value)}
                            min="0"
                            max="30"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`sem-${index}`}>Sem Exam</Label>
                          <Input
                            id={`sem-${index}`}
                            type="number"
                            placeholder="Max 70"
                            value={subject.semExam === null ? "" : subject.semExam.toString()}
                            onChange={(e) => handleSubjectChange(index, 'semExam', e.target.value)}
                            min="0"
                            max="70"
                          />
                        </div>
                        <div className="sm:col-span-1">
                          <Label htmlFor={`credits-${index}`}>Credits</Label>
                          <Input
                            id={`credits-${index}`}
                            type="number"
                            value={subject.credits.toString()}
                            onChange={(e) => handleSubjectChange(index, 'credits', e.target.value)}
                            min="1"
                            max="5"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSubject(index)}
                            disabled={subjects.length <= 1}
                            className="text-red-500"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Laboratory Exams</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddLab}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Lab
                    </Button>
                  </div>
                  <CardDescription>Enter marks for each lab</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {labs.map((lab, index) => (
                      <div key={index} className="grid gap-4 sm:grid-cols-12 items-center">
                        <div className="sm:col-span-6">
                          <Label htmlFor={`lab-${index}`}>Lab Name</Label>
                          <Input
                            id={`lab-${index}`}
                            placeholder="e.g., Python Lab"
                            value={lab.name}
                            onChange={(e) => handleLabChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <Label htmlFor={`lab-marks-${index}`}>Marks</Label>
                          <Input
                            id={`lab-marks-${index}`}
                            type="number"
                            placeholder="Max 100"
                            value={lab.marks === null ? "" : lab.marks.toString()}
                            onChange={(e) => handleLabChange(index, 'marks', e.target.value)}
                            min="0"
                            max="100"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor={`lab-credits-${index}`}>Credits</Label>
                          <Input
                            id={`lab-credits-${index}`}
                            type="number"
                            value={lab.credits.toString()}
                            onChange={(e) => handleLabChange(index, 'credits', e.target.value)}
                            min="1"
                            max="3"
                          />
                        </div>
                        <div className="sm:col-span-1 flex items-end justify-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLab(index)}
                            disabled={labs.length <= 1}
                            className="text-red-500"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button className="btn-haikyu" onClick={handleSubmit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Marks
                </Button>
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
