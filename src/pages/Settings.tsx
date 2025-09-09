import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, AlertTriangle, ArrowLeft, Shield, User, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm");
      return;
    }

    setIsDeleting(true);
    
    try {
      toast.loading("Deleting account data...");

      const userId = user?.id;
      
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Delete user data from key tables individually to avoid TypeScript issues
      const deletionPromises = [
        supabase.from('profiles').delete().eq('id', userId),
        supabase.from('user_subjects').delete().eq('user_id', userId),
        supabase.from('user_goals').delete().eq('user_id', userId),
        supabase.from('user_activities').delete().eq('user_id', userId),
        supabase.from('user_achievements').delete().eq('user_id', userId),
        supabase.from('daily_usage').delete().eq('user_id', userId),
        supabase.from('study_sessions').delete().eq('user_id', userId),
        supabase.from('subject_performance').delete().eq('user_id', userId),
        supabase.from('session_analytics').delete().eq('user_id', userId),
        supabase.from('performance_summaries').delete().eq('user_id', userId),
        supabase.from('quizzes').delete().eq('user_id', userId),
        supabase.from('flashcards').delete().eq('user_id', userId),
        supabase.from('materials').delete().eq('user_id', userId),
        supabase.from('notebook_entries').delete().eq('user_id', userId),
        supabase.from('exams').delete().eq('user_id', userId),
        supabase.from('predicted_exam_completions').delete().eq('user_id', userId),
        supabase.from('daily_topic_mastery').delete().eq('user_id', userId),
        supabase.from('public_profiles').delete().eq('user_id', userId),
        supabase.from('documents').delete().eq('user_id', userId),
        supabase.from('chat_conversations').delete().eq('user_id', userId),
        supabase.from('streak_celebrations_viewed').delete().eq('user_id', userId)
      ];

      // Execute all deletions
      await Promise.allSettled(deletionPromises);

      toast.success("All account data has been deleted. You will now be signed out.");
      
      // Sign out the user after a brief delay
      setTimeout(async () => {
        await logout();
        navigate("/");
      }, 2000);
      
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error("Unable to delete all account data. Please contact support for complete account deletion.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Information */}
          <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="created">Member Since</Label>
                  <Input
                    id="created"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy settings and security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
                <div>
                  <h4 className="font-medium">Data Export</h4>
                  <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-background/50">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive updates about your progress and achievements</p>
                </div>
                <Button variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="ml-4">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          Delete Account
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                          <p>This will permanently delete your account and all associated data including:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Your profile and progress</li>
                            <li>All study sessions and analytics</li>
                            <li>Notebook entries and achievements</li>
                            <li>Quiz results and performance data</li>
                          </ul>
                          <p className="font-medium text-destructive">This action cannot be undone.</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="confirm" className="text-sm font-medium">
                            Type <span className="font-mono bg-muted px-1 rounded">DELETE</span> to confirm:
                          </Label>
                          <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="font-mono"
                          />
                        </div>
                      </div>
                      
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmText("")}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={confirmText !== "DELETE" || isDeleting}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;