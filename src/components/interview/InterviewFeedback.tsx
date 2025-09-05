import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  MessageSquare,
  Star,
  Target,
  Lightbulb,
  BarChart3,
  Volume2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText
} from 'lucide-react';

interface InterviewFeedback {
  sessionId: string;
  overallScore: number;
  starScore: number;
  clarityScore: number;
  pacingScore: number;
  fillerWordCount: number;
  avgResponseTime: number;
  totalDuration: number;
  questionsAnswered: number;
  strengths: string[];
  improvements: string[];
  starAnalysis: Array<{
    questionId: number;
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
    feedback: string;
  }>;
  speechMetrics: {
    wordsPerMinute: number;
    pauseCount: number;
    confidenceLevel: number;
  };
}

export function InterviewFeedback() {
  const { id } = useParams<{ id: string }>();
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      generateFeedback(id);
    }
  }, [id]);

  const generateFeedback = async (sessionId: string) => {
    setIsLoading(true);

    // Simulate comprehensive AI analysis - longer processing time for voice analysis
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Mock feedback data with enhanced voice-specific metrics
    const mockFeedback: InterviewFeedback = {
      sessionId,
      overallScore: 78,
      starScore: 72,
      clarityScore: 85,
      pacingScore: 68,
      fillerWordCount: 12,
      avgResponseTime: 45,
      totalDuration: 1200, // 20 minutes
      questionsAnswered: 5,
      strengths: [
        'Excellent voice clarity and articulation throughout the interview',
        'Strong use of specific examples with quantifiable results',
        'Confident and natural speaking style',
        'Good emotional intelligence in behavioral responses',
        'Effective pause usage for emphasis'
      ],
      improvements: [
        'Reduce speaking pace by 10-15% for optimal comprehension',
        'Include more detailed "Result" components in STAR responses',
        'Minimize filler words - detected "um" (8x) and "uh" (4x)',
        'Provide more context in situation setup',
        'Practice smoother transitions between STAR components'
      ],
      starAnalysis: [
        {
          questionId: 1,
          situation: true,
          task: true,
          action: true,
          result: false,
          feedback: 'Good situation and task setup with clear context. Actions were well-described with specific steps taken. Missing quantifiable results - consider adding metrics or outcomes achieved.'
        },
        {
          questionId: 2,
          situation: true,
          task: true,
          action: true,
          result: true,
          feedback: 'Excellent complete STAR structure. Situation was clearly set with proper context, task was well-defined, actions were specific and detailed, and results included measurable outcomes.'
        },
        {
          questionId: 5,
          situation: true,
          task: false,
          action: true,
          result: true,
          feedback: 'Strong situation description and clear actions taken. Results were positive and specific. The task component could be more explicitly defined - what exactly was your responsibility?'
        }
      ],
      speechMetrics: {
        wordsPerMinute: 165,
        pauseCount: 23,
        confidenceLevel: 82
      }
    };

    setFeedback(mockFeedback);
    setIsLoading(false);

    // Save feedback to localStorage
    localStorage.setItem(`feedback_${sessionId}`, JSON.stringify(mockFeedback));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPacingFeedback = (wpm: number) => {
    if (wpm > 180) return 'Too fast - consider slowing down';
    if (wpm < 120) return 'Too slow - try to increase pace';
    return 'Good pacing for interview context';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-500" />
            <h2 className="text-2xl text-gray-900 mb-4">Analyzing Your Interview</h2>
            <p className="text-gray-600 mb-4">
              Our AI is processing your responses and generating personalized feedback...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ Transcribing audio responses</p>
              <p>✓ Analyzing STAR methodology</p>
              <p>✓ Evaluating speech patterns</p>
              <p>⏳ Generating improvement suggestions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Feedback not found. Please complete an interview first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/interview/mock">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Interview
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl text-gray-900 mb-2">Interview Feedback</h1>
        <p className="text-gray-600">
          Detailed analysis of your interview performance with personalized improvement suggestions
        </p>
      </div>

      {/* Overall Score */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-4">
              <span className={`text-3xl ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}
              </span>
            </div>
            <h2 className="text-2xl text-gray-900 mb-2">Overall Performance</h2>
            <p className="text-gray-600">
              {feedback.overallScore >= 80 ? 'Excellent performance!' :
               feedback.overallScore >= 70 ? 'Good performance with room for improvement' :
               'Areas for improvement identified'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">{feedback.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">{formatTime(feedback.totalDuration)}</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">{feedback.avgResponseTime}s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">{feedback.fillerWordCount}</div>
              <div className="text-sm text-gray-600">Filler Words</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="star">STAR Analysis</TabsTrigger>
          <TabsTrigger value="speech">Speech Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Breakdown */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
                <CardDescription>
                  Detailed scores across different evaluation criteria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">STAR Methodology</span>
                    <Badge className={getScoreBadgeColor(feedback.starScore)}>
                      {feedback.starScore}%
                    </Badge>
                  </div>
                  <Progress value={feedback.starScore} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Clarity & Articulation</span>
                    <Badge className={getScoreBadgeColor(feedback.clarityScore)}>
                      {feedback.clarityScore}%
                    </Badge>
                  </div>
                  <Progress value={feedback.clarityScore} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Pacing & Flow</span>
                    <Badge className={getScoreBadgeColor(feedback.pacingScore)}>
                      {feedback.pacingScore}%
                    </Badge>
                  </div>
                  <Progress value={feedback.pacingScore} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Confidence Level</span>
                    <Badge className={getScoreBadgeColor(feedback.speechMetrics.confidenceLevel)}>
                      {feedback.speechMetrics.confidenceLevel}%
                    </Badge>
                  </div>
                  <Progress value={feedback.speechMetrics.confidenceLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feedback.strengths.slice(0, 3).map((strength, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Improvements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feedback.improvements.slice(0, 3).map((improvement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="star" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>STAR Methodology Analysis</CardTitle>
              <CardDescription>
                Evaluation of your responses using the Situation, Task, Action, Result framework
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedback.starAnalysis.map((analysis, index) => (
                  <div key={index} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg text-gray-900">Question {analysis.questionId}</h3>
                      <div className="flex items-center gap-2">
                        {['situation', 'task', 'action', 'result'].map((component) => (
                          <div
                            key={component}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                              analysis[component as keyof typeof analysis] 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}
                          >
                            {component[0].toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          analysis.situation ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Situation</span>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          analysis.task ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Task</span>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          analysis.action ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Action</span>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          analysis.result ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-600">Result</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded">
                      <h4 className="text-sm text-gray-700 mb-2">Feedback:</h4>
                      <p className="text-sm text-gray-600">{analysis.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speech" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Speech Patterns</CardTitle>
                <CardDescription>
                  Analysis of your speaking style and delivery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Words per Minute</span>
                    <span className="text-sm font-medium">{feedback.speechMetrics.wordsPerMinute}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {getPacingFeedback(feedback.speechMetrics.wordsPerMinute)}
                  </div>
                  <Progress value={Math.min((feedback.speechMetrics.wordsPerMinute / 200) * 100, 100)} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Filler Words</span>
                    <span className="text-sm font-medium">{feedback.fillerWordCount}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {feedback.fillerWordCount <= 5 ? 'Excellent control' :
                     feedback.fillerWordCount <= 15 ? 'Room for improvement' :
                     'Needs significant improvement'}
                  </div>
                  <Progress value={Math.max(100 - (feedback.fillerWordCount * 5), 0)} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700">Pauses</span>
                    <span className="text-sm font-medium">{feedback.speechMetrics.pauseCount}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Natural pauses help with clarity
                  </div>
                  <Progress value={Math.min((feedback.speechMetrics.pauseCount / 50) * 100, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Improvement Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Volume2 className="h-5 w-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">Speaking Pace</h4>
                    <p className="text-xs text-gray-600">
                      Aim for 140-160 words per minute for optimal comprehension in interviews.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">Reduce Fillers</h4>
                    <p className="text-xs text-gray-600">
                      Practice pausing instead of using "um" or "uh". Silent pauses are powerful.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="text-sm text-gray-900 mb-1">Confidence Building</h4>
                    <p className="text-xs text-gray-600">
                      Practice your responses to common questions to increase confidence and fluency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Top Strengths
                </CardTitle>
                <CardDescription>
                  Areas where you performed exceptionally well
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-yellow-500" />
                  Improvement Areas
                </CardTitle>
                <CardDescription>
                  Specific areas to focus on for your next interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feedback.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>
                Recommended actions to continue improving your interview skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <RefreshCw className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Practice More</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Take another mock interview to track improvement
                  </p>
                  <Link to="/interview/mock">
                    <Button size="sm" className="w-full">Start Interview</Button>
                  </Link>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Update Resume</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    Refine your resume based on interview insights
                  </p>
                  <Link to="/resume/upload">
                    <Button size="sm" variant="outline" className="w-full">Upload Resume</Button>
                  </Link>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h3 className="text-sm text-gray-900 mb-2">Track Progress</h3>
                  <p className="text-xs text-gray-600 mb-3">
                    View your improvement trends over time
                  </p>
                  <Link to="/progress">
                    <Button size="sm" variant="outline" className="w-full">View Progress</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}