import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Settings as SettingsIcon, Trash2, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const fromPath = searchParams.get('from') || '/dashboard';

  const handleGoBack = () => {
    navigate(fromPath);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
      
      logout();
      navigate('/');
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
    <div className="min-h-screen" style={{ background: 'var(--gradient-background)' }}>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGoBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{ background: 'var(--gradient-primary)' }}>
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Premium Danger Zone Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden border-2 border-red-500/50 shadow-2xl bg-gradient-to-br from-red-600 to-red-800">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-red-500/90 to-red-700/95"
            />
            <div 
              className="absolute inset-0 border-2 border-red-400/30 rounded-lg"
            />
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-destructive/20">
                  <Shield className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Danger Zone</CardTitle>
                  <CardDescription className="text-red-100">
                    Irreversible and destructive actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="p-6 rounded-lg bg-red-800/80 border border-red-400/40 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                    <p className="text-sm text-red-100 max-w-md">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="ml-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="border-destructive/20">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers, including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All study progress and analytics</li>
                            <li>Notebook entries and materials</li>
                            <li>Exam results and performance data</li>
                            <li>Account preferences and settings</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90"
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