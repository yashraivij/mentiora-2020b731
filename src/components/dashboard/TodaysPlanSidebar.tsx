import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PartCard {
  id: string;
  name: string;
  description: string;
  questions: number;
  minutes: number;
  xp: number;
  status: "active" | "locked" | "completed";
  lockMessage?: string;
}

interface TodaysPlanSidebarProps {
  dayNumber: number;
  focusTopic: string;
  focusReason: string;
}

export const TodaysPlanSidebar = ({
  dayNumber,
  focusTopic,
  focusReason,
}: TodaysPlanSidebarProps) => {
  const navigate = useNavigate();

  // Mock data - would come from props or API in real implementation
  const parts: PartCard[] = [
    {
      id: "part1",
      name: "Part 1: Diagnostic Burst",
      description: "→ Quick assessment to set today's difficulty",
      questions: 5,
      minutes: 3,
      xp: 25,
      status: "active",
    },
    {
      id: "part2",
      name: "Part 2: Focus Practice",
      description: `→ Deep practice on ${focusTopic}`,
      questions: 12,
      minutes: 8,
      xp: 60,
      status: "locked",
      lockMessage: "Complete Part 1 first",
    },
    {
      id: "part3",
      name: "Part 3: Retention Check",
      description: "→ Review topics from past days",
      questions: 8,
      minutes: 6,
      xp: 40,
      status: "locked",
      lockMessage: "Complete Part 2 first",
    },
    {
      id: "part4",
      name: "Part 4: Challenge Round",
      description: "→ Test yourself with hard questions",
      questions: 5,
      minutes: 3,
      xp: 25,
      status: "locked",
      lockMessage: "Complete Part 3 first",
    },
  ];

  const activePart = parts.find((part) => part.status === "active");

  const handleStartClick = () => {
    navigate("/session/diagnostic");
  };

  const handlePartClick = (part: PartCard) => {
    if (part.status === "active") {
      navigate("/session/diagnostic");
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardContent className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-2xl font-bold text-foreground">Today's Plan</h2>
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary px-3 py-1 text-sm font-medium rounded-md"
          >
            Day {dayNumber}
          </Badge>
        </div>

        {/* Subheading */}
        <p className="text-sm text-muted-foreground mb-6">
          Focus: {focusTopic} • {focusReason}
        </p>

        {/* Part Cards */}
        <div className="space-y-3 mb-6">
          {parts.map((part) => (
            <div
              key={part.id}
              onClick={() => handlePartClick(part)}
              className={`
                rounded-xl p-5 border-2 transition-all duration-150
                ${
                  part.status === "active"
                    ? "border-primary bg-primary/[0.03] cursor-pointer hover:border-primary/80 hover:shadow-md hover:-translate-y-0.5"
                    : part.status === "completed"
                    ? "border-[hsl(var(--success))] bg-[hsl(var(--success))]/5 opacity-80"
                    : "border-border bg-muted/40 opacity-60 cursor-not-allowed"
                }
              `}
            >
              {/* Part Name and Status */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-foreground">
                  {part.name.split(":")[0]}:{" "}
                  <span className="font-normal">{part.name.split(":")[1]}</span>
                </h3>
                {part.status === "active" && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
                {part.status === "locked" && (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
                {part.status === "completed" && (
                  <Check className="w-4 h-4 text-[hsl(var(--success))]" />
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-2">
                {part.description}
              </p>

              {/* Meta info */}
              <p className="text-xs text-muted-foreground/70">
                {part.questions} questions • {part.minutes} mins • +{part.xp} XP
              </p>

              {/* Lock message */}
              {part.status === "locked" && part.lockMessage && (
                <p className="text-xs text-muted-foreground/60 italic mt-2">
                  {part.lockMessage}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStartClick}
          className="w-full h-[52px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
        >
          Start {activePart?.name.split(":")[0] || "Part 1"} →
        </Button>
      </CardContent>
    </Card>
  );
};
