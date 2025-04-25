import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Bell, Shield, Lock, Globe, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <a className="mr-6 flex items-center gap-2 md:mr-8" href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span className="font-bold">FinVault</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a className="font-medium transition-colors hover:text-primary" href="/dashboard">Dashboard</a>
            <a className="font-medium transition-colors hover:text-primary" href="/assets">Assets</a>
            <a className="font-medium transition-colors hover:text-primary" href="/settings">Settings</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with padding for fixed sidebar */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 ml-0 md:ml-64 lg:ml-72">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Settings</h1>
            <ModeToggle />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
                </div>
                <Button variant="outline" className="ml-auto">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Personal Information</p>
                  <p className="text-xs text-muted-foreground">Update your name, email, and profile photo</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">Manage Account</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Password & Authentication</p>
                  <p className="text-xs text-muted-foreground">Manage your password and security settings</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">Security Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Notification Preferences</p>
                  <p className="text-xs text-muted-foreground">Configure how you receive alerts and updates</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">Notification Settings</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Customize your application experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light, dark, or system theme</p>
                  </div>
                  <ModeToggle />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="two-factor" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cookie Preferences</Label>
                    <p className="text-sm text-muted-foreground">Manage how we use cookies on this site</p>
                  </div>
                  <Button variant="outline" size="sm">Manage Cookies</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Security</CardTitle>
              <CardDescription>Manage your privacy and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Control how your data is shared with third parties</p>
                </div>
                <Switch id="data-sharing" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Activity Log</Label>
                  <p className="text-sm text-muted-foreground">View and manage your account activity history</p>
                </div>
                <Button variant="outline" size="sm">View Log</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Download Your Data</Label>
                  <p className="text-sm text-muted-foreground">Request a copy of all your personal data</p>
                </div>
                <Button variant="outline" size="sm">Request Data</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Delete Account</Label>
                  <p className="text-sm text-muted-foreground text-red-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}