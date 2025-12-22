import { TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectGrade {
  id: string;
  name: string;
  currentGrade: string;
  targetGrade: string;
  trend: 'up' | 'stable' | 'down';
  improvement?: string;
}

interface PredictedGradesGridProps {
  subjects: SubjectGrade[];
  onSubjectClick?: (subjectId: string) => void;
}

export const PredictedGradesGrid = ({ subjects, onSubjectClick }: PredictedGradesGridProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-xl font-semibold text-foreground">
          Predicted <span className="italic">Grades</span>
        </h2>
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => {
          const isImproving = subject.trend === 'up';
          const targetMet = parseInt(subject.currentGrade) >= parseInt(subject.targetGrade);
          
          return (
            <div
              key={subject.id}
              onClick={() => onSubjectClick?.(subject.id)}
              className="bg-sticky-yellow border-2 border-sticky-yellow-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <h4 className="font-medium text-foreground mb-3 text-sm truncate">{subject.name}</h4>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{subject.currentGrade}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className={cn(
                    "text-2xl font-bold",
                    targetMet ? "text-emerald-600" : "text-foreground"
                  )}>
                    {subject.targetGrade}
                  </span>
                </div>
                
                {isImproving && subject.improvement && (
                  <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <TrendingUp className="h-3 w-3" />
                    {subject.improvement}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
