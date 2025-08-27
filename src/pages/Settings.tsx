import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Settings as SettingsIcon, Trash2, AlertTriangle, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine which dashboard to return to
  const getReturnPath = () => {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo');
    
    // If returnTo is specified in URL params, use that
    if (returnTo) {
      return returnTo;
    }
    
    // Otherwise, check localStorage for last dashboard preference
    const lastDashboard = localStorage.getItem('lastDashboard');
    return lastDashboard === 'premium' ? '/premium-dashboard' : '/dashboard';
  };

  const handleBack = () => {
    navigate(getReturnPath());
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsDeleting(true);
    
    try {
      // Call the Supabase RPC function to delete all user data
      const { error } = await (supabase.rpc as any)('delete_user_account', {
        user_id_to_delete: user.id
      });

      if (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again or contact support.",
          variant: "destructive",
        });
        return;
      }

      // Clear all localStorage data
      Object.keys(localStorage).forEach(key => {
        if (key.includes(user.id) || key.startsWith('mentiora_')) {
          localStorage.removeItem(key);
        }
      });

      toast({
        title: "Account Deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });

      // Log out and redirect
      await logout();
      navigate('/');
      
    } catch (error) {
      console.error('Error deleting account:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="hover:bg-accent/80 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Settings</h1>
                  <p className="text-sm text-muted-foreground">Manage your account preferences</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <ColorThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6"
        >
          {/* Account Information */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Account Information</span>
              </CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-sm text-foreground">{user?.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <span className="text-sm text-foreground">
                      {getReturnPath().includes('premium') ? 'Premium' : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-secondary" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize your visual experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Theme</h4>
                  <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                </div>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-foreground">Color Theme</h4>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <ColorThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20 bg-destructive/5 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-4 shrink-0"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          <span>Delete Account</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left space-y-2">
                          <p>Are you absolutely sure you want to delete your account?</p>
                          <p className="font-medium">This will permanently delete:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                            <li>All your progress and study data</li>
                            <li>Notebook entries and notes</li>
                            <li>Exam results and analytics</li>
                            <li>Account preferences and settings</li>
                          </ul>
                          <p className="font-medium text-destructive">This action cannot be undone.</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Yes, delete my account"}
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
