
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Award, BookOpen, Clock, Zap, Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  // Sample data for charts
  const performanceData = [
    { date: 'Mon', score: 78, questions: 12 },
    { date: 'Tue', score: 82, questions: 15 },
    { date: 'Wed', score: 85, questions: 18 },
    { date: 'Thu', score: 79, questions: 14 },
    { date: 'Fri', score: 88, questions: 20 },
    { date: 'Sat', score: 92, questions: 16 },
    { date: 'Sun', score: 87, questions: 13 }
  ];

  const subjectData = [
    { subject: 'Biology', score: 85, color: '#10b981' },
    { subject: 'Chemistry', score: 78, color: '#8b5cf6' },
    { subject: 'Mathematics', score: 92, color: '#3b82f6' }
  ];

  const topicStrengths = [
    { topic: 'Cell Biology', mastery: 94, trend: 'up' },
    { topic: 'Algebra', mastery: 89, trend: 'up' },
    { topic: 'Atomic Structure', mastery: 82, trend: 'stable' },
    { topic: 'Genetics', mastery: 76, trend: 'down' }
  ];

  const achievements = [
    { title: '7-Day Streak', icon: Trophy, unlocked: true, description: 'Practice every day for a week' },
    { title: 'Perfect Score', icon: Target, unlocked: true, description: 'Score 100% on any test' },
    { title: 'Quick Learner', icon: Zap, unlocked: false, description: 'Complete 50 questions in one day' },
    { title: 'Subject Master', icon: Award, unlocked: false, description: 'Score 90%+ in all subjects' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Performance Analytics
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Track your progress and identify areas for improvement</p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">Overall Score</CardTitle>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 mb-1">85.3%</div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">+5.2%</span>
                <span className="text-slate-600">vs last week</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full -mr-10 -mt-10 opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700">Questions Completed</CardTitle>
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 mb-1">247</div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">32</span>
                <span className="text-slate-600">this week</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-full -mr-10 -mt-10 opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Study Time</CardTitle>
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-1">12.5h</div>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="text-green-700 font-medium">2.3h</span>
                <span className="text-slate-600">this week</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full -mr-10 -mt-10 opacity-20"></div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100/50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-amber-700">Current Streak</CardTitle>
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 mb-1">7 days</div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-amber-700 font-medium">Personal best!</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full -mr-10 -mt-10 opacity-20"></div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trend */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900">Performance Trend</CardTitle>
              <CardDescription className="text-slate-600">Your daily scores over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="url(#gradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#1d4ed8' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900">Subject Performance</CardTitle>
              <CardDescription className="text-slate-600">Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="subject" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Strengths */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900">Topic Mastery</CardTitle>
              <CardDescription className="text-slate-600">Your strongest and weakest areas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {topicStrengths.map((topic, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{topic.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">{topic.mastery}%</span>
                      {topic.trend === 'up' && <ArrowUp className="h-4 w-4 text-green-600" />}
                      {topic.trend === 'down' && <ArrowDown className="h-4 w-4 text-red-600" />}
                    </div>
                  </div>
                  <Progress 
                    value={topic.mastery} 
                    className="h-3 bg-slate-100"
                    style={{
                      background: `linear-gradient(to right, ${topic.mastery >= 90 ? '#10b981' : topic.mastery >= 70 ? '#3b82f6' : '#f59e0b'} 0%, ${topic.mastery >= 90 ? '#10b981' : topic.mastery >= 70 ? '#3b82f6' : '#f59e0b'} ${topic.mastery}%, #f1f5f9 ${topic.mastery}%)`
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900">Achievements</CardTitle>
              <CardDescription className="text-slate-600">Unlock badges by reaching milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm' 
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{achievement.title}</h4>
                        {achievement.unlocked && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
          >
            Continue Practicing
            <ArrowUp className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
