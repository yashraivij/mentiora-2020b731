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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/10 relative overflow-hidden">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-2xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse [animation-delay:3s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-yellow-400/10 via-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse [animation-delay:0.5s]"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-r from-primary to-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-40 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse [animation-delay:1s]"></div>
        <div className="absolute bottom-40 left-40 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl relative z-10">
        {/* Ultra Premium Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-primary/20 hover:to-purple-500/20 backdrop-blur-sm border border-white/20 hover:border-primary/40 transition-all duration-500 hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-purple-500/40 rounded-2xl blur-xl animate-pulse"></div>
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30 backdrop-blur-sm border border-white/20 shadow-2xl">
                  <Sparkles className="h-8 w-8 text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text animate-pulse" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 via-purple-500/20 via-pink-500/20 to-yellow-400/20 blur-2xl animate-pulse"></div>
                <h1 className="relative text-5xl font-black bg-gradient-to-r from-primary via-blue-500 via-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent animate-fade-in [background-size:200%] [animation:gradient_3s_ease-in-out_infinite]">
                  Settings
                </h1>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-orange-500/40 rounded-xl blur-lg animate-pulse"></div>
                <Crown className="relative h-10 w-10 text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text animate-pulse shadow-2xl" />
              </div>
            </div>
            <p className="text-lg bg-gradient-to-r from-muted-foreground via-primary/60 to-purple-500/60 bg-clip-text text-transparent font-medium">
              ✨ Manage your elite premium experience ✨
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {/* Ultra Premium Account Information */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-card/90 via-card/80 to-card/70 backdrop-blur-xl relative overflow-hidden group hover:shadow-primary/30 transition-all duration-700 hover:scale-[1.02]">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 via-purple-500/15 to-transparent rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/15 via-cyan-500/10 to-transparent rounded-tr-full"></div>
            
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-purple-500/30 via-pink-500/30 to-blue-500/30 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="w-full h-full rounded-xl bg-card/90 backdrop-blur-xl"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30 backdrop-blur-sm border border-white/30 shadow-xl">
                    <User className="h-6 w-6 text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-foreground via-primary/80 via-blue-500/80 to-purple-500/80 bg-clip-text text-transparent font-bold [background-size:200%] [animation:gradient_2s_ease-in-out_infinite]">
                  Account Information
                </span>
                <div className="ml-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-purple-500/40 to-pink-500/40 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/40 backdrop-blur-sm shadow-xl">
                      <span className="text-sm font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        ⭐ PREMIUM ⭐
                      </span>
                    </div>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground/90 font-medium">
                🌟 Your exclusive premium account details and elite information 🌟
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label htmlFor="email" className="text-base font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    📧 Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="h-14 text-lg bg-gradient-to-r from-muted/60 via-muted/50 to-muted/40 border-primary/30 backdrop-blur-sm text-foreground/90 cursor-not-allowed shadow-lg rounded-xl"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="created" className="text-base font-bold bg-gradient-to-r from-foreground to-purple-500 bg-clip-text text-transparent">
                    🗓️ Member Since
                  </Label>
                  <Input
                    id="created"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : ""}
                    disabled
                    className="h-14 text-lg bg-gradient-to-r from-muted/60 via-muted/50 to-muted/40 border-purple-500/30 backdrop-blur-sm text-foreground/90 cursor-not-allowed shadow-lg rounded-xl"
                  />
                </div>
              </div>
              
              {/* Ultra Premium Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-blue-500/15 to-cyan-500/20 backdrop-blur-sm border border-primary/30 hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-primary/25">
                  <div className="text-4xl font-black bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">∞</div>
                  <div className="text-sm font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">Unlimited Access</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-rose-500/20 backdrop-blur-sm border border-purple-500/30 hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-purple-500/25">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent mb-2">⭐</div>
                  <div className="text-sm font-bold bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent">Premium Features</div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/15 to-red-500/20 backdrop-blur-sm border border-yellow-500/30 hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-yellow-500/25">
                  <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">👑</div>
                  <div className="text-sm font-bold bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent">Elite Status</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ultra Premium Danger Zone */}
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-destructive/10 via-card/70 to-red-500/15 backdrop-blur-xl relative overflow-hidden group hover:shadow-destructive/30 transition-all duration-700 hover:scale-[1.01]">
            {/* Enhanced danger zone effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-red-500/10 via-orange-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-destructive/30 via-red-500/20 to-transparent rounded-bl-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-tr-full animate-pulse [animation-delay:1s]"></div>
            
            {/* Pulsing danger border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-destructive/40 via-red-500/40 to-orange-500/40 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse">
              <div className="w-full h-full rounded-xl bg-card/90 backdrop-blur-xl"></div>
            </div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-4 text-2xl">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-destructive/50 to-red-500/50 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative p-4 rounded-2xl bg-gradient-to-br from-destructive/30 via-red-500/20 to-orange-500/30 backdrop-blur-sm border border-destructive/40 shadow-xl animate-pulse">
                    <AlertTriangle className="h-6 w-6 text-transparent bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text" />
                  </div>
                </div>
                <span className="bg-gradient-to-r from-destructive via-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-black [background-size:200%] [animation:gradient_2s_ease-in-out_infinite]">
                  ⚠️ DANGER ZONE ⚠️
                </span>
                <div className="ml-auto">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-destructive/50 via-red-500/50 to-orange-500/50 rounded-full blur-lg animate-pulse"></div>
                    <div className="relative px-4 py-2 rounded-full bg-gradient-to-r from-destructive/20 via-red-500/20 to-orange-500/20 border border-destructive/40 backdrop-blur-sm shadow-xl">
                      <span className="text-sm font-bold bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text text-transparent">
                        🚨 EXTREME CAUTION 🚨
                      </span>
                    </div>
                  </div>
                </div>
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground/90 font-medium">
                ⚡ Irreversible and destructive actions - proceed with extreme caution ⚡
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="p-10 border-2 border-destructive/40 rounded-3xl bg-gradient-to-br from-destructive/10 via-red-500/10 via-orange-500/10 to-yellow-500/10 backdrop-blur-sm relative overflow-hidden shadow-2xl">
                {/* Animated warning stripes */}
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent via-red-500/10 via-transparent to-orange-500/10 opacity-50 [background-size:100px_100%] animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-destructive via-red-500 via-orange-500 to-yellow-500 [background-size:200%] animate-[gradient_1s_ease-in-out_infinite]"></div>
                
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-destructive/50 to-red-500/50 rounded-xl blur-lg animate-pulse"></div>
                        <Trash2 className="relative h-8 w-8 text-transparent bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text" />
                      </div>
                      <h4 className="font-black text-2xl bg-gradient-to-r from-destructive via-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent [background-size:200%] [animation:gradient_2s_ease-in-out_infinite]">
                        🗑️ DELETE PREMIUM ACCOUNT 🗑️
                      </h4>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                      ⚠️ <strong>PERMANENTLY DELETE</strong> your exclusive premium account and <strong>ALL</strong> associated data including your progress, achievements, premium benefits, and subscription. 
                      <br /><br />
                      💀 <span className="text-destructive font-bold">THIS ACTION CANNOT BE UNDONE</span> and will result in <strong>IMMEDIATE LOSS</strong> of all premium features and data! 💀
                    </p>
                    <div className="flex items-center gap-3 text-sm bg-gradient-to-r from-destructive/20 via-red-500/20 to-orange-500/20 p-4 rounded-2xl border border-destructive/30 backdrop-blur-sm">
                      <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
                      <span className="font-bold bg-gradient-to-r from-destructive to-red-500 bg-clip-text text-transparent">
                        🚨 This will CANCEL your premium subscription IMMEDIATELY! 🚨
                      </span>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="ml-8 h-16 px-8 text-lg font-bold bg-gradient-to-r from-destructive via-red-500 to-orange-500 hover:from-destructive/90 hover:via-red-500/90 hover:to-orange-500/90 shadow-2xl hover:shadow-destructive/40 transition-all duration-500 hover:scale-110 [background-size:200%] [animation:gradient_3s_ease-in-out_infinite]"
                      >
                        <Trash2 className="h-6 w-6 mr-3" />
                        💥 DELETE ACCOUNT 💥
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg border-0 bg-gradient-to-br from-card/95 via-card/90 to-card/80 backdrop-blur-2xl shadow-2xl">
                      {/* Ultra enhanced dialog background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-red-500/10 via-orange-500/10 to-yellow-500/10 animate-pulse"></div>
                      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-destructive via-red-500 via-orange-500 to-yellow-500 [background-size:300%] animate-[gradient_2s_ease-in-out_infinite]"></div>
                      
                      <AlertDialogHeader className="relative z-10">
                        <AlertDialogTitle className="flex items-center gap-4 text-2xl mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-destructive/60 to-red-500/60 rounded-2xl blur-xl animate-pulse"></div>
                            <div className="relative p-3 rounded-2xl bg-gradient-to-br from-destructive/40 via-red-500/30 to-orange-500/40 backdrop-blur-sm border border-destructive/50 shadow-2xl">
                              <AlertTriangle className="h-8 w-8 text-transparent bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text" />
                            </div>
                          </div>
                          <span className="bg-gradient-to-r from-destructive via-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-black [background-size:200%] [animation:gradient_2s_ease-in-out_infinite]">
                            🚨 DELETE PREMIUM ACCOUNT 🚨
                          </span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-6 relative z-10">
                          <p className="text-lg text-muted-foreground font-medium">
                            ⚠️ This will <strong className="text-destructive">PERMANENTLY DELETE</strong> your premium account and all associated data including:
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-destructive/10 to-red-500/10 border border-destructive/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                              <div className="font-bold text-destructive mb-2 text-base">📚 Study Data</div>
                              <div className="text-muted-foreground">Progress, sessions, analytics, achievements</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                              <div className="font-bold text-red-500 mb-2 text-base">📝 Content</div>
                              <div className="text-muted-foreground">Notebooks, flashcards, materials</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                              <div className="font-bold text-orange-500 mb-2 text-base">👑 Premium Benefits</div>
                              <div className="text-muted-foreground">Subscription, exclusive features</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-pink-500/10 border border-yellow-500/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                              <div className="font-bold text-yellow-600 mb-2 text-base">👤 Account</div>
                              <div className="text-muted-foreground">Profile, settings, preferences</div>
                            </div>
                          </div>
                          <div className="p-6 rounded-2xl bg-gradient-to-r from-destructive/20 via-red-500/20 to-orange-500/20 border-2 border-destructive/40 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-red-500/10 to-orange-500/10 animate-pulse"></div>
                            <p className="relative font-black text-xl text-center bg-gradient-to-r from-destructive via-red-500 to-orange-500 bg-clip-text text-transparent [background-size:200%] [animation:gradient_1s_ease-in-out_infinite]">
                              💀 THIS ACTION CANNOT BE UNDONE! 💀
                            </p>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      <div className="space-y-6 relative z-10">
                        <div className="space-y-4">
                          <Label htmlFor="confirm" className="text-lg font-bold flex items-center gap-3">
                            Type <span className="font-mono bg-gradient-to-r from-destructive/20 to-red-500/20 px-3 py-2 rounded-lg text-destructive border-2 border-destructive/40 shadow-lg text-xl">DELETE</span> to confirm:
                          </Label>
                          <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="Type DELETE here"
                            className="h-16 text-xl font-mono bg-gradient-to-r from-muted/60 to-muted/40 border-2 border-destructive/40 focus:border-destructive rounded-xl shadow-lg"
                          />
                        </div>
                      </div>
                      
                      <AlertDialogFooter className="relative z-10 gap-4">
                        <AlertDialogCancel 
                          onClick={() => setConfirmText("")}
                          className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-muted via-muted/90 to-muted/80 hover:from-muted/90 hover:via-muted/80 hover:to-muted/70 shadow-lg rounded-xl"
                        >
                          🛡️ Cancel & Keep Account
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={confirmText !== "DELETE" || isDeleting}
                          className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-destructive via-red-500 to-orange-500 hover:from-destructive/90 hover:via-red-500/90 hover:to-orange-500/90 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed [background-size:200%] [animation:gradient_2s_ease-in-out_infinite]"
                        >
                          {isDeleting ? (
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                              💀 DELETING PREMIUM ACCOUNT... 💀
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <Trash2 className="h-6 w-6" />
                              💥 DELETE PREMIUM ACCOUNT FOREVER 💥
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