import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // On mobile, render without sidebar (mobile nav will be handled separately)
    return (
      <div className="min-h-screen bg-background">
        {/* Dotted grid background */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />
        <main className="relative z-10">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Dotted grid background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Sidebar */}
      <div className="relative z-20">
        <AppSidebar />
      </div>
      
      {/* Main content */}
      <main className="flex-1 relative z-10 overflow-auto">
        {children}
      </main>
    </div>
  );
};
