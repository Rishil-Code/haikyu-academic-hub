
import React, { useState, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Eye, EyeOff, Save, User, Mail, Github, Linkedin, Phone, MapPin } from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";

export default function AccountSettings() {
  const { user, updateUserProfile, updateUserPassword } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePic || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedData = {
      ...profileData,
      profilePic: profileImage,
    };
    
    if (updateUserProfile(user.id, updatedData)) {
      toast.success("Profile updated successfully!");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (!newPassword) {
      toast.error("New password is required");
      return;
    }
    
    if (currentPassword !== user.password) {
      toast.error("Current password is incorrect");
      return;
    }
    
    if (updateUserPassword(user.id, newPassword)) {
      setCurrentPassword("");
      setNewPassword("");
      toast.success("Password changed successfully!");
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your profile and security settings</p>
            </div>
            <DarkModeToggle />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card className="sakura-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-3 mb-6">
                  <div className="relative" onClick={handleProfileImageClick}>
                    <Avatar className="h-24 w-24 cursor-pointer border-2 border-[#D6A4A4] shadow-lg">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt={user?.name || "Profile"} />
                      ) : (
                        <AvatarFallback className="bg-[#D6A4A4] text-white text-lg">
                          {user?.name?.charAt(0) || <User size={32} />}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-[#D6A4A4] text-white rounded-full p-2 shadow-md">
                      <Camera size={16} />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <p className="text-sm text-center text-muted-foreground">
                    Click on avatar to upload a new profile picture
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-[#D6A4A4]" />
                      <Label htmlFor="name">Full Name</Label>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-[#D6A4A4]" />
                      <Label htmlFor="email">Email Address</Label>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="input-field"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4 text-[#D6A4A4]" />
                        <Label htmlFor="github">GitHub</Label>
                      </div>
                      <Input
                        id="github"
                        name="github"
                        value={profileData.github}
                        onChange={handleProfileChange}
                        placeholder="github.com/username"
                        className="input-field"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-[#D6A4A4]" />
                        <Label htmlFor="linkedin">LinkedIn</Label>
                      </div>
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleProfileChange}
                        placeholder="linkedin.com/in/username"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-[#D6A4A4]" />
                      <Label htmlFor="phone">Phone Number</Label>
                    </div>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="Your phone number"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-[#D6A4A4]" />
                      <Label htmlFor="address">Address</Label>
                    </div>
                    <Textarea
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      placeholder="Your address"
                      className="input-field min-h-[100px] resize-none"
                    />
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="w-full btn-sakura">
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Security Settings */}
            <Card className="sakura-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and account security</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        className="input-field pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        className="input-field pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full btn-sakura">
                    Change Password
                  </Button>
                </form>
                
                <div className="mt-8 pt-8 border-t dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <span className="font-medium">{user?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium capitalize">{user?.role}</span>
                    </div>
                    {user?.role === 'teacher' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{user?.department}</span>
                      </div>
                    )}
                    {user?.role === 'student' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Roll Number:</span>
                          <span className="font-medium">{user?.rollNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Program:</span>
                          <span className="font-medium">{user?.program}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Branch:</span>
                          <span className="font-medium">{user?.branch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gender:</span>
                          <span className="font-medium capitalize">{user?.gender || "Not specified"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
