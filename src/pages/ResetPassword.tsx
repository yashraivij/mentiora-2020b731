import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSession = async () => {
      console.log("Current URL:", window.location.href);
      console.log("URL hash:", window.location.hash);
      console.log("URL search:", window.location.search);
      
      // Supabase sends tokens in different formats, let's handle both
      let accessToken, refreshToken, type;
      
      // Method 1: Check URL hash (common format)
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        accessToken = hashParams.get('access_token');
        refreshToken = hashParams.get('refresh_token');
        type = hashParams.get('type');
        console.log("Hash params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      }
      
      // Method 2: Check URL search params
      if (!accessToken && window.location.search) {
        const searchParams = new URLSearchParams(window.location.search);
        accessToken = searchParams.get('access_token');
        refreshToken = searchParams.get('refresh_token');
        type = searchParams.get('type');
        console.log("Search params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
      }
      
      // Method 3: Let Supabase handle the session automatically from URL
      if (!accessToken) {
        try {
          const { data, error } = await supabase.auth.getSession();
          console.log("Supabase auto session:", { session: !!data.session, error });
          
          if (data.session) {
            console.log("Found existing session, user can reset password");
            return; // Session is valid, user can proceed
          }
        } catch (error) {
          console.error("Session check error:", error);
        }
      }
      
      // If we have tokens, try to set the session
      if (accessToken && refreshToken) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          console.log("Manual session set result:", { data: !!data.session, error });
          
          if (error) {
            console.error('Session error:', error);
            toast.error('Reset link has expired. Please request a new password reset.');
            navigate('/login');
            return;
          }
          
          if (data.session) {
            console.log("Session established successfully");
            return;
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
      }
      
      // If we get here, no valid session could be established
      console.log("No valid session found, redirecting to login");
      toast.error('Invalid reset link. Please request a new password reset from the login page.');
      navigate('/login');
    };

    handleAuthSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("An error occurred while updating your password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-5 h-5 object-contain"
              />
            </div>
          </div>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline"
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;