import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileNav({ children, className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden mobile-touch-target",
            className
          )}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileNavItem({ children, className, onClick }: MobileNavItemProps) {
  return (
    <div 
      className={cn(
        "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline mobile-touch-target cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}