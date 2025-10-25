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
    color: "rgba(11, 165, 233, 0.1)" 
  },
  { 
    id: "leaderboards", 
    label: "Leaderboards", 
    url: "/dashboard?tab=leaderboards", 
    icon: Trophy,
    color: "rgba(251, 191, 36, 0.1)"
  },
  { 
    id: "quests", 
    label: "Quests", 
    url: "/dashboard?tab=quests", 
    icon: Star,
    color: "rgba(34, 197, 94, 0.1)"
  },
  { 
    id: "flashcards", 
    label: "Flashcards", 
    url: "/dashboard?tab=flashcards", 
    icon: Brain,
    color: "rgba(168, 85, 247, 0.1)"
  },
  { 
    id: "profile", 
    label: "Profile", 
    url: "/dashboard?tab=profile", 
    icon: User,
    color: "rgba(148, 163, 184, 0.1)"
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
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img 
            src={mentioraLogo} 
            alt="Mentiora" 
            className="h-8 w-8 flex-shrink-0"
          />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-foreground"
            >
              Mentiora
            </motion.span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={item.url}
                        className="group relative"
                      >
                        <motion.div
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl
                            transition-all duration-200
                            ${active 
                              ? 'bg-[#0BA5E9] text-white shadow-lg shadow-[#0BA5E9]/25' 
                              : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                            }
                          `}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <item.icon 
                            className={`h-5 w-5 flex-shrink-0 ${active ? 'text-white' : ''}`}
                          />
                          {!isCollapsed && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`font-semibold text-sm ${active ? 'text-white' : ''}`}
                            >
                              {item.label}
                            </motion.span>
                          )}
                          {active && !isCollapsed && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                              initial={false}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
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

      <SidebarFooter className="p-3 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to="/settings" className="group">
                <motion.div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${location.pathname === "/settings"
                      ? 'bg-[#0BA5E9] text-white shadow-lg shadow-[#0BA5E9]/25' 
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Settings className={`h-5 w-5 flex-shrink-0 ${location.pathname === "/settings" ? 'text-white' : ''}`} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`font-semibold text-sm ${location.pathname === "/settings" ? 'text-white' : ''}`}
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
