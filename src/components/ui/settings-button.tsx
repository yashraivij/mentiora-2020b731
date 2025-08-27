import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface SettingsButtonProps {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const SettingsButton = ({ 
  variant = "ghost", 
  size = "icon",
  className = ""
}: SettingsButtonProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size={size}
        onClick={() => navigate('/settings')}
        className={`hover:bg-primary/10 transition-all duration-300 ${className}`}
        title="Settings"
      >
        <Settings className="h-5 w-5" />
        {size !== "icon" && <span className="ml-2">Settings</span>}
      </Button>
    </motion.div>
  );
};