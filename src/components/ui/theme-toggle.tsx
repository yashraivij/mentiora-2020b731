import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="h-9 w-9 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground theme-transition shadow-sm hover:shadow-md relative group flex items-center justify-center"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10 flex items-center justify-center">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100" />
        </div>
        <span className="sr-only">Toggle between light and dark mode</span>
      </Button>
    </motion.div>
  );
}