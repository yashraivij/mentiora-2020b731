import { Trophy } from "lucide-react";

interface RankingCardProps {
  percentage: number;
  subject: string;
}

export const RankingCard = ({ percentage, subject }: RankingCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-500" />
        <h3 className="font-medium text-muted-foreground">Your Ranking</h3>
      </div>
      
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground mb-2">You're in the</p>
        <p className="text-4xl font-playfair font-bold text-foreground mb-2">
          Top {percentage}%
        </p>
        <p className="text-sm text-muted-foreground">in {subject}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Keep practicing to improve!</span>
        </div>
      </div>
    </div>
  );
};
