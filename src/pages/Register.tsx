
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { OnboardingPopup } from "@/components/ui/onboarding-popup";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const success = await register(name, email, password);
    
    if (success) {
      navigate("/dashboard");
      // Small delay to ensure navigation completes before showing popup
      setTimeout(() => {
        setShowOnboarding(true);
      }, 100);
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate("/dashboard");
  };

  return (
    <>
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-100 bg-white rounded-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#0BA5E9' }}>
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-black mb-2">
            Create Account
          </CardTitle>
          <CardDescription className="text-gray-600 text-base">
            Start your personalized GCSE revision journey
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200"
                style={{ 
                  borderColor: name ? '#0BA5E9' : undefined,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200"
                style={{ 
                  borderColor: email ? '#0BA5E9' : undefined,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200"
                style={{ 
                  borderColor: password ? '#0BA5E9' : undefined,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-200"
                style={{ 
                  borderColor: confirmPassword ? '#0BA5E9' : undefined,
                }}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition-all duration-300" 
              style={{ backgroundColor: '#0BA5E9' }}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="hover:underline font-semibold" style={{ color: '#0BA5E9' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <OnboardingPopup
      isOpen={showOnboarding}
      onClose={handleOnboardingComplete}
      onSubjectsAdded={handleOnboardingComplete}
    />
    </>
  );
};

export default Register;
