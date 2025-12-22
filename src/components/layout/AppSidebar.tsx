import { Home, Target, BarChart3, LogOut, Crown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "My Dashboard", icon: Home, path: "/dashboard" },
  { id: "practice", label: "Practice", icon: Target, path: "/subject/maths-edexcel" },
  { id: "performance", label: "Performance", icon: BarChart3, path: "/analytics" },
];

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isPremium, openPaymentLink } = useSubscription();

  const isActive = (path: string) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    if (path.startsWith("/subject")) return location.pathname.startsWith("/subject") || location.pathname.startsWith("/practice");
    if (path === "/analytics") return location.pathname === "/analytics";
    return location.pathname === path;
  };

  return (
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={mentioraLogo} alt="Mentiora" className="h-8 w-8" />
          <span className="font-playfair text-xl font-semibold text-foreground">Mentiora</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                active
                  ? "bg-sidebar-accent text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary")} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Premium Card */}
      {!isPremium && (
        <div className="p-4">
          <div 
            onClick={() => openPaymentLink()}
            className="bg-sticky-yellow border border-sticky-yellow-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Go Premium</span>
            </div>
            <p className="text-sm text-amber-700">
              Unlock all features and boost your grades!
            </p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
