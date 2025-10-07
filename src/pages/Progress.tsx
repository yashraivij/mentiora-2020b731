import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, TrendingUp, Target, Clock, Zap, CheckCircle2, Circle, Flame, BookOpen, Brain, Calendar, Sparkles, Play, Shuffle, Award, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FBFF] to-white">
      {/* Header */}
      <div className="border-b border-[#E5F6FC]/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-[#3DB4E8] hover:text-[#4AC3F7] hover:bg-[#F0FBFF] transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent">Your Progress</h1>
          <div className="w-24" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Section - Your Journey */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-white to-[#F0FBFF] animate-fade-in">
              <CardContent className="p-8 md:p-10">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                      Your journey to your target grade
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      You're on track. Keep following your plan and your next grade milestone is within reach.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-gradient-to-r from-[#3DB4E8]/10 to-[#5DD4FF]/10 text-[#3DB4E8] border-[#3DB4E8]/20 px-5 py-2.5 text-sm font-semibold rounded-full hover:scale-105 transition-transform">
                      <Circle className="h-3 w-3 mr-2 fill-[#3DB4E8]" />
                      Building consistency
                    </Badge>
                    <Badge className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-500/20 px-5 py-2.5 text-sm font-semibold rounded-full hover:scale-105 transition-transform">
                      <TrendingUp className="h-3 w-3 mr-2" />
                      Steady growth
                    </Badge>
                    <Badge className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20 px-5 py-2.5 text-sm font-semibold rounded-full hover:scale-105 transition-transform">
                      <Target className="h-3 w-3 mr-2" />
                      Grade 8 (March 2026)
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] rounded-2xl p-6 relative overflow-hidden border border-[#3DB4E8]/20">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3DB4E8]/5 via-transparent to-[#5DD4FF]/5" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Sparkles className="h-5 w-5 text-[#3DB4E8]" />
                      </div>
                      <p className="text-gray-700 leading-relaxed flex-1">
                        Mentiora's AI coach adapts your plan every week to keep you moving toward your target — one smart step at a time.
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DB4E8]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#5DD4FF]/10 rounded-full blur-2xl" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#4AC3F7] hover:to-[#6DE5FF] text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      onClick={() => navigate('/practice')}
                    >
                      Follow my next step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-gray-700 hover:bg-[#F0FBFF] hover:text-[#3DB4E8] rounded-full px-8 py-6 text-base font-medium border border-gray-200 hover:border-[#3DB4E8]/30 transition-all"
                    >
                      See full roadmap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 1 - Your Growth Path */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pb-4 pt-8 px-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-[#3DB4E8]/10 to-[#5DD4FF]/10 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-[#3DB4E8]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Your progress so far</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600 pl-14">
                  You've improved steadily this month.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-8 pb-8">
                <div className="h-72 bg-gradient-to-br from-[#F0FBFF] to-white rounded-2xl p-6 border border-[#3DB4E8]/10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3DB4E8" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#5DD4FF" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5F6FC" />
                      <XAxis 
                        dataKey="week" 
                        stroke="#94A3B8"
                        style={{ fontSize: '13px', fontWeight: '500' }}
                      />
                      <YAxis 
                        stroke="#94A3B8"
                        style={{ fontSize: '13px', fontWeight: '500' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #E5F6FC',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3DB4E8" 
                        strokeWidth={3}
                        fill="url(#colorScore)"
                        dot={{ fill: '#3DB4E8', r: 6, strokeWidth: 2, stroke: 'white' }}
                        activeDot={{ r: 8, strokeWidth: 2, stroke: 'white' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-500/20 px-4 py-2 text-sm font-medium rounded-full">
                    <CheckCircle2 className="h-4 w-4 mr-1 inline" />
                    Keep the same rhythm — small improvements add up
                  </Badge>
                </div>

                <div className="bg-gradient-to-br from-[#F0FBFF] to-white rounded-2xl p-5 border border-[#3DB4E8]/20 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 font-semibold mb-2">
                        Stay consistent — your next improvement checkpoint is in 6 days
                      </p>
                      <Button 
                        variant="link" 
                        className="text-[#3DB4E8] hover:text-[#4AC3F7] p-0 h-auto font-medium text-sm"
                      >
                        Prepare for next checkpoint →
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 - Your Focus Areas */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="pt-8 px-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#3DB4E8]/10 to-[#5DD4FF]/10 rounded-xl">
                    <Award className="h-6 w-6 text-[#3DB4E8]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Your Focus Areas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Strong Foundations */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      <h3 className="text-lg font-bold text-gray-900">Strong Foundations</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Cell Biology</p>
                            <p className="text-sm text-gray-600">solid understanding</p>
                          </div>
                          <Star className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Electric Circuits</p>
                            <p className="text-sm text-gray-600">reliable accuracy</p>
                          </div>
                          <Star className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Romeo & Juliet</p>
                            <p className="text-sm text-gray-600">strong analysis skills</p>
                          </div>
                          <Star className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next to Strengthen */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-5">
                      <Target className="h-5 w-5 text-[#3DB4E8]" />
                      <h3 className="text-lg font-bold text-gray-900">Next to Strengthen</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] border border-[#3DB4E8]/30 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Enzymes</p>
                            <p className="text-sm text-gray-600">clarify function points</p>
                          </div>
                          <Zap className="h-5 w-5 text-[#3DB4E8]" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] border border-[#3DB4E8]/30 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Forces</p>
                            <p className="text-sm text-gray-600">improve worded explanations</p>
                          </div>
                          <Zap className="h-5 w-5 text-[#3DB4E8]" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] border border-[#3DB4E8]/30 rounded-2xl p-5 hover:shadow-md transition-all hover:scale-[1.02]">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">Climate Change</p>
                            <p className="text-sm text-gray-600">practise 6-mark structure</p>
                          </div>
                          <Zap className="h-5 w-5 text-[#3DB4E8]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8 pt-6 border-t border-gray-100">
                  <Badge className="bg-gradient-to-r from-[#3DB4E8]/10 to-[#5DD4FF]/10 text-[#3DB4E8] border-[#3DB4E8]/20 px-4 py-2 text-sm font-medium rounded-full">
                    <Sparkles className="h-4 w-4 mr-1 inline" />
                    Automatically prioritised in your next practice plan
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Section 3 - How You Learn Best */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#F0FBFF] to-white">
              <CardHeader className="pt-8 px-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#3DB4E8]/10 to-[#5DD4FF]/10 rounded-xl">
                    <Brain className="h-6 w-6 text-[#3DB4E8]" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">How You Learn Best</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid gap-4">
                  <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E5F6FC] hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm flex-shrink-0">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium pt-2">You study best between 6–8 PM.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E5F6FC] hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm flex-shrink-0">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium pt-2">Short 10-minute sessions give you the best recall.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E5F6FC] hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm flex-shrink-0">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium pt-2">Your memory improves most after revisiting a topic twice within a week.</p>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-[#E5F6FC] hover:shadow-md transition-all hover:scale-[1.02]">
                    <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-gray-700 font-medium pt-2">You revise 20% more effectively when you start with weaker topics.</p>
                  </div>
                </div>

                <div className="mt-8 text-center pt-6 border-t border-[#E5F6FC]">
                  <Button 
                    className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#4AC3F7] hover:to-[#6DE5FF] text-white rounded-full px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimise my plan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 - Consistency = Confidence */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardContent className="p-8 md:p-10">
                <div className="text-center space-y-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    You're becoming unstoppable.
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-6xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent">7</span>
                      <span className="text-2xl text-gray-700 font-semibold">-day streak</span>
                      <Flame className="h-10 w-10 text-orange-500 drop-shadow-lg" />
                    </div>

                    <div className="flex justify-center gap-3">
                      {streakDays.map((completed, index) => (
                        <div key={index} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          completed 
                            ? 'bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] text-white shadow-lg scale-110' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                        </div>
                      ))}
                    </div>

                    <p className="text-gray-700 text-lg font-medium">
                      Every day you show up moves you closer to your goal.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] rounded-2xl p-8 border-l-4 border-[#3DB4E8] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#3DB4E8]/10 rounded-full blur-3xl" />
                    <p className="text-gray-700 text-lg italic font-medium relative z-10">
                      "Don't chase perfection — chase consistency. You're doing that."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 - Next Best Step */}
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#F0FBFF] via-white to-[#E5F6FC]">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-2xl shadow-lg flex-shrink-0">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Next Focus: Short Physics Drill (10 mins)
                      </h3>
                      <p className="text-gray-600 text-lg">
                        Focus on 'Forces and Motion' — repeat this section to boost confidence.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#4AC3F7] hover:to-[#6DE5FF] text-white rounded-full px-10 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        onClick={() => navigate('/practice')}
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Now
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-2 border-[#3DB4E8]/30 text-gray-700 hover:bg-[#F0FBFF] hover:border-[#3DB4E8] rounded-full px-10 py-6 text-base font-semibold transition-all hover:scale-105"
                      >
                        <Shuffle className="mr-2 h-5 w-5" />
                        Change Task
                      </Button>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#3DB4E8]/20">
                      <p className="text-sm text-gray-600 font-medium">
                        <Sparkles className="h-4 w-4 inline mr-1 text-[#3DB4E8]" />
                        Follow this step. Your coach will adjust after completion.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Best Study Time */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] rounded-xl shadow-sm flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Best Study Time</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Evening sessions suit your rhythm — we'll keep planning around that.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mindset Quote */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-[#F0FBFF] to-[#E5F6FC] hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#3DB4E8] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 italic font-medium leading-relaxed">
                    "Small progress every day becomes unstoppable results."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Mission */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-white">
                <h4 className="font-bold mb-3 text-white">Weekly Mission</h4>
                <p className="text-sm mb-4 text-white/95 leading-relaxed">
                  Complete 3 revision sessions this week to hit your next milestone.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium mb-3">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>1 of 3 done</span>
                </div>
                <ProgressBar value={33} className="mt-3 bg-white/30 h-2" />
              </CardContent>
            </Card>

            {/* Encouragement */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">🌟</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Keep Going!</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
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
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-[#E5F6FC]/60 shadow-2xl">
        <Button 
          className="w-full bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#4AC3F7] hover:to-[#6DE5FF] text-white rounded-full py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
