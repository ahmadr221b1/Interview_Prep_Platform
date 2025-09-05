import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Upload,
  Mic,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';
import { User } from '../App';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  // Mock data for recent activity
  const recentActivity = {
    lastResumeUpload: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    lastInterview: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    totalInterviews: 12,
    averageScore: 78,
    improvementTrend: '+15%'
  };

  const quickActions = [
    {
      title: 'Upload Resume',
      description: 'Get AI-powered feedback on your resume',
      icon: Upload,
      href: '/resume/upload',
      color: 'bg-blue-500'
    },
    {
      title: 'Mock Interview',
      description: 'Practice with AI interviewer',
      icon: Mic,
      href: '/interview/mock',
      color: 'bg-green-500'
    },
    {
      title: 'Resume History',
      description: 'View past resume versions',
      icon: FileText,
      href: '/resume/history',
      color: 'bg-purple-500'
    },
    {
      title: 'Progress Tracking',
      description: 'See your improvement over time',
      icon: TrendingUp,
      href: '/progress',
      color: 'bg-orange-500'
    }
  ];

  const recentInterviews = [
    {
      id: 1,
      type: 'Behavioral',
      score: 85,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      duration: '25 min'
    },
    {
      id: 2,
      type: 'Technical',
      score: 72,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      duration: '30 min'
    },
    {
      id: 3,
      type: 'Case Study',
      score: 78,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      duration: '45 min'
    }
  ];

  const formatDate = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Ready to continue improving your interview skills?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                <p className="text-2xl text-gray-900">{recentActivity.totalInterviews}</p>
              </div>
              <Mic className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-2xl text-gray-900">{recentActivity.averageScore}%</p>
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
                <p className="text-2xl text-green-600">{recentActivity.improvementTrend}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Session</p>
                <p className="text-sm text-gray-900">{formatDate(recentActivity.lastInterview)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump right into improving your interview skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.href} to={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`${action.color} p-3 rounded-lg`}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-gray-900 mb-1">{action.title}</h3>
                              <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Interviews</CardTitle>
              <CardDescription>
                Your latest practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-900">{interview.type}</p>
                      <p className="text-xs text-gray-600">{formatDate(interview.date)}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getScoreColor(interview.score)} mb-1`}>
                        {interview.score}%
                      </Badge>
                      <p className="text-xs text-gray-600">{interview.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/progress">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Sessions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}