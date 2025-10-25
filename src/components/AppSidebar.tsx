import { Home, Trophy, Star, Brain, User, Settings } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { motion } from "framer-motion";

const navItems = [
  { 
    id: "learn", 
    label: "Learn", 
    url: "/dashboard", 
    icon: Home,
    tooltip: "View your subjects and progress",
    gradient: "from-sky-500 to-blue-600",
    iconColor: "text-sky-500",
    activeGlow: "shadow-sky-500/20"
  },
  { 
    id: "leaderboards", 
    label: "Leaderboards", 
    url: "/dashboard?tab=leaderboards", 
    icon: Trophy,
    tooltip: "See where you rank",
    gradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
    activeGlow: "shadow-amber-500/20"
  },
  { 
    id: "quests", 
    label: "Quests", 
    url: "/dashboard?tab=quests", 
    icon: Star,
    tooltip: "Complete daily challenges",
    gradient: "from-emerald-500 to-green-600",
    iconColor: "text-emerald-500",
    activeGlow: "shadow-emerald-500/20"
  },
  { 
    id: "flashcards", 
    label: "Flashcards", 
    url: "/dashboard?tab=flashcards", 
    icon: Brain,
    tooltip: "Study with AI flashcards",
    gradient: "from-purple-500 to-violet-600",
    iconColor: "text-purple-500",
    activeGlow: "shadow-purple-500/20"
  },
  { 
    id: "profile", 
    label: "Profile", 
    url: "/dashboard?tab=profile", 
    icon: User,
    tooltip: "Manage your account",
    gradient: "from-slate-500 to-slate-600",
    iconColor: "text-slate-500",
    activeGlow: "shadow-slate-500/20"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return location.pathname === "/dashboard" && !location.search;
    }
    return location.pathname + location.search === url;
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 p-2 shadow-md flex-shrink-0"
          >
            <img 
              src={mentioraLogo} 
              alt="Mentiora" 
              className="h-full w-full object-contain brightness-0 invert"
            />
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
            >
              Mentiora
            </motion.span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild tooltip={item.tooltip}>
                      <NavLink
                        to={item.url}
                        className="group relative"
                      >
                        <motion.div
                          className={`
                            flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                            transition-all duration-200 relative overflow-hidden
                            ${active 
                              ? `bg-gradient-to-r ${item.gradient} shadow-lg ${item.activeGlow}` 
                              : `hover:bg-accent/50`
                            }
                          `}
                          whileHover={{ scale: active ? 1 : 1.02, x: active ? 0 : 2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                        >
                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                              layoutId="activeIndicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          
                          <motion.div
                            whileHover={{ rotate: active ? 0 : 5 }}
                            transition={{ duration: 0.2 }}
                            className="relative z-10 flex-shrink-0"
                          >
                            <item.icon 
                              className={`h-5 w-5 transition-colors duration-200 ${
                                active ? 'text-white' : item.iconColor
                              }`}
                              strokeWidth={2.5}
                            />
                          </motion.div>
                          
                          {!isCollapsed && (
                            <motion.span 
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.15 }}
                              className={`font-semibold text-sm relative z-10 transition-colors duration-200 ${
                                active ? 'text-white' : 'text-foreground'
                              }`}
                            >
                              {item.label}
                            </motion.span>
                          )}
                        </motion.div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Manage your preferences">
              <NavLink to="/settings" className="group">
                <motion.div
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                    transition-all duration-200 relative overflow-hidden
                    ${location.pathname === "/settings"
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20' 
                      : 'hover:bg-accent/50'
                    }
                  `}
                  whileHover={{ scale: location.pathname === "/settings" ? 1 : 1.02, x: location.pathname === "/settings" ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Active indicator */}
                  {location.pathname === "/settings" && (
                    <motion.div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <Settings 
                      className={`h-5 w-5 transition-colors duration-200 ${
                        location.pathname === "/settings" ? 'text-white' : 'text-indigo-500'
                      }`}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`font-semibold text-sm transition-colors duration-200 ${
                        location.pathname === "/settings" ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      Settings
                    </motion.span>
                  )}
                </motion.div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
