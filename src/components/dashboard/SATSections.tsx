import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface SATSection {
  current: number;
  target: number;
  max: number;
  weak_areas: string[];
  status: string;
}

interface SATSectionsProps {
  math: SATSection;
  readingWriting: SATSection;
  onViewTopics: (section: "math" | "readingWriting") => void;
}

export function SATSections({
  math,
  readingWriting,
  onViewTopics,
}: SATSectionsProps) {
  const renderSection = (
    title: string,
    icon: string,
    section: SATSection,
    sectionKey: "math" | "readingWriting"
  ) => {
    const progressPercentage = (section.current / section.target) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-6">
            {/* Top Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{icon}</span>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 text-xs font-medium uppercase px-3 py-1">
                {section.status}
              </Badge>
            </div>

            {/* Score Display */}
            <p className="text-3xl font-bold text-primary mb-4">
              {section.current} / {section.max}
            </p>

            {/* Target */}
            <p className="text-sm text-muted-foreground mb-4">
              Target: {section.target}
            </p>

            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-1.5 mb-5" />

            {/* Weak Areas */}
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                WEAK AREAS
              </p>
              <p className="text-sm text-foreground">
                {section.weak_areas.join(", ")}
              </p>
            </div>

            {/* Button */}
            <Button
              className="w-full h-11 text-base font-medium"
              onClick={() => onViewTopics(sectionKey)}
            >
              View Topics
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">SAT Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSection("Math", "📐", math, "math")}
        {renderSection(
          "Reading & Writing",
          "📖",
          readingWriting,
          "readingWriting"
        )}
      </div>
    </div>
  );
}
