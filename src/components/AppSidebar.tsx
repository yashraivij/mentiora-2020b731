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
    color: "hsl(199, 89%, 48%)",
    bgColor: "bg-[#0BA5E9]/10",
    activeColor: "bg-[#0BA5E9]",
    hoverColor: "hover:bg-[#0BA5E9]/20"
  },
  { 
    id: "leaderboards", 
    label: "Leaderboards", 
    url: "/dashboard?tab=leaderboards", 
    icon: Trophy,
    color: "hsl(43, 96%, 56%)",
    bgColor: "bg-[#FBBF24]/10",
    activeColor: "bg-[#FBBF24]",
    hoverColor: "hover:bg-[#FBBF24]/20"
  },
  { 
    id: "quests", 
    label: "Quests", 
    url: "/dashboard?tab=quests", 
    icon: Star,
    color: "hsl(142, 71%, 45%)",
    bgColor: "bg-[#22C55E]/10",
    activeColor: "bg-[#22C55E]",
    hoverColor: "hover:bg-[#22C55E]/20"
  },
  { 
    id: "flashcards", 
    label: "Flashcards", 
    url: "/dashboard?tab=flashcards", 
    icon: Brain,
    color: "hsl(258, 90%, 66%)",
    bgColor: "bg-[#A855F7]/10",
    activeColor: "bg-[#A855F7]",
    hoverColor: "hover:bg-[#A855F7]/20"
  },
  { 
    id: "profile", 
    label: "Profile", 
    url: "/dashboard?tab=profile", 
    icon: User,
    color: "hsl(217, 19%, 60%)",
    bgColor: "bg-[#94A3B8]/10",
    activeColor: "bg-[#94A3B8]",
    hoverColor: "hover:bg-[#94A3B8]/20"
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
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0BA5E9] to-[#6366F1] p-2 shadow-lg flex-shrink-0"
          >
            <img 
              src={mentioraLogo} 
              alt="Mentiora" 
              className="h-full w-full object-contain brightness-0 invert"
            />
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-gradient-to-r from-[#0BA5E9] to-[#6366F1] bg-clip-text text-transparent"
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
                            flex items-center gap-4 px-4 py-4 rounded-2xl
                            transition-all duration-300 relative overflow-hidden
                            ${active 
                              ? `${item.activeColor} text-white shadow-xl` 
                              : `${item.bgColor} ${item.hoverColor} transition-all duration-200`
                            }
                          `}
                          whileHover={{ scale: 1.03, x: 4 }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            boxShadow: active ? `0 8px 24px -8px ${item.color}` : 'none'
                          }}
                        >
                          {/* Background glow effect */}
                          {active && (
                            <motion.div
                              className="absolute inset-0 opacity-20"
                              style={{
                                background: `radial-gradient(circle at 30% 50%, white, transparent 70%)`
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.2 }}
                            />
                          )}
                          
                          <motion.div
                            whileHover={{ rotate: active ? 0 : 5 }}
                            className="relative z-10"
                          >
                            <item.icon 
                              className={`h-6 w-6 flex-shrink-0 ${active ? 'text-white' : ''}`}
                              style={{ color: active ? 'white' : item.color }}
                              strokeWidth={2.5}
                            />
                          </motion.div>
                          
                          {!isCollapsed && (
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`font-bold text-base relative z-10 ${active ? 'text-white' : ''}`}
                              style={{ color: active ? 'white' : item.color }}
                            >
                              {item.label}
                            </motion.span>
                          )}
                          
                          {/* Active indicator pill */}
                          {active && !isCollapsed && (
                            <motion.div
                              layoutId="activePill"
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
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
                    flex items-center gap-4 px-4 py-4 rounded-2xl
                    transition-all duration-300 relative overflow-hidden
                    ${location.pathname === "/settings"
                      ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-xl shadow-[#6366F1]/30' 
                      : 'bg-muted/50 hover:bg-muted transition-all duration-200'
                    }
                  `}
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Settings 
                      className={`h-6 w-6 flex-shrink-0 ${location.pathname === "/settings" ? 'text-white' : 'text-[#6366F1]'}`}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`font-bold text-base ${location.pathname === "/settings" ? 'text-white' : 'text-[#6366F1]'}`}
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
