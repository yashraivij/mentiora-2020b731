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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="hover:bg-white/10 transition-colors text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-500/25">
                  <SettingsIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Settings</h1>
                  <p className="text-sm text-gray-400">Account management</p>
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
      <div className="container mx-auto px-6 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {/* Danger Zone - Premium Style */}
          <Card className="w-full border-2 border-red-400/60 bg-gradient-to-br from-red-500/20 via-pink-500/15 to-orange-500/10 backdrop-blur-lg shadow-2xl shadow-red-500/30 ring-2 ring-red-400/40">
            <CardHeader className="pb-6 bg-gradient-to-r from-red-400/30 via-pink-400/20 to-orange-400/20 rounded-t-lg border-b border-red-400/30">
              <CardTitle className="flex items-center space-x-3 text-white text-2xl">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/50 border border-red-300/50">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-red-200 to-pink-200 bg-clip-text text-transparent">Danger Zone</span>
              </CardTitle>
              <CardDescription className="text-gray-200 text-lg font-medium">
                Irreversible actions that will permanently affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="p-8 border-2 border-red-400/50 rounded-2xl bg-gradient-to-br from-red-600/30 via-pink-600/20 to-orange-600/15 backdrop-blur-sm shadow-xl shadow-red-500/20">
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-white">Delete Account</h4>
                    <p className="text-gray-100 leading-relaxed max-w-md text-lg">
                      Permanently delete your account and all associated data. This action cannot be undone and will remove all your progress forever.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="lg"
                        className="ml-6 shrink-0 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-red-500/40 border-2 border-red-300/60 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-6 w-6 mr-3" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-lg bg-gradient-to-br from-slate-800 via-red-900 to-pink-900 border-2 border-red-400/60 text-white shadow-2xl shadow-red-500/30">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center space-x-3 text-white text-2xl">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                            <AlertTriangle className="h-7 w-7 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-red-200 to-pink-200 bg-clip-text text-transparent">Delete Account</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left space-y-4 text-gray-200">
                          <p className="text-lg">Are you absolutely sure you want to delete your account?</p>
                          <div className="bg-gradient-to-r from-red-800/40 to-pink-800/30 p-6 rounded-xl border-2 border-red-400/30 shadow-lg">
                            <p className="font-semibold text-red-200 mb-3 text-lg">This will permanently delete:</p>
                            <ul className="list-disc list-inside space-y-2 text-base ml-2 text-gray-200">
                              <li>All your progress and study data</li>
                              <li>Notebook entries and notes</li>
                              <li>Exam results and analytics</li>
                              <li>Account preferences and settings</li>
                            </ul>
                          </div>
                          <p className="font-bold text-red-300 text-center text-xl">This action cannot be undone.</p>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="pt-6 space-x-4">
                        <AlertDialogCancel className="bg-slate-600 text-white border-2 border-slate-400 hover:bg-slate-700 px-6 py-3 rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold shadow-2xl shadow-red-500/40 px-6 py-3 rounded-xl border-2 border-red-300/60"
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
