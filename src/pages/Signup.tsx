import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const isFormValid = formData.fullName.length >= 2 && 
                      formData.email.includes("@") && 
                      formData.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) throw error;

      // Store name for onboarding
      localStorage.setItem('onboarding_name', formData.fullName.split(' ')[0]);
      navigate('/onboarding/welcome');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)'
      }}
    >
      {/* Subtle animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-[480px] mx-4"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Logo */}
        <h1 
          className="text-center mb-8 text-[32px] font-bold"
          style={{
            background: 'linear-gradient(135deg, #00D9FF 0%, #B4FF39 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Mentiora
        </h1>

        {/* Heading */}
        <h2 className="text-[28px] font-bold text-[#0A1628] text-center mb-8 leading-tight">
          Set up your account and start crushing your SAT prep!
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full h-[56px] px-6 rounded-xl bg-[#F5F8FA] border-2 border-[#E1E8ED] text-[#0A1628] text-[16px] placeholder:text-[#8899A6] focus:outline-none focus:border-[#00D9FF] transition-all"
            style={{
              boxShadow: 'none',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 4px rgba(0, 217, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-[56px] px-6 rounded-xl bg-[#F5F8FA] border-2 border-[#E1E8ED] text-[#0A1628] text-[16px] placeholder:text-[#8899A6] focus:outline-none focus:border-[#00D9FF] transition-all"
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 0 4px rgba(0, 217, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full h-[56px] px-6 pr-14 rounded-xl bg-[#F5F8FA] border-2 border-[#E1E8ED] text-[#0A1628] text-[16px] placeholder:text-[#8899A6] focus:outline-none focus:border-[#00D9FF] transition-all"
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 217, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8899A6] hover:text-[#0A1628] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full h-[56px] rounded-xl font-bold text-[16px] text-[#0A1628] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isFormValid ? 'linear-gradient(135deg, #B4FF39 0%, #9AE834 100%)' : '#E1E8ED',
              boxShadow: isFormValid ? '0 4px 16px rgba(180, 255, 57, 0.4)' : 'none',
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-[#0A1628] border-t-transparent rounded-full animate-spin" />
                Creating account...
              </div>
            ) : (
              'Create account'
            )}
          </button>

          {/* Fine Print */}
          <p className="text-[13px] text-[#8899A6] text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <span className="text-[#00D9FF] cursor-pointer hover:underline">Terms of Service</span>
            {' '}&{' '}
            <span className="text-[#00D9FF] cursor-pointer hover:underline">Privacy Policy</span>
          </p>

          {/* Sign In Link */}
          <p className="text-center text-[14px] text-[#8899A6] pt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#00D9FF] font-medium hover:underline"
            >
              Sign in
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};
