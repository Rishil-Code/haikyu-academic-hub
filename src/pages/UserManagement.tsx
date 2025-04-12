
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen, Shield, Check, ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserManagementHeader } from "@/components/user/UserManagementHeader";
import { TeacherList } from "@/components/user/TeacherList";
import { StudentList } from "@/components/user/StudentList";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { User, AdminPrivileges } from "@/types/user";

// Update user interface to include privileges
interface UserWithPrivileges extends User {
  adminPrivileges?: AdminPrivileges;
}

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [privilegesOpen, setPrivilegesOpen] = useState(false);
  const { users, updateUserProfile } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserWithPrivileges | null>(null);
  const [privileges, setPrivileges] = useState<AdminPrivileges>({
    canManageUsers: false,
    canViewAllRecords: false,
    canGradeStudents: false,
    canAccessAnalytics: false,
  });
  const [showUserList, setShowUserList] = useState(true);

  const teacherUsers = users.filter(user => user.role === "teacher") as UserWithPrivileges[];
  const studentUsers = users.filter(user => user.role === "student") as UserWithPrivileges[];
  const allUsers = [...teacherUsers, ...studentUsers];

  const openPrivilegesDialog = (user: UserWithPrivileges) => {
    setSelectedUser(user);
    setPrivileges(user.adminPrivileges || {
      canManageUsers: false,
      canViewAllRecords: false,
      canGradeStudents: false,
      canAccessAnalytics: false,
    });
    setShowUserList(false);
    setPrivilegesOpen(true);
  };

  const handleSavePrivileges = () => {
    if (!selectedUser) return;

    // Prevent changes to the main admin account
    if (selectedUser.id === 'rishil') {
      toast.error("Cannot modify privileges for the main admin account.");
      return;
    }

    // Update user with new privileges
    updateUserProfile(selectedUser.id, {
      adminPrivileges: privileges
    });

    toast.success(`Updated admin privileges for ${selectedUser.name}`);
    setShowUserList(true);
  };

  const goBackToUserList = () => {
    setSelectedUser(null);
    setShowUserList(true);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <UserManagementHeader open={open} setOpen={setOpen} />
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setPrivilegesOpen(true)} 
                className="bg-[#2B2D42] hover:bg-[#3E3F54] text-white"
              >
                <Shield className="mr-2 h-4 w-4" />
                Assign Admin Privileges
              </Button>
              <DarkModeToggle />
            </div>
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

        {/* Admin Privileges Dialog */}
        <Dialog open={privilegesOpen} onOpenChange={setPrivilegesOpen}>
          <DialogContent className="sm:max-w-[550px] sakura-card">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-[#D6A4A4]" />
                Assign Admin Privileges
              </DialogTitle>
              <DialogDescription>
                Give special admin privileges to teachers and students
              </DialogDescription>
            </DialogHeader>

            {selectedUser ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#F4F4F9] dark:bg-[#282836] p-3 rounded-lg">
                    <h3 className="font-medium dark:text-white">Editing Privileges for {selectedUser.name}</h3>
                    <p className="text-sm text-[#6D6875] dark:text-gray-400">Role: {selectedUser.role}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={goBackToUserList}
                    className="flex items-center"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to List
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/50 dark:bg-[#1E1E2F]/70">
                    <div>
                      <h4 className="font-medium dark:text-white">User Management Access</h4>
                      <p className="text-sm text-[#6D6875] dark:text-gray-400">Allow creation and management of users</p>
                    </div>
                    <Switch 
                      checked={privileges.canManageUsers}
                      onCheckedChange={(checked) => setPrivileges({...privileges, canManageUsers: checked})}
                      className="data-[state=checked]:bg-[#D6A4A4]"
                      disabled={selectedUser.id === 'rishil'}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/50 dark:bg-[#1E1E2F]/70">
                    <div>
                      <h4 className="font-medium dark:text-white">Student Records Access</h4>
                      <p className="text-sm text-[#6D6875] dark:text-gray-400">View all student academic records</p>
                    </div>
                    <Switch 
                      checked={privileges.canViewAllRecords}
                      onCheckedChange={(checked) => setPrivileges({...privileges, canViewAllRecords: checked})}
                      className="data-[state=checked]:bg-[#D6A4A4]"
                      disabled={selectedUser.id === 'rishil'}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/50 dark:bg-[#1E1E2F]/70">
                    <div>
                      <h4 className="font-medium dark:text-white">Grading Access</h4>
                      <p className="text-sm text-[#6D6875] dark:text-gray-400">Grade and evaluate student performance</p>
                    </div>
                    <Switch 
                      checked={privileges.canGradeStudents}
                      onCheckedChange={(checked) => setPrivileges({...privileges, canGradeStudents: checked})}
                      className="data-[state=checked]:bg-[#D6A4A4]"
                      disabled={selectedUser.id === 'rishil'}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/50 dark:bg-[#1E1E2F]/70">
                    <div>
                      <h4 className="font-medium dark:text-white">Analytics Access</h4>
                      <p className="text-sm text-[#6D6875] dark:text-gray-400">Access data insights and analytics</p>
                    </div>
                    <Switch 
                      checked={privileges.canAccessAnalytics}
                      onCheckedChange={(checked) => setPrivileges({...privileges, canAccessAnalytics: checked})}
                      className="data-[state=checked]:bg-[#D6A4A4]"
                      disabled={selectedUser.id === 'rishil'}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={goBackToUserList} variant="outline">Cancel</Button>
                  <Button onClick={handleSavePrivileges} className="btn-sakura">
                    <Check className="mr-2 h-4 w-4" /> Save Privileges
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Privileges</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map(user => {
                        const hasPrivileges = user.adminPrivileges && 
                          (user.adminPrivileges.canManageUsers || 
                          user.adminPrivileges.canViewAllRecords || 
                          user.adminPrivileges.canGradeStudents || 
                          user.adminPrivileges.canAccessAnalytics);
                          
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium dark:text-white">{user.name}</TableCell>
                            <TableCell className="capitalize">{user.role}</TableCell>
                            <TableCell>
                              {hasPrivileges ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D6A4A4]/20 text-[#D6A4A4] dark:bg-[#D6A4A4]/30 dark:text-white">
                                  <Shield className="mr-1 h-3 w-3" />
                                  Admin Privileges
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-sm">None</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openPrivilegesDialog(user)}
                                className="hover:bg-[#D6A4A4]/10"
                                disabled={user.id === 'rishil' && user.role === 'admin'}
                              >
                                {user.id === 'rishil' && user.role === 'admin' ? 
                                  'Main Admin' : 'Edit Privileges'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                
                <DialogFooter>
                  <Button onClick={() => setPrivilegesOpen(false)} variant="outline">Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
}
