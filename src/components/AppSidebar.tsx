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
    gradient: "from-sky-400 to-sky-500",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    iconColor: "text-sky-600",
    activeGradient: "from-[#0BA5E9] to-[#0284c7]"
  },
  { 
    id: "leaderboards", 
    label: "Leaderboards", 
    url: "/dashboard?tab=leaderboards", 
    icon: Trophy,
    gradient: "from-yellow-400 to-amber-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600",
    activeGradient: "from-yellow-400 to-amber-500"
  },
  { 
    id: "quests", 
    label: "Quests", 
    url: "/dashboard?tab=quests", 
    icon: Star,
    gradient: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600",
    activeGradient: "from-green-400 to-emerald-500"
  },
  { 
    id: "flashcards", 
    label: "Flashcards", 
    url: "/dashboard?tab=flashcards", 
    icon: Brain,
    gradient: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600",
    activeGradient: "from-purple-400 to-violet-500"
  },
  { 
    id: "profile", 
    label: "Profile", 
    url: "/dashboard?tab=profile", 
    icon: User,
    gradient: "from-slate-400 to-slate-500",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    iconColor: "text-slate-600",
    activeGradient: "from-slate-400 to-slate-500"
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
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-background/95 backdrop-blur-sm">
      <SidebarHeader className="p-6 border-b border-border/50">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0BA5E9] to-[#0284c7] p-2 shadow-lg shadow-[#0BA5E9]/25">
            <img 
              src={mentioraLogo} 
              alt="Mentiora" 
              className="h-full w-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black bg-gradient-to-r from-[#0BA5E9] to-[#0284c7] bg-clip-text text-transparent"
            >
              Mentiora
            </motion.span>
          )}
        </motion.div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navItems.map((item, index) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink to={item.url} className="group relative block">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative overflow-hidden"
                        >
                          {active ? (
                            <div className={`
                              flex items-center gap-4 px-5 py-4 rounded-2xl
                              bg-gradient-to-r ${item.activeGradient}
                              text-white shadow-xl shadow-black/10
                              transform transition-all duration-300
                            `}>
                              <div className="relative">
                                <item.icon className="h-6 w-6 relative z-10" strokeWidth={2.5} />
                                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                              </div>
                              {!isCollapsed && (
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="font-bold text-base tracking-wide"
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </div>
                          ) : (
                            <div className={`
                              flex items-center gap-4 px-5 py-4 rounded-2xl
                              ${item.bgColor}
                              transition-all duration-300
                              hover:shadow-md hover:scale-[1.02]
                              group-hover:translate-x-1
                            `}>
                              <item.icon 
                                className={`h-6 w-6 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`} 
                                strokeWidth={2.5}
                              />
                              {!isCollapsed && (
                                <motion.span 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className={`font-bold text-base ${item.iconColor} dark:text-foreground/80`}
                                >
                                  {item.label}
                                </motion.span>
                              )}
                            </div>
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

      <SidebarFooter className="p-4 border-t border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <NavLink to="/settings" className="group block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  {location.pathname === "/settings" ? (
                    <div className={`
                      flex items-center gap-4 px-5 py-4 rounded-2xl
                      bg-gradient-to-r from-slate-400 to-slate-500
                      text-white shadow-xl shadow-black/10
                    `}>
                      <div className="relative">
                        <Settings className="h-6 w-6 relative z-10" strokeWidth={2.5} />
                        <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
                      </div>
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-bold text-base tracking-wide"
                        >
                          Settings
                        </motion.span>
                      )}
                    </div>
                  ) : (
                    <div className={`
                      flex items-center gap-4 px-5 py-4 rounded-2xl
                      bg-slate-50 dark:bg-slate-900/20
                      transition-all duration-300
                      hover:shadow-md hover:scale-[1.02]
                      group-hover:translate-x-1
                    `}>
                      <Settings 
                        className="h-6 w-6 text-slate-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" 
                        strokeWidth={2.5}
                      />
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="font-bold text-base text-slate-600 dark:text-foreground/80"
                        >
                          Settings
                        </motion.span>
                      )}
                    </div>
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
