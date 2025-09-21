import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const colorThemes = [
  { id: 'default', name: 'Default', colors: 'from-blue-500 to-purple-500' },
  { id: 'ocean', name: 'Ocean', colors: 'from-blue-400 to-cyan-400' },
  { id: 'sunset', name: 'Sunset', colors: 'from-orange-400 to-pink-400' },
  { id: 'forest', name: 'Forest', colors: 'from-green-400 to-emerald-400' },
  { id: 'royal', name: 'Royal', colors: 'from-purple-400 to-indigo-400' },
];

export function ColorThemeToggle() {
  const { colorTheme, setColorTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground theme-transition shadow-sm hover:shadow-md relative group"
            aria-label="Change color theme"
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Palette className="h-4 w-4 text-foreground group-hover:text-primary transition-colors duration-300 relative z-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse shadow-sm" />
            <span className="sr-only">Change color theme</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 bg-popover/95 backdrop-blur-md border border-border shadow-xl theme-transition">
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id as any)}
            className="flex items-center space-x-3 cursor-pointer hover:bg-accent theme-transition group"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors} shadow-sm group-hover:shadow-md transition-shadow`} />
            <span className={`flex-1 ${colorTheme === theme.id ? 'font-bold text-primary' : 'text-foreground'} transition-colors`}>
              {theme.name}
            </span>
            {colorTheme === theme.id && (
              <span className="ml-auto text-xs text-primary font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}