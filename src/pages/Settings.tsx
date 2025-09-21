import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Trash2, Settings as SettingsIcon, Crown, Sparkles, Shield, Zap, CreditCard } from "lucide-react";
import { openManageBilling } from "@/lib/manageBilling";

const Settings = () => {
  const { user, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      console.error('No user ID found');
      return;
    }

    setIsDeleting(true);
    try {
      console.log('Attempting to delete account for user:', user.id);
      
      // Call the delete user account function
      const { data, error } = await supabase.rpc('delete_user_account', {
        user_id_to_delete: user.id
      });

      console.log('Delete account response:', { data, error });

      if (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: `Failed to delete account: ${error.message}`,
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
      console.error('Error deleting account (catch block):', error);
      toast({
        title: "Error",
        description: `Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Profile Settings
          </h2>
        </div>

        {/* Account Information Card */}
        <div className="mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">
                  Account Information
                </h3>
                <p className="text-muted-foreground">Your account details and status</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted border border-border">
                <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                <p className="text-lg font-bold text-foreground">{user?.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted border border-border">
                <p className="text-sm font-medium text-muted-foreground mb-1">Account Type</p>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <p className="text-lg font-bold text-foreground">
                    {isPremium ? "Premium Account" : "Free Account"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Management Card - Only for Premium Users */}
        {isPremium && (
          <div className="mb-8">
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    Billing Management
                  </h3>
                  <p className="text-card-foreground/80">Manage your subscription and billing</p>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-black flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Premium Subscription
                    </h4>
                    <p className="text-black/90 max-w-lg">
                      Access your Stripe billing portal to manage your subscription, update payment methods, 
                      view invoices, and modify your plan.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        Secure Portal
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-card-foreground/80 border border-border">
                        Full Control
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={openManageBilling}
                    className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-2xl"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-muted-foreground/10 rounded-2xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-card-foreground">Danger Zone</h3>
              <p className="text-card-foreground/80">Permanent actions that cannot be undone</p>
            </div>
          </div>
          <div className="p-6 rounded-lg bg-card border border-border shadow-sm">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-card-foreground">Delete Account</h4>
                <p className="text-card-foreground/90 max-w-lg">
                  Permanently delete your account and all associated data. This action cannot be undone. 
                  All your progress, notes, and achievements will be lost forever.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/30">
                    Immediate Effect
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-card-foreground/80 border border-border">
                    No Recovery
                  </span>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="ml-4 border-destructive/40 hover:bg-destructive/10 text-destructive font-bold py-3 px-8 rounded-2xl"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl text-foreground flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-muted-foreground" />
                      Permanently Delete Account?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground">
                      This action will permanently delete your account and all associated data including:
                      <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                        <li>All study progress and achievements</li>
                        <li>Generated notes and flashcards</li>
                        <li>Practice history and performance data</li>
                        <li>Subscription and billing information</li>
                      </ul>
                      <p className="mt-4 font-bold text-muted-foreground">
                        This cannot be undone. Are you absolutely sure?
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-muted hover:bg-muted/80 text-foreground">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-muted-foreground/20 hover:bg-muted-foreground/30 text-foreground border border-muted-foreground/30"
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
        </div>
      </div>
    </div>
  );
};

export default Settings;