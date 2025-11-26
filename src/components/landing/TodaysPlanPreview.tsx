import { motion } from "framer-motion";

export const TodaysPlanPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8"
      style={{ maxWidth: '420px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <h3 className="text-xl font-bold text-gray-900">Today's Plan</h3>
        </div>
        <div 
          className="px-3 py-1 rounded-md text-sm font-medium"
          style={{ 
            backgroundColor: 'rgba(59, 130, 246, 0.1)', 
            color: '#3B82F6' 
          }}
        >
          Day 2
        </div>
      </div>

      {/* Subheading */}
      <p className="text-sm text-gray-600 mb-6">
        Focus: Linear Equations • Your weakest area
      </p>

      {/* Part Cards Grid */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {/* Part 1: Active */}
        <div 
          className="rounded-xl p-4 transition-all cursor-pointer"
          style={{ 
            border: '2px solid #3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.03)'
          }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-gray-900">Part 1: Diagnostic</h4>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
          </div>
          <p className="text-xs text-gray-600 mb-2">→ Quick assessment to set today's difficulty</p>
          <p className="text-xs text-gray-500">5 questions • 3 mins • +25 XP</p>
        </div>

        {/* Part 2: Locked */}
        <div 
          className="rounded-xl p-4 opacity-60"
          style={{ 
            border: '2px solid #E5E7EB',
            backgroundColor: '#F9FAFB'
          }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-gray-900">Part 2: Focus Practice</h4>
            <span className="text-xs">🔒</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">→ Deep practice on Linear Equations</p>
          <p className="text-xs text-gray-500">12 questions • 8 mins • +60 XP</p>
          <p className="text-xs italic text-gray-400 mt-1">Complete Part 1 first</p>
        </div>

        {/* Part 3: Locked */}
        <div 
          className="rounded-xl p-4 opacity-60"
          style={{ 
            border: '2px solid #E5E7EB',
            backgroundColor: '#F9FAFB'
          }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-gray-900">Part 3: Retention Check</h4>
            <span className="text-xs">🔒</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">→ Review topics from past days</p>
          <p className="text-xs text-gray-500">8 questions • 6 mins • +40 XP</p>
          <p className="text-xs italic text-gray-400 mt-1">Complete Part 2 first</p>
        </div>

        {/* Part 4: Locked */}
        <div 
          className="rounded-xl p-4 opacity-60"
          style={{ 
            border: '2px solid #E5E7EB',
            backgroundColor: '#F9FAFB'
          }}
        >
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-bold text-gray-900">Part 4: Challenge Round</h4>
            <span className="text-xs">🔒</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">→ Test yourself with hard questions</p>
          <p className="text-xs text-gray-500">5 questions • 3 mins • +25 XP</p>
          <p className="text-xs italic text-gray-400 mt-1">Complete Part 3 first</p>
        </div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full py-3 rounded-lg font-bold text-base text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{ 
          backgroundColor: '#3B82F6',
          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
        }}
      >
        Start Part 1 →
      </button>
    </motion.div>
  );
};
