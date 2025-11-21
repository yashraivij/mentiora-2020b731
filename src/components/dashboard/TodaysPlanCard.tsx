import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";

interface Session {
  id: string;
  number: number;
  type: "Learn" | "Practice" | "Review";
  title: string;
  duration: number;
  xp: number;
  status: "not_started" | "completed" | "locked";
  completedAt: string | null;
}

interface TodaysPlanCardProps {
  dayNumber: number;
  streak: number;
  focusTopic: string;
  focusReason: string;
  sessions: Session[];
  totalXP: number;
  allCompleted: boolean;
}

export const TodaysPlanCard = ({
  dayNumber,
  streak,
  focusTopic,
  focusReason,
  sessions,
  totalXP,
  allCompleted,
}: TodaysPlanCardProps) => {
  const navigate = useNavigate();

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const completed = new Date(timestamp);
    const diffMs = now.getTime() - completed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return "today";
  };

  const getNextSession = () => {
    return sessions.find(s => s.status === "not_started");
  };

  const handleSessionClick = (session: Session) => {
    if (session.status === "locked") return;
    navigate(`/session/${session.id}`);
  };

  const handleStartClick = () => {
    const nextSession = getNextSession();
    if (nextSession) {
      navigate(`/session/${nextSession.id}`);
    }
  };

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[900px] mx-auto mt-10 mb-10 px-4"
      >
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)",
          }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            🎉 Day {dayNumber} Complete!
          </h2>
          <p className="text-lg text-white/80 mb-3">
            Great work! You earned +{totalXP} XP
          </p>
          <p className="text-base font-medium mb-8" style={{ color: "#EF4444" }}>
            🔥 {streak + 1}-day streak maintained
          </p>
          <p className="text-base text-white/70 mb-6">
            See you tomorrow for Day {dayNumber + 1} 🌅
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
            <button
              onClick={() => navigate("/results/today")}
              className="flex-1 h-14 rounded-xl border-2 border-white/30 bg-transparent text-white font-medium hover:bg-white/10 transition-all duration-150"
            >
              View Today's Results
            </button>
            <button
              onClick={() => navigate("/practice")}
              className="flex-1 h-14 rounded-xl font-bold text-lg transition-all duration-150 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #B4FF39, #9FE01F)",
                color: "#0A1628",
                boxShadow: "0 4px 12px rgba(180, 255, 57, 0.3)",
              }}
            >
              Extra Practice →
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const nextSession = getNextSession();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[900px] mx-auto mt-10 mb-10 px-4"
    >
      <div
        className="rounded-2xl p-10"
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #1E3A65 100%)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
            style={{
              background: "rgba(180, 255, 57, 0.2)",
              color: "#B4FF39",
            }}
          >
            DAY {dayNumber}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-white/80">
            <span>🔥</span>
            <span>{streak}-day streak</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-white mb-3">
          Your Plan for Today
        </h2>

        {/* Focus Statement */}
        <p className="text-lg font-medium mb-8" style={{ color: "#00D9FF" }}>
          Focus: {focusTopic} ({focusReason})
        </p>

        {/* Session Cards */}
        <div className="flex flex-col gap-3 mb-6">
          {sessions.map((session, index) => {
            const isLocked = session.status === "locked";
            const isCompleted = session.status === "completed";

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleSessionClick(session)}
                className={`
                  flex justify-between items-center p-5 rounded-xl transition-all duration-150
                  ${
                    isLocked
                      ? "opacity-50 cursor-not-allowed"
                      : isCompleted
                      ? "cursor-default"
                      : "cursor-pointer hover:-translate-y-0.5"
                  }
                `}
                style={{
                  background: isCompleted
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(255, 255, 255, 0.08)",
                  border: isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : isLocked
                    ? "1px solid rgba(255, 255, 255, 0.12)"
                    : "1px solid rgba(0, 217, 255, 0.3)",
                }}
              >
                {/* Left Content */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-base font-bold text-white">
                    Session {session.number}: {session.type}
                  </p>
                  <p className="text-sm text-white/70">
                    → {session.title}
                  </p>
                  <p className="text-xs text-white/60">
                    {session.duration} mins | +{session.xp} XP
                  </p>
                </div>

                {/* Right Status */}
                <div className="flex flex-col items-center gap-1">
                  {isCompleted ? (
                    <>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "#10B981" }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs text-white/60 text-center">
                        {session.completedAt && getTimeAgo(session.completedAt)}
                      </p>
                    </>
                  ) : isLocked ? (
                    <>
                      <Lock className="w-6 h-6 text-white/60" />
                      <p className="text-xs text-white/60 text-center max-w-[100px]">
                        Complete Session {session.number - 1} first
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white"
                        style={{ background: "transparent" }}
                      />
                      <p className="text-xs text-white/60">Not started</p>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total Summary */}
        <p className="text-sm font-medium text-white/70 text-center mb-6">
          Total: ~{sessions.reduce((sum, s) => sum + s.duration, 0)} minutes | +{totalXP} XP
        </p>

        {/* Start Button */}
        {nextSession && (
          <button
            onClick={handleStartClick}
            className="w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-150 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #B4FF39, #9FE01F)",
              color: "#0A1628",
              boxShadow: "0 4px 12px rgba(180, 255, 57, 0.3)",
            }}
          >
            Start Session {nextSession.number} →
          </button>
        )}
      </div>
    </motion.div>
  );
};
