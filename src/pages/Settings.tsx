import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2, AlertTriangle, ArrowLeft, User, Sparkles, Crown } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-accent/10 to-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl relative z-10">
        {/* Premium Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 backdrop-blur-sm border border-white/10">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent animate-fade-in">
                Settings
              </h1>
              <Crown className="h-8 w-8 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-muted-foreground bg-gradient-to-r from-muted-foreground to-muted-foreground/60 bg-clip-text">
              Manage your premium account experience
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Premium Account Information */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/80 via-card/70 to-card/60 backdrop-blur-xl relative overflow-hidden group hover:shadow-primary/20 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 backdrop-blur-sm">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Account Information
                </span>
                <div className="ml-auto">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 backdrop-blur-sm">
                    <span className="text-xs font-medium text-primary">Premium</span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Your premium account details and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground/90">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 backdrop-blur-sm text-foreground/90 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="created" className="text-sm font-medium text-foreground/90">Member Since</Label>
                  <Input
                    id="created"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ""}
                    disabled
                    className="bg-gradient-to-r from-muted/50 to-muted/30 border-border/50 backdrop-blur-sm text-foreground/90 cursor-not-allowed"
                  />
                </div>
              </div>
              
              {/* Premium Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 backdrop-blur-sm border border-primary/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">∞</div>
                  <div className="text-xs text-muted-foreground mt-1">Unlimited Access</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">★</div>
                  <div className="text-xs text-muted-foreground mt-1">Premium Features</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20">
                  <div className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">🏆</div>
                  <div className="text-xs text-muted-foreground mt-1">Elite Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Danger Zone */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-destructive/5 via-card/60 to-destructive/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-red-500/5"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-destructive/20 to-transparent rounded-bl-full"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-gradient-to-r from-destructive/20 to-red-500/20 backdrop-blur-sm animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <span className="bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
                  Danger Zone
                </span>
                <div className="ml-auto">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-destructive/10 to-red-500/10 border border-destructive/30 backdrop-blur-sm">
                    <span className="text-xs font-medium text-destructive">Caution</span>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-muted-foreground/80">
                Irreversible and destructive actions - proceed with extreme caution
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="p-8 border border-destructive/30 rounded-2xl bg-gradient-to-br from-destructive/5 to-red-500/5 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-red-500/5 opacity-50"></div>
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5 text-destructive" />
                      <h4 className="font-bold text-lg bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
                        Delete Account
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                      Permanently delete your premium account and all associated data. This action cannot be undone and will result in immediate loss of all progress, achievements, and premium benefits.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-destructive/80 bg-destructive/10 p-2 rounded-lg">
                      <AlertTriangle className="h-3 w-3" />
                      <span>This will cancel your premium subscription immediately</span>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="ml-6 bg-gradient-to-r from-destructive to-red-500 hover:from-destructive/90 hover:to-red-500/90 shadow-lg hover:shadow-destructive/25 transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md border-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-red-500/5"></div>
                      <AlertDialogHeader className="relative z-10">
                        <AlertDialogTitle className="flex items-center gap-3 text-xl">
                          <div className="p-2 rounded-xl bg-gradient-to-r from-destructive/20 to-red-500/20 backdrop-blur-sm">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          </div>
                          <span className="bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
                            Delete Premium Account
                          </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4 relative z-10">
                          <p className="text-muted-foreground">This will permanently delete your premium account and all associated data including:</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                              <div className="font-medium text-destructive mb-1">Study Data</div>
                              <div className="text-xs text-muted-foreground">Progress, sessions, analytics</div>
                            </div>
                            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                              <div className="font-medium text-destructive mb-1">Content</div>
                              <div className="text-xs text-muted-foreground">Notebooks, achievements</div>
                            </div>
                            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                              <div className="font-medium text-destructive mb-1">Premium Benefits</div>
                              <div className="text-xs text-muted-foreground">Subscription, features</div>
                            </div>
                            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                              <div className="font-medium text-destructive mb-1">Account</div>
                              <div className="text-xs text-muted-foreground">Profile, preferences</div>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-r from-destructive/10 to-red-500/10 border border-destructive/30">
                            <p className="font-bold text-destructive text-center">⚠️ This action cannot be undone ⚠️</p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-4 relative z-10">
                        <div className="space-y-3">
                          <Label htmlFor="confirm" className="text-sm font-medium flex items-center gap-2">
                            Type <span className="font-mono bg-destructive/10 px-2 py-1 rounded text-destructive border border-destructive/30">DELETE</span> to confirm:
                          </Label>
                          <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="font-mono bg-gradient-to-r from-muted/50 to-muted/30 border-destructive/30 focus:border-destructive"
                          />
                        </div>
                      </div>
                      
                      <AlertDialogFooter className="relative z-10">
                        <AlertDialogCancel 
                          onClick={() => setConfirmText("")}
                          className="bg-gradient-to-r from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70"
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={confirmText !== "DELETE" || isDeleting}
                          className="bg-gradient-to-r from-destructive to-red-500 hover:from-destructive/90 hover:to-red-500/90 shadow-lg"
                        >
                          {isDeleting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Deleting Account...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              Delete Premium Account
                            </div>
                          )}
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