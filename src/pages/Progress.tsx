import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, Target, Clock, Zap, CheckCircle2, Circle, Flame, BookOpen, Brain, Calendar, Sparkles, Play, Shuffle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Progress: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample data for the growth chart
  const growthData = [
    { week: 'Week 1', score: 45 },
    { week: 'Week 2', score: 52 },
    { week: 'Week 3', score: 58 },
    { week: 'Mock 1', score: 62 },
    { week: 'Week 5', score: 68 },
    { week: 'Midterm', score: 72 },
    { week: 'Week 7', score: 76 },
    { week: 'Current', score: 78 },
  ];

  const streakDays = [true, true, true, true, true, true, true];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E7ECF5] bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-[#2E5BFF] hover:text-[#2E5BFF]/80 hover:bg-[#F7F9FC]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Your Progress</h1>
          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Section - Your Journey */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Your journey to your target grade
                    </h2>
                    <p className="text-lg text-gray-600">
                      You're on track. Keep following your plan and your next grade milestone is within reach.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-[#F7F9FC] text-gray-700 border-[#E7ECF5] px-4 py-2 text-sm font-medium rounded-full">
                      Current stage: Building consistency
                    </Badge>
                    <Badge className="bg-[#F7F9FC] text-gray-700 border-[#E7ECF5] px-4 py-2 text-sm font-medium rounded-full">
                      Confidence level: Steady growth
                    </Badge>
                    <Badge className="bg-[#F7F9FC] text-gray-700 border-[#E7ECF5] px-4 py-2 text-sm font-medium rounded-full">
                      Target: Grade 8 (March 2026)
                    </Badge>
                  </div>

                  <div className="bg-[#F7F9FC] rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2E5BFF]/5 to-transparent" />
                    <div className="relative z-10">
                      <p className="text-gray-700 leading-relaxed">
                        Mentiora's AI coach adapts your plan every week to keep you moving toward your target — one smart step at a time.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#2E5BFF]/10 rounded-full blur-3xl" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="bg-[#2E5BFF] hover:bg-[#2E5BFF]/90 text-white rounded-full px-6 py-6 text-base font-medium shadow-md hover:shadow-lg transition-all"
                      onClick={() => navigate('/practice')}
                    >
                      Follow my next step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-gray-700 hover:bg-[#F7F9FC] rounded-full px-6 py-6 text-base font-medium"
                    >
                      See full roadmap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 1 - Your Growth Path */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Your progress so far</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  You've improved steadily this month.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E5BFF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2E5BFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7ECF5" />
                      <XAxis 
                        dataKey="week" 
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #E7ECF5',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#2E5BFF" 
                        strokeWidth={3}
                        dot={{ fill: '#2E5BFF', r: 5 }}
                        activeDot={{ r: 7 }}
                        fill="url(#colorScore)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  Keep the same rhythm — small improvements add up.
                </p>

                <div className="bg-[#F7F9FC] rounded-xl p-4 border border-[#E7ECF5]">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg">
                      <Target className="h-5 w-5 text-[#2E5BFF]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Stay consistent — your next improvement checkpoint is in 6 days.
                      </p>
                      <Button 
                        variant="link" 
                        className="text-[#2E5BFF] p-0 h-auto font-medium text-sm"
                      >
                        Prepare for next checkpoint
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 - Your Focus Areas */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Your Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strong Foundations */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strong Foundations</h3>
                    <div className="space-y-2">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Cell Biology</p>
                        <p className="text-sm text-gray-600">solid understanding</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Electric Circuits</p>
                        <p className="text-sm text-gray-600">reliable accuracy</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Romeo & Juliet</p>
                        <p className="text-sm text-gray-600">strong analysis skills</p>
                      </div>
                    </div>
                  </div>

                  {/* Next to Strengthen */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Next to Strengthen</h3>
                    <div className="space-y-2">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Enzymes</p>
                        <p className="text-sm text-gray-600">clarify function points</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Forces</p>
                        <p className="text-sm text-gray-600">improve worded explanations</p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="font-medium text-gray-900">Climate Change</p>
                        <p className="text-sm text-gray-600">practise 6-mark structure</p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-6 text-center">
                  These are automatically prioritised for you in your next practice plan.
                </p>
              </CardContent>
            </Card>

            {/* Section 3 - How You Learn Best */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-[#F7F9FF]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">How You Learn Best</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border border-[#E7ECF5]">
                    <div className="p-2 bg-[#F7F9FC] rounded-lg">
                      <Clock className="h-5 w-5 text-[#2E5BFF]" />
                    </div>
                    <p className="text-gray-700">You study best between 6–8 PM.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border border-[#E7ECF5]">
                    <div className="p-2 bg-[#F7F9FC] rounded-lg">
                      <Zap className="h-5 w-5 text-[#2E5BFF]" />
                    </div>
                    <p className="text-gray-700">Short 10-minute sessions give you the best recall.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border border-[#E7ECF5]">
                    <div className="p-2 bg-[#F7F9FC] rounded-lg">
                      <Brain className="h-5 w-5 text-[#2E5BFF]" />
                    </div>
                    <p className="text-gray-700">Your memory improves most after revisiting a topic twice within a week.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border border-[#E7ECF5]">
                    <div className="p-2 bg-[#F7F9FC] rounded-lg">
                      <BookOpen className="h-5 w-5 text-[#2E5BFF]" />
                    </div>
                    <p className="text-gray-700">You revise 20% more effectively when you start with weaker topics.</p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button 
                    variant="link" 
                    className="text-[#2E5BFF] font-medium"
                  >
                    Optimise my plan →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 - Consistency = Confidence */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">You're becoming unstoppable.</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-[#2E5BFF]">7</span>
                      <span className="text-2xl text-gray-700">-day streak</span>
                      <Flame className="h-8 w-8 text-orange-500" />
                    </div>

                    <div className="flex justify-center gap-2">
                      {streakDays.map((completed, index) => (
                        <div key={index} className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          completed 
                            ? 'bg-[#2E5BFF] text-white' 
                            : 'bg-[#F7F9FC] text-gray-400'
                        }`}>
                          {completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-700">
                      Every day you show up moves you closer to your goal.
                    </p>
                  </div>

                  <div className="bg-[#F7F9FC] rounded-xl p-6 border-l-4 border-[#2E5BFF]">
                    <p className="text-gray-700 italic">
                      "Don't chase perfection — chase consistency. You're doing that."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 - Next Best Step */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-b from-[#EAF2FF] to-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <Target className="h-6 w-6 text-[#2E5BFF]" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Next Focus: Short Physics Drill (10 mins)
                      </h3>
                      <p className="text-gray-600">
                        Focus on 'Forces and Motion' — repeat this section to boost confidence.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="bg-[#2E5BFF] hover:bg-[#2E5BFF]/90 text-white rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-all"
                        onClick={() => navigate('/practice')}
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Now
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-[#E7ECF5] text-gray-700 hover:bg-[#F7F9FC] rounded-full px-8 py-6 text-base font-medium"
                      >
                        <Shuffle className="mr-2 h-5 w-5" />
                        Change Task
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600">
                      Follow this step. Your coach will adjust after completion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Best Study Time */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#F7F9FC] rounded-lg">
                    <Clock className="h-5 w-5 text-[#2E5BFF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Best Study Time</h4>
                    <p className="text-sm text-gray-600">
                      Evening sessions suit your rhythm — we'll keep planning around that.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mindset Quote */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#2E5BFF] mt-1" />
                  <p className="text-sm text-gray-700 italic">
                    "Small progress every day becomes unstoppable results."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Mission */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-[#2E5BFF] to-[#4A7BFF]">
              <CardContent className="p-6 text-white">
                <h4 className="font-semibold mb-2">Weekly Mission</h4>
                <p className="text-sm mb-4 text-white/90">
                  Complete 3 revision sessions this week to hit your next milestone.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>1 of 3 done</span>
                </div>
                <ProgressBar value={33} className="mt-3 bg-white/20" />
              </CardContent>
            </Card>

            {/* Encouragement */}
            <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🌟</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Keep Going!</h4>
                    <p className="text-sm text-gray-700">
                      You're doing better than you think — keep going!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E7ECF5] shadow-lg">
        <Button 
          className="w-full bg-[#2E5BFF] hover:bg-[#2E5BFF]/90 text-white rounded-full py-6 text-base font-medium shadow-md"
          onClick={() => navigate('/practice')}
        >
          <Play className="mr-2 h-5 w-5" />
          Continue to next task
        </Button>
      </div>
    </div>
  );
};

export default Progress;
