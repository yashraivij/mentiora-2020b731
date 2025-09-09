import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Trash2, Settings as SettingsIcon, Crown, Sparkles, Shield, Zap } from "lucide-react";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      // Call the delete user account function
      const { error } = await supabase.rpc('delete_user_account', {
        user_id_to_delete: user.id
      });

      if (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Clear local storage
      localStorage.clear();
      
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950 dark:via-purple-950 dark:to-pink-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-cyan-500/30 via-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-20 right-1/4 w-60 h-60 bg-gradient-to-br from-orange-500/25 via-red-500/25 to-pink-500/25 rounded-full blur-2xl animate-pulse delay-300" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-gradient-to-tr from-yellow-500/20 via-amber-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 text-violet-500/40"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <SettingsIcon className="w-8 h-8 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32 text-amber-500/50"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Crown className="w-6 h-6 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/4 text-pink-500/40"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Sparkles className="w-7 h-7 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-20 text-emerald-500/40"
        animate={{ x: [0, 10, 0], rotate: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Shield className="w-6 h-6 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 right-1/3 text-cyan-500/40"
        animate={{ x: [0, -15, 0], y: [0, 5, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      >
        <Zap className="w-7 h-7 drop-shadow-lg" />
      </motion.div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-500/30 backdrop-blur-sm border border-violet-300/50 shadow-xl shadow-violet-500/20">
              <SettingsIcon className="w-8 h-8 text-violet-100 drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
                Settings
              </h1>
              <p className="text-violet-700/80 dark:text-violet-300/80 mt-1 font-medium">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Account Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50/80 via-cyan-50/60 to-teal-50/80 dark:from-blue-950/40 dark:via-cyan-950/30 dark:to-teal-950/40 backdrop-blur-sm border-cyan-200/50 dark:border-cyan-700/30 shadow-2xl shadow-cyan-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 shadow-lg">
                  <User className="w-5 h-5 text-cyan-100 drop-shadow-sm" />
                </div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-cyan-700/70 dark:text-cyan-300/70">Your account details and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-100/80 to-teal-100/60 dark:from-emerald-900/40 dark:to-teal-900/30 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/30 shadow-lg">
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">{user?.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-100/80 to-pink-100/60 dark:from-purple-900/40 dark:to-pink-900/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/30 shadow-lg">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Account Type</p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 drop-shadow-sm" />
                    <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">Premium Account</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50/80 via-orange-50/60 to-pink-50/80 dark:from-red-950/40 dark:via-orange-950/30 dark:to-pink-950/40 backdrop-blur-sm border-red-200/50 dark:border-red-700/30 shadow-2xl shadow-red-500/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500/30 to-orange-500/30 shadow-lg">
                  <Trash2 className="w-5 h-5 text-red-100 drop-shadow-sm" />
                </div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Danger Zone</CardTitle>
                  <CardDescription className="text-red-700/70 dark:text-red-300/70">Permanent actions that cannot be undone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-gradient-to-br from-yellow-50/80 to-orange-50/60 dark:from-yellow-950/40 dark:to-orange-950/30 backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-700/30 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-red-700 to-orange-700 dark:from-red-300 dark:to-orange-300 bg-clip-text text-transparent">Delete Account</h3>
                    <p className="text-sm text-red-700/80 dark:text-red-300/80 max-w-lg">
                      Permanently delete your account and all associated data. This action cannot be undone. 
                      All your progress, notes, and achievements will be lost forever.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-300/30">
                        <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Immediate Effect</span>
                      </div>
                      <div className="w-1 h-1 bg-red-400 rounded-full" />
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-300/30">
                        <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">No Recovery</span>
                      </div>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="ml-4 bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 hover:from-red-700 hover:via-orange-700 hover:to-pink-700 shadow-xl shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gradient-to-br from-red-50/95 via-orange-50/90 to-pink-50/95 dark:from-red-950/95 dark:via-orange-950/90 dark:to-pink-950/95 backdrop-blur-lg border-red-200/50 dark:border-red-700/50 shadow-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                          Permanently Delete Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-red-700/80 dark:text-red-300/80">
                          This action will permanently delete your account and all associated data including:
                          <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                            <li>All study progress and achievements</li>
                            <li>Generated notes and flashcards</li>
                            <li>Practice history and performance data</li>
                            <li>Subscription and billing information</li>
                          </ul>
                          <p className="mt-4 font-semibold bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                            This cannot be undone. Are you absolutely sure?
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-gray-100/80 dark:hover:bg-gray-800/80 border-gray-300/50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-600 hover:from-red-700 hover:via-orange-700 hover:to-pink-700 shadow-lg"
                        >
                          {isDeleting ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Deleting...
                            </div>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Yes, Delete Forever
                            </>
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
  );
};

export default Settings;