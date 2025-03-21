
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const UserSettings = () => {
  const { user, updateUsername, updateEmail, updatePassword, theme, toggleTheme } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");
  
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    
    if (username === user?.username) {
      toast.info("Username is the same as current username");
      return;
    }
    
    setIsUpdatingUsername(true);
    try {
      await updateUsername(username);
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Email cannot be empty");
      return;
    }
    
    if (email === user?.email) {
      toast.info("Email is the same as current email");
      return;
    }
    
    if (!passwordForEmail.trim()) {
      toast.error("Password is required to update email");
      return;
    }
    
    setIsUpdatingEmail(true);
    try {
      await updateEmail(email, passwordForEmail);
      setPasswordForEmail("");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }
    
    if (!newPassword.trim()) {
      toast.error("New password cannot be empty");
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    
    setIsUpdatingPassword(true);
    try {
      const success = await updatePassword(currentPassword, newPassword);
      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-20 px-4">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-primary hover:text-primary/90 transition-colors">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Username</CardTitle>
                <CardDescription>Update your username</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUsernameUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingUsername}>
                    {isUpdatingUsername ? "Updating..." : "Update Username"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>Update your email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordForEmail">Current Password</Label>
                    <Input
                      id="passwordForEmail"
                      type="password"
                      value={passwordForEmail}
                      onChange={(e) => setPasswordForEmail(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingEmail}>
                    {isUpdatingEmail ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <Button type="submit" disabled={isUpdatingPassword}>
                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-mode">Light Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between dark and light mode
                  </p>
                </div>
                <Switch
                  id="theme-mode"
                  checked={theme === "light"}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <Separator className="my-6" />
              <p className="text-sm text-muted-foreground">
                More appearance settings will be added in future updates.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
