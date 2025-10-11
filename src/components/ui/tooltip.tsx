import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[100] overflow-hidden rounded-xl backdrop-blur-2xl bg-gradient-to-br from-card/98 via-card/95 to-card/98 border border-primary/30 px-4 py-3 text-sm font-medium text-card-foreground shadow-2xl shadow-primary/20 ring-1 ring-primary/10 animate-in fade-in-0 zoom-in-[0.98] duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:duration-200 data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3 data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3 transition-all",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
