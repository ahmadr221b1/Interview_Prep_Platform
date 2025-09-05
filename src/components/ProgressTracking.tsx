import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Award,
  BarChart3,
  FileText,
  Mic,
  Clock,
  Star
} from 'lucide-react';

interface ProgressData {
  date: string;
  overallScore: number;
  starScore: number;
  clarityScore: number;
  pacingScore: number;
  confidenceScore: number;
  type: 'interview' | 'resume';
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: 'overall' | 'star' | 'clarity' | 'pacing';
  deadline: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function ProgressTracking() {
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  const [activeTab, setActiveTab] = useState('overview');
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadProgressData();
    loadGoals();
  }, []);

  const loadProgressData = () => {
    // Mock progress data
    const mockData: ProgressData[] = [
      {
        date: '2024-01-15',
        overallScore: 65,
        starScore: 60,
        clarityScore: 70,
        pacingScore: 55,
        confidenceScore: 62,
        type: 'interview'
      },
      {
        date: '2024-01-22',
        overallScore: 68,
        starScore: 65,
        clarityScore: 72,
        pacingScore: 58,
        confidenceScore: 67,
        type: 'interview'
      },
      {
        date: '2024-02-05',
        overallScore: 72,
        starScore: 70,
        clarityScore: 75,
        pacingScore: 62,
        confidenceScore: 71,
        type: 'interview'
      },
      {
        date: '2024-02-18',
        overallScore: 74,
        starScore: 72,
        clarityScore: 78,
        pacingScore: 65,
        confidenceScore: 73,
        type: 'interview'
      },
      {
        date: '2024-03-02',
        overallScore: 78,
        starScore: 75,
        clarityScore: 82,
        pacingScore: 68,
        confidenceScore: 77,
        type: 'interview'
      },
      {
        date: '2024-03-15',
        overallScore: 81,
        starScore: 78,
        clarityScore: 85,
        pacingScore: 72,
        confidenceScore: 80,
        type: 'interview'
      }
    ];
    setProgressData(mockData);
  };

  const loadGoals = () => {
    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Achieve 85% Overall Score',
        target: 85,
        current: 78,
        category: 'overall',
        deadline: '2024-04-01'
      },
      {
        id: '2',
        title: 'Master STAR Methodology',
        target: 80,
        current: 72,
        category: 'star',
        deadline: '2024-03-30'
      },
      {
        id: '3',
        title: 'Improve Speaking Clarity',
        target: 90,
        current: 85,
        category: 'clarity',
        deadline: '2024-04-15'
      }
    ];
    setGoals(mockGoals);
  };

  const getLatestScore = () => {
    if (progressData.length === 0) return 0;
    return progressData[progressData.length - 1].overallScore;
  };

  const getImprovement = () => {
    if (progressData.length < 2) return 0;
    const latest = progressData[progressData.length - 1].overallScore;
    const previous = progressData[0].overallScore;
    return latest - previous;
  };

  const getStreakCount = () => {
    // Mock streak calculation
    return 7;
  };

  const getTotalSessions = () => {
    return progressData.length;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGoalProgress = (goal: Goal) => {
    return Math.round((goal.current / goal.target) * 100);
  };

  const getGoalColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const skillDistribution = [
    { name: 'STAR Method', value: 72, color: '#3B82F6' },
    { name: 'Clarity', value: 85, color: '#10B981' },
    { name: 'Pacing', value: 68, color: '#F59E0B' },
    { name: 'Confidence', value: 80, color: '#8B5CF6' }
  ];

  const improvement = getImprovement();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Progress Tracking</h1>
        <p className="text-gray-600">
          Monitor your interview performance and track improvement over time
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latest Score</p>
                <p className="text-2xl text-gray-900">{getLatestScore()}%</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Improvement</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl text-gray-900">+{improvement}</p>
                  {improvement > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Session Streak</p>
                <p className="text-2xl text-gray-900">{getStreakCount()}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-2xl text-gray-900">{getTotalSessions()}</p>
              </div>
              <Mic className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overall Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
                <CardDescription>
                  Your interview scores over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                        formatter={(value: number) => [`${value}%`, 'Score']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="overallScore" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skills Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Breakdown</CardTitle>
                <CardDescription>
                  Current performance across different areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interview sessions and improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.slice(-3).reverse().map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mic className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-900">Mock Interview Session</h4>
                        <p className="text-xs text-gray-600">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-100 text-blue-800 mb-1">
                        {session.overallScore}%
                      </Badge>
                      <p className="text-xs text-gray-600">Overall Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Trends</CardTitle>
              <CardDescription>
                Track improvement across specific skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      labelFormatter={(label) => `Date: ${formatDate(label as string)}`}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="overallScore" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Overall"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="starScore" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="STAR Method"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clarityScore" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="Clarity"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pacingScore" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Pacing"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Goals</CardTitle>
                  <CardDescription>
                    Track your progress toward specific targets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goals.map((goal) => {
                      const progress = getGoalProgress(goal);
                      const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                      
                      return (
                        <div key={goal.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm text-gray-900">{goal.title}</h4>
                            <Badge variant="outline">{daysLeft} days left</Badge>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">
                              {goal.current}% / {goal.target}%
                            </span>
                            <span className="text-xs text-gray-600">
                              {progress}% complete
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getGoalColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Set New Goal</CardTitle>
                  <CardDescription>
                    Create a new improvement target
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border rounded-lg text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="text-sm text-gray-900">Overall Score</h4>
                            <p className="text-xs text-gray-600">Improve total performance</p>
                          </div>
                        </div>
                      </button>
                      
                      <button className="p-4 border rounded-lg text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <div>
                            <h4 className="text-sm text-gray-900">STAR Method</h4>
                            <p className="text-xs text-gray-600">Master structured responses</p>
                          </div>
                        </div>
                      </button>
                      
                      <button className="p-4 border rounded-lg text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Mic className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className="text-sm text-gray-900">Speaking Clarity</h4>
                            <p className="text-xs text-gray-600">Improve articulation</p>
                          </div>
                        </div>
                      </button>
                      
                      <button className="p-4 border rounded-lg text-left hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <div>
                            <h4 className="text-sm text-gray-900">Response Pacing</h4>
                            <p className="text-xs text-gray-600">Optimize speaking speed</p>
                          </div>
                        </div>
                      </button>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      Create Custom Goal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Session History</CardTitle>
              <CardDescription>
                Complete history of your practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.reverse().map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mic className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-gray-900">Mock Interview Session</h4>
                        <p className="text-sm text-gray-600">{formatDate(session.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{session.overallScore}%</div>
                        <div className="text-xs text-gray-600">Overall</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{session.starScore}%</div>
                        <div className="text-xs text-gray-600">STAR</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">{session.clarityScore}%</div>
                        <div className="text-xs text-gray-600">Clarity</div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}