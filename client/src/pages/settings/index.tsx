import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Edit, 
  Globe, 
  Key, 
  Loader2, 
  Mail, 
  Save, 
  Shield, 
  Trash, 
  User, 
  Wallet 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Define schema for profile updates
const profileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  fullName: z.string().optional(),
  walletAddress: z.string().optional(),
  address: z.string().optional(),
});

export default function SettingsPage() {
  const [, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  // Redirect if user is not logged in
  useEffect(() => {
    if (!user && !logoutMutation.isLoading) {
      navigate('/auth');
    }
  }, [user, navigate, logoutMutation.isLoading]);

  // Setup form with user data
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
      walletAddress: user?.walletAddress || "",
      address: user?.address || "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || "",
        email: user.email || "",
        fullName: user.fullName || "",
        walletAddress: user.walletAddress || "",
        address: user.address || "",
      });
    }
  }, [user, profileForm]);

  // Handle profile update
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const res = await apiRequest("PATCH", `/api/user/${user?.id}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle profile form submission
  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    updateProfileMutation.mutate(values);
  };

  // Handle logout button click
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={logoutMutation.isLoading}
          >
            {logoutMutation.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              "Log out"
            )}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      View and update your personal information
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Done
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    placeholder="Username" 
                                    className="pl-9" 
                                    {...field}
                                    disabled={!isEditing}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    placeholder="Email" 
                                    className="pl-9" 
                                    {...field}
                                    disabled={!isEditing}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your full name" 
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="walletAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wallet Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Wallet className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="Your wallet address" 
                                  className="pl-9"
                                  {...field}
                                  disabled={!isEditing}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Physical Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your address" 
                                {...field}
                                disabled={!isEditing}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={updateProfileMutation.isLoading}
                        >
                          {updateProfileMutation.isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Status</CardTitle>
                  <CardDescription>
                    Your KYC verification status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${user.kycVerified ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {user.kycVerified ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertTriangle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {user.kycVerified ? 'Verified' : 'Verification Required'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.kycVerified 
                          ? 'Your KYC verification is complete. You have full access to all features.' 
                          : 'Complete your KYC verification to access all features.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {!user.kycVerified && (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/kyc')}
                    >
                      Complete KYC
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Account Type</Label>
                    <div className="mt-1 rounded-md border p-3">Personal Account</div>
                  </div>
                  <div>
                    <Label>Account Created</Label>
                    <div className="mt-1 rounded-md border p-3">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between rounded-md border border-destructive/50 p-4">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm">
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your password to keep your account secure
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Setup 2FA
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Sessions</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your active sessions and devices
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Globe className="mr-2 h-4 w-4" />
                      Manage Sessions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications about account activity
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="checkbox" 
                        id="email-notifications" 
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="email-notifications">Enabled</Label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Transaction Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified about important transaction events
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="checkbox" 
                        id="transaction-alerts" 
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="transaction-alerts">Enabled</Label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Security Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about security-related events
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="checkbox" 
                        id="security-alerts" 
                        className="h-4 w-4 rounded border-gray-300"
                        defaultChecked
                      />
                      <Label htmlFor="security-alerts">Enabled</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="gap-2" onClick={() => toast({ title: "Settings saved" })}>
                  <Bell className="h-4 w-4" />
                  Save Notification Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}