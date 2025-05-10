
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  Check, 
  Loader2, 
  Shield, 
  User, 
  Bell, 
  Heart, 
  BarChart3, 
  Scale 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { upsertUserProfile } from "@/lib/supabase/profiles";

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "elite", label: "Elite" }
];

const Profile = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const [generalForm, setGeneralForm] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    experience: "",
  });
  
  const [fitnessForm, setFitnessForm] = useState({
    height: "",
    weight: "",
    targetWeight: "",
    fitnessLevel: "",
    goals: ""
  });
  
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    app: true
  });
  
  useEffect(() => {
    if (profile) {
      setGeneralForm({
        name: profile.name || "",
        email: profile.email || "",
        bio: profile.bio || "",
        specialization: profile.specialization || "",
        experience: profile.experience ? profile.experience.toString() : "",
      });
      
      setFitnessForm({
        height: profile.height ? profile.height.toString() : "",
        weight: profile.weight ? profile.weight.toString() : "",
        targetWeight: profile.target_weight ? profile.target_weight.toString() : "",
        fitnessLevel: profile.fitness_level || "",
        goals: profile.goals ? profile.goals.join(", ") : ""
      });
      
      setNotificationPrefs({
        email: profile.notification_preferences?.email !== false,
        app: profile.notification_preferences?.app !== false
      });
    }
  }, [profile]);
  
  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFitnessInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFitnessForm((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (key: 'email' | 'app', value: boolean) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    setIsLoading(true);
    
    try {
      const updatedProfile = await upsertUserProfile({
        id: user.id,
        name: generalForm.name,
        email: profile.email,
        bio: generalForm.bio,
        role: profile.role,
        specialization: profile.role === 'trainer' ? generalForm.specialization : null,
        experience: profile.role === 'trainer' && generalForm.experience 
          ? parseInt(generalForm.experience) 
          : null
      });
      
      if (updatedProfile) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been successfully updated.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFitnessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    setIsLoading(true);
    
    try {
      const goalsArray = fitnessForm.goals
        .split(',')
        .map(goal => goal.trim())
        .filter(goal => goal !== "");
        
      const updatedProfile = await upsertUserProfile({
        id: user.id,
        email: profile.email,
        role: profile.role,
        name: profile.name,
        height: fitnessForm.height ? parseFloat(fitnessForm.height) : null,
        weight: fitnessForm.weight ? parseFloat(fitnessForm.weight) : null,
        target_weight: fitnessForm.targetWeight ? parseFloat(fitnessForm.targetWeight) : null,
        fitness_level: fitnessForm.fitnessLevel || null,
        goals: goalsArray.length > 0 ? goalsArray : null
      });
      
      if (updatedProfile) {
        toast({
          title: "Fitness profile updated",
          description: "Your fitness information has been successfully updated.",
        });
      } else {
        throw new Error("Failed to update fitness profile");
      }
    } catch (error) {
      console.error("Error updating fitness profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your fitness information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) return;
    
    setIsLoading(true);
    
    try {
      const updatedProfile = await upsertUserProfile({
        id: user.id,
        email: profile.email,
        role: profile.role,
        name: profile.name,
        notification_preferences: notificationPrefs
      });
      
      if (updatedProfile) {
        toast({
          title: "Notification preferences updated",
          description: "Your notification settings have been successfully saved.",
        });
      } else {
        throw new Error("Failed to update notification preferences");
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your notification preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background pt-16 pb-12">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and set your preferences
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information visible to clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
                        {profile?.name?.charAt(0) || <User size={32} />}
                      </div>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h3 className="font-medium">{profile?.name || "Your Name"}</h3>
                      <p className="text-sm text-muted-foreground">{profile?.email}</p>
                      <p className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 inline-block mt-1">
                        {profile?.role === "trainer" ? "Trainer" : "Client"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        value={generalForm.name}
                        onChange={handleGeneralInputChange}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={generalForm.email}
                        onChange={handleGeneralInputChange}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">
                        Your email address is used for login and cannot be changed
                      </p>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell clients about yourself and your experience"
                        value={generalForm.bio}
                        onChange={handleGeneralInputChange}
                        rows={4}
                      />
                    </div>
                    
                    {profile?.role === "trainer" && (
                      <>
                        <div className="grid gap-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input
                            id="specialization"
                            name="specialization"
                            placeholder="Your area of expertise"
                            value={generalForm.specialization}
                            onChange={handleGeneralInputChange}
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            name="experience"
                            type="number"
                            placeholder="Years of professional experience"
                            value={generalForm.experience}
                            onChange={handleGeneralInputChange}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fitness" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Profile</CardTitle>
                <CardDescription>
                  Update your fitness details and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFitnessSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="height">Height (cm)</Label>
                          </div>
                          <Input
                            id="height"
                            name="height"
                            type="number"
                            placeholder="Enter your height in cm"
                            value={fitnessForm.height}
                            onChange={handleFitnessInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Scale className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="weight">Current Weight (kg)</Label>
                          </div>
                          <Input
                            id="weight"
                            name="weight"
                            type="number"
                            placeholder="Enter your current weight in kg"
                            value={fitnessForm.weight}
                            onChange={handleFitnessInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                          </div>
                          <Input
                            id="targetWeight"
                            name="targetWeight"
                            type="number"
                            placeholder="Enter your target weight in kg"
                            value={fitnessForm.targetWeight}
                            onChange={handleFitnessInputChange}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="fitnessLevel">Fitness Level</Label>
                          </div>
                          <Select 
                            value={fitnessForm.fitnessLevel} 
                            onValueChange={(value) => setFitnessForm(prev => ({...prev, fitnessLevel: value}))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your fitness level" />
                            </SelectTrigger>
                            <SelectContent>
                              {FITNESS_LEVELS.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="goals">Fitness Goals</Label>
                          </div>
                          <Textarea
                            id="goals"
                            name="goals"
                            placeholder="Enter your fitness goals, separated by commas"
                            value={fitnessForm.goals}
                            onChange={handleFitnessInputChange}
                            rows={4}
                          />
                          <p className="text-xs text-muted-foreground">
                            Example: Weight loss, Muscle gain, Improved endurance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Save Fitness Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you'd like to be notified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationsSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates, reminders, and messages via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notificationPrefs.email}
                        onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-notifications">In-App Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications within the application
                        </p>
                      </div>
                      <Switch
                        id="app-notifications"
                        checked={notificationPrefs.app}
                        onCheckedChange={(checked) => handleNotificationChange('app', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Bell className="mr-2 h-4 w-4" />
                          Save Notification Preferences
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      <Shield className="mr-2 h-4 w-4" />
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default Profile;
