import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PremiumBadgeProps {
  className?: string;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
}

export const PremiumBadge = ({ className, variant = "default", size = "default" }: PremiumBadgeProps) => {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md",
        size === "sm" && "text-xs px-2 py-0.5",
        size === "lg" && "text-sm px-3 py-1",
        className
      )}
    >
      <Crown className={cn(
        "mr-1",
        size === "sm" && "h-3 w-3",
        size === "default" && "h-4 w-4", 
        size === "lg" && "h-5 w-5"
      )} />
      Premium
    </Badge>
  );
};