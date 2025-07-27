import { Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
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
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground relative"
        >
          <Palette className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse" />
          <span className="sr-only">Change color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover/95 backdrop-blur-md border-border/50 shadow-xl">
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id as any)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors}`} />
            <span className={colorTheme === theme.id ? 'font-bold text-primary' : ''}>{theme.name}</span>
            {colorTheme === theme.id && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}