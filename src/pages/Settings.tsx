import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Shield, UserX, Crown, Sparkles, Mail, User, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase.functions.invoke('delete-account');
      
      if (error) {
        console.error('Delete account error:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again or contact support.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });

      // Sign out and redirect to home page
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Error", 
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 dark:from-slate-900 dark:via-violet-950/30 dark:to-emerald-950/20">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Premium Header with Enhanced Glassmorphism */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-violet-200/50 dark:border-violet-800/30 sticky top-0 z-50 shadow-2xl shadow-violet-500/10">
        <div className="container mx-auto px-6 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-6"
          >
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 hover:bg-gradient-to-r hover:from-violet-100/50 hover:to-purple-100/50 dark:hover:from-violet-900/50 dark:hover:to-purple-900/50 transition-all duration-300 rounded-xl group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Back to Dashboard
            </Button>
            <div className="w-px h-8 bg-gradient-to-b from-violet-400/50 to-purple-400/50" />
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 dark:from-violet-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-sm text-violet-600/70 dark:text-violet-400/70 font-medium">Premium Account Management</p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-5xl relative">
        <div className="space-y-8">
          {/* Welcome Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-emerald-600 dark:from-violet-300 dark:via-purple-300 dark:to-emerald-300 bg-clip-text text-transparent">
              Account Center
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your premium account settings and preferences with ease
            </p>
          </motion.div>

          {/* Account Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/90 via-violet-50/80 to-cyan-50/70 dark:from-slate-900/90 dark:via-violet-950/60 dark:to-cyan-950/50 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-xl">
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500 rounded-2xl p-[2px] group-hover:p-[3px] transition-all duration-300">
                <div className="bg-gradient-to-br from-white/90 via-violet-50/80 to-cyan-50/70 dark:from-slate-900/90 dark:via-violet-950/60 dark:to-cyan-950/50 rounded-[14px] h-full w-full backdrop-blur-xl" />
              </div>
              
              {/* Floating Sparkles */}
              <div className="absolute top-4 right-6 w-2 h-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full animate-pulse opacity-60" />
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse delay-1000 opacity-50" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-violet-700 to-purple-600 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent">Account Information</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">Premium Member</span>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground ml-15">
                  Your premium account details and subscription status
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                {/* Email Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-100/50 via-purple-100/40 to-cyan-100/50 dark:from-violet-900/30 dark:via-purple-900/20 dark:to-cyan-900/30 border border-violet-200/50 dark:border-violet-700/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/email">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg group-hover/email:scale-110 transition-transform duration-200">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg bg-gradient-to-r from-violet-700 to-purple-600 dark:from-violet-300 dark:to-purple-300 bg-clip-text text-transparent">Email Address</h4>
                        <p className="text-muted-foreground font-medium">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-100/80 dark:bg-emerald-900/30 rounded-full border border-emerald-300/50 dark:border-emerald-600/30">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Verified</span>
                    </div>
                  </div>
                </div>
                
                {/* Account Type Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-100/50 via-yellow-100/40 to-orange-100/50 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/30 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group/account">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover/account:scale-110 transition-transform duration-200">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-300 dark:to-orange-300 bg-clip-text text-transparent">Account Type</h4>
                        <p className="text-muted-foreground font-medium">Premium Student</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 rounded-full border border-amber-300/50 dark:border-amber-600/30">
                      <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-50/90 via-rose-50/80 to-pink-50/70 dark:from-red-950/60 dark:via-rose-950/50 dark:to-pink-950/40 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-xl">
              {/* Animated Danger Border */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 rounded-2xl p-[2px] group-hover:p-[3px] transition-all duration-300">
                <div className="bg-gradient-to-br from-red-50/90 via-rose-50/80 to-pink-50/70 dark:from-red-950/60 dark:via-rose-950/50 dark:to-pink-950/40 rounded-[14px] h-full w-full backdrop-blur-xl" />
              </div>
              
              {/* Warning Sparkles */}
              <div className="absolute top-4 right-6 w-2 h-2 bg-gradient-to-r from-red-400 to-rose-400 rounded-full animate-pulse opacity-70" />
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse delay-1000 opacity-60" />
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 flex items-center justify-center shadow-xl shadow-red-500/30 animate-pulse">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">Danger Zone</span>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70 font-medium mt-1">Handle with extreme caution</p>
                  </div>
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground ml-15">
                  Irreversible actions that will permanently affect your account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <div className="p-6 rounded-2xl bg-gradient-to-r from-red-100/60 via-rose-100/50 to-pink-100/60 dark:from-red-900/40 dark:via-rose-900/30 dark:to-pink-900/40 border-2 border-red-200/60 dark:border-red-700/40 hover:border-red-300/80 dark:hover:border-red-600/60 transition-all duration-300 group/danger">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover/danger:scale-110 transition-transform duration-200">
                        <UserX className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-xl bg-gradient-to-r from-red-700 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                          Delete Account Permanently
                        </h4>
                        <p className="text-muted-foreground text-base max-w-md">
                          Once you delete your account, there is no going back. This will permanently delete all your data, progress, and premium subscription.
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Sparkles className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">This action cannot be undone</span>
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="lg"
                          className="ml-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 rounded-xl px-8 py-3 hover:scale-110 ring-2 ring-red-200/50 dark:ring-red-800/50"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          {isDeleting ? "Processing..." : "Delete Account"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-0 bg-gradient-to-br from-white via-red-50/30 to-rose-50/20 dark:from-slate-900 dark:via-red-950/30 dark:to-rose-950/20 backdrop-blur-2xl shadow-2xl max-w-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent flex items-center space-x-3">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                            <span>Are you absolutely sure?</span>
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-4 text-base">
                            <p className="text-lg font-medium">This will permanently delete your premium account and remove all of your data from our servers.</p>
                            
                            <div className="p-4 rounded-xl bg-red-100/50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                              <p className="font-semibold text-red-800 dark:text-red-200 mb-2">This includes all of the following:</p>
                              <ul className="list-disc list-inside space-y-2 text-red-700 dark:text-red-300">
                                <li>Your profile and account information</li>
                                <li>All practice progress and performance scores</li>
                                <li>Your revision notebook entries and study materials</li>
                                <li>Exam results, analytics, and predictions</li>
                                <li>Premium subscription and payment data</li>
                                <li>All streak data and achievements</li>
                              </ul>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border-2 border-red-400/50 dark:border-red-600/50">
                              <p className="text-red-700 dark:text-red-300 font-bold text-lg flex items-center space-x-2">
                                <Sparkles className="h-5 w-5" />
                                <span>This action cannot be undone under any circumstances.</span>
                              </p>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="space-x-4">
                          <AlertDialogCancel className="px-8 py-3 rounded-xl">Keep My Account</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 rounded-xl px-8 py-3 hover:scale-105"
                          >
                            {isDeleting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="flex items-center space-x-2"
                              >
                                <Sparkles className="h-4 w-4" />
                                <span>Deleting...</span>
                              </motion.div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <Trash2 className="h-4 w-4" />
                                <span>Yes, Delete Forever</span>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;