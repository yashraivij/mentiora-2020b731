import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Circle } from "lucide-react";

export function DashboardTodaysPlan() {
  const parts = [
    {
      id: 1,
      name: "Diagnostic",
      description: "→ Quick assessment to set today's difficulty",
      meta: "5 questions • 3 mins • +25 XP",
      status: "active",
    },
    {
      id: 2,
      name: "Focus Practice",
      description: "→ Deep practice on Linear Equations",
      meta: "12 questions • 8 mins • +60 XP",
      status: "locked",
      lockMessage: "Complete Part 1 first",
    },
    {
      id: 3,
      name: "Retention Check",
      description: "→ Review topics from past days",
      meta: "8 questions • 6 mins • +40 XP",
      status: "locked",
      lockMessage: "Complete Part 2 first",
    },
    {
      id: 4,
      name: "Challenge Round",
      description: "→ Test yourself with hard questions",
      meta: "5 questions • 3 mins • +25 XP",
      status: "locked",
      lockMessage: "Complete Part 3 first",
    },
  ];

  return (
    <Card className="lg:sticky lg:top-24 border border-border bg-card rounded-2xl shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="text-lg font-bold text-foreground">Today's Plan</h3>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-md"
          >
            Day 2
          </Badge>
        </div>

        {/* Subheading */}
        <p className="text-sm text-muted-foreground mb-6">
          Focus: Linear Equations • Your weakest area
        </p>

        {/* Part Cards Grid */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {parts.map((part) => (
            <motion.div
              key={part.id}
              whileHover={part.status === "active" ? { y: -1 } : {}}
              transition={{ duration: 0.15 }}
            >
              <Card
                className={`
                  p-4 transition-all duration-150
                  ${
                    part.status === "active"
                      ? "border-2 border-primary bg-primary/5 cursor-pointer hover:border-primary/80 hover:shadow-md hover:shadow-primary/10"
                      : "border border-border bg-muted/30 opacity-60 cursor-not-allowed"
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">
                        Part {part.id}: {part.name}
                      </span>
                      {part.status === "active" ? (
                        <Circle className="h-3 w-3 fill-primary text-primary" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {part.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {part.meta}
                    </p>
                    {part.lockMessage && (
                      <p className="text-xs italic text-muted-foreground/60 mt-1">
                        {part.lockMessage}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Start Button */}
        <Button
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all duration-150"
          onClick={() => {
            // Navigate to /session/diagnostic
            console.log("Start Part 1 clicked");
          }}
        >
          Start Part 1 →
        </Button>
      </div>
    </Card>
  );
}
