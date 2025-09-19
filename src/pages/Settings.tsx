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
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-lg bg-blue-500 shadow-sm">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Account Information Card */}
        <div className="mb-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">
                    Account Information
                  </CardTitle>
                  <CardDescription className="text-gray-600">Your account details and status</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-sm font-medium text-gray-700 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 border">
                  <p className="text-sm font-medium text-gray-700 mb-1">Account Type</p>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-blue-600" />
                    <p className="text-lg font-semibold text-gray-900">
                      {isPremium ? "Premium Account" : "Free Account"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing Management Card - Only for Premium Users */}
        {isPremium && (
          <div className="mb-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Billing Management
                    </CardTitle>
                    <CardDescription className="text-gray-600">Manage your subscription and billing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-lg bg-green-50 border">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Crown className="w-5 h-5 text-green-600" />
                        Premium Subscription
                      </h3>
                      <p className="text-sm text-gray-600 max-w-lg">
                        Access your Stripe billing portal to manage your subscription, update payment methods, 
                        view invoices, and modify your plan.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 border">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Secure Portal</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 border">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-700">Full Control</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={openManageBilling}
                      className="ml-4 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Danger Zone */}
        <Card className="border-0 shadow-md border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900">Danger Zone</CardTitle>
                <CardDescription className="text-gray-600">Permanent actions that cannot be undone</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-600 max-w-lg">
                    Permanently delete your account and all associated data. This action cannot be undone. 
                    All your progress, notes, and achievements will be lost forever.
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 border border-orange-300">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-medium text-orange-700">Immediate Effect</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 border border-red-300">
                      <Shield className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-medium text-red-700">No Recovery</span>
                    </div>
                  </div>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="ml-4"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl text-gray-900 flex items-center gap-2">
                        <Trash2 className="w-5 h-5 text-red-600" />
                        Permanently Delete Account?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-base text-gray-600">
                        This action will permanently delete your account and all associated data including:
                        <ul className="list-disc list-inside mt-3 space-y-1 text-sm">
                          <li>All study progress and achievements</li>
                          <li>Generated notes and flashcards</li>
                          <li>Practice history and performance data</li>
                          <li>Subscription and billing information</li>
                        </ul>
                        <p className="mt-4 font-semibold text-red-600">
                          This cannot be undone. Are you absolutely sure?
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
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
      </div>
    </div>
  );
};

export default Settings;