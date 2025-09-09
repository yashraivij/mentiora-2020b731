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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 via-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 via-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        className="absolute top-20 left-20 text-primary/20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <SettingsIcon className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32 text-accent/20"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Crown className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/4 text-secondary/20"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Sparkles className="w-7 h-7" />
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
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-border/50">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences</p>
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
          <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Account Information
                  </CardTitle>
                  <CardDescription>Your account details and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-foreground">{user?.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm border border-border/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Account Type</p>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <p className="text-lg font-semibold text-foreground">Premium Account</p>
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
          <Card className="bg-gradient-to-br from-destructive/5 to-destructive/10 backdrop-blur-sm border-destructive/20 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-destructive/20 to-destructive/30">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Permanent actions that cannot be undone</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-lg bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-sm border border-destructive/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Delete Account</h3>
                    <p className="text-sm text-muted-foreground max-w-lg">
                      Permanently delete your account and all associated data. This action cannot be undone. 
                      All your progress, notes, and achievements will be lost forever.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center gap-1 text-destructive/80">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-medium">Immediate Effect</span>
                      </div>
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <div className="flex items-center gap-1 text-destructive/80">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-medium">No Recovery</span>
                      </div>
                    </div>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        className="ml-4 bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 shadow-lg"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm border-border/50">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-destructive flex items-center gap-2">
                          <Trash2 className="w-5 h-5" />
                          Permanently Delete Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-base">
                          This action will permanently delete your account and all associated data including:
                          <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                            <li>All study progress and achievements</li>
                            <li>Generated notes and flashcards</li>
                            <li>Practice history and performance data</li>
                            <li>Subscription and billing information</li>
                          </ul>
                          <p className="mt-4 font-semibold text-destructive">
                            This cannot be undone. Are you absolutely sure?
                          </p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-muted/50">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70"
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