"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Upload, User, Shield, Bell, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useSession, updateUser } from "@/lib/auth-client";
import { updateProfile, uploadAvatar } from "@/actions/user";

export function SettingsPageClient() {
  const { data: session } = useSession();
  const sessionUser = session?.user as (Record<string, unknown> & { name?: string }) | undefined;
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [form, setForm] = useState({
    displayName: "",
    username: "",
    bio: "",
    website: "",
    github: "",
    twitter: "",
    location: "",
  });

  useEffect(() => {
    if (sessionUser) {
      setForm({
        displayName: typeof sessionUser["displayName"] === "string" ? sessionUser["displayName"] : "",
        username: typeof sessionUser["username"] === "string" ? sessionUser["username"] : "",
        bio: "",
        website: "",
        github: "",
        twitter: "",
        location: "",
      });
    }
  }, [sessionUser]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(form);
      if (result.success) {
        toast({ title: "Profile updated", description: "Your changes have been saved." });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        toast({ title: "Avatar updated!" });
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to upload avatar", variant: "destructive" });
    }
    setAvatarUploading(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          {/* Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={typeof sessionUser?.["avatarUrl"] === "string" ? sessionUser["avatarUrl"] : ""} />
                  <AvatarFallback className="text-2xl bg-orange-500/10 text-orange-500">
                    {(
                      (typeof sessionUser?.["displayName"] === "string" ? sessionUser["displayName"] : "") ||
                      session?.user?.name ||
                      "U"
                    )[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                    <Button variant="outline" asChild disabled={avatarUploading}>
                      <span>
                        {avatarUploading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Change Avatar
                      </span>
                    </Button>
                  </label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG, or WebP. Max 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
                    placeholder="your-username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://your-site.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input
                    value={form.github}
                    onChange={(e) => setForm({ ...form, github: e.target.value })}
                    placeholder="your-github-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter</Label>
                  <Input
                    value={form.twitter}
                    onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                    placeholder="your-twitter-handle"
                  />
                </div>
              </div>

              <Button variant="gradient" onClick={handleSave} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button variant="gradient">
                <Key className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">Connect your GitHub account</p>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-muted-foreground">Connect your Google account</p>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { label: "New Stars", description: "When someone stars your agent" },
                { label: "New Reviews", description: "When someone reviews your agent" },
                { label: "New Followers", description: "When someone follows you" },
                { label: "New Forks", description: "When someone forks your agent" },
                { label: "Weekly Digest", description: "Weekly summary of your agents' performance" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
