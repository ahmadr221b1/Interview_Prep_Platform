import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Volume2,
  Clock,
  Users,
  SkipForward,
  MessageSquare,
  Loader2
} from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'behavioral' | 'technical' | 'situational';
  timeLimit: number; // in seconds
}

interface InterviewSession {
  id: string;
  startTime: Date;
  questions: Question[];
  currentQuestionIndex: number;
  responses: Array<{
    questionId: number;
    response: string;
    duration: number;
    timestamp: Date;
  }>;
  totalDuration: number;
}

type InterviewState = 'setup' | 'greeting' | 'asking' | 'listening' | 'processing' | 'complete';

export function MockInterview() {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>('setup');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [interviewType, setInterviewType] = useState<'behavioral' | 'technical' | 'mixed'>('mixed');
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  
  const navigate = useNavigate();
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mockQuestions: Question[] = [
    {
      id: 1,
      text: "Tell me about yourself and why you're interested in this position.",
      type: 'behavioral',
      timeLimit: 120
    },
    {
      id: 2,
      text: "Describe a challenging project you worked on. What was your role and how did you overcome obstacles?",
      type: 'behavioral',
      timeLimit: 180
    },
    {
      id: 3,
      text: "How would you explain a complex technical concept to a non-technical stakeholder?",
      type: 'situational',
      timeLimit: 120
    },
    {
      id: 4,
      text: "Walk me through your approach to debugging a performance issue in a web application.",
      type: 'technical',
      timeLimit: 180
    },
    {
      id: 5,
      text: "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      type: 'behavioral',
      timeLimit: 150
    }
  ];

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'en-US';

      speechRecognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);

        // Reset the listening timeout when user is speaking
        if (listeningTimeoutRef.current) {
          clearTimeout(listeningTimeoutRef.current);
        }

        // Set a timeout to detect when user stops speaking
        listeningTimeoutRef.current = setTimeout(() => {
          if (transcript.trim() && interviewState === 'listening') {
            stopListeningAndProcess();
          }
        }, 2000); // 2 seconds of silence
      };

      speechRecognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      if (sessionIntervalRef.current) {
        clearInterval(sessionIntervalRef.current);
      }
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, []);

  const startInterview = () => {
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      questions: mockQuestions,
      currentQuestionIndex: 0,
      responses: [],
      totalDuration: 0
    };

    setSession(newSession);
    setSessionTime(0);
    setInterviewState('greeting');

    // Start session timer
    sessionIntervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Start with AI greeting
    setTimeout(() => {
      speakText("Hello! Welcome to your mock interview. I'll be asking you a series of questions to help you practice. Please speak naturally and I'll listen to your responses. Let's begin with the first question.");
      
      setTimeout(() => {
        askCurrentQuestion();
      }, 8000); // Wait for greeting to finish
    }, 1000);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAISpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsAISpeaking(false);
      };
      
      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const askCurrentQuestion = () => {
    if (!session) return;

    const currentQuestion = session.questions[session.currentQuestionIndex];
    setInterviewState('asking');
    
    speakText(currentQuestion.text);

    // Start listening after AI finishes speaking
    setTimeout(() => {
      startListening();
    }, 3000);
  };

  const startListening = () => {
    if (!speechRecognitionRef.current) {
      // Fallback for browsers without speech recognition
      setTimeout(() => {
        setCurrentTranscript("This is a mock response for demonstration purposes. In a real implementation, this would be your actual spoken response transcribed in real-time.");
        setTimeout(() => {
          stopListeningAndProcess();
        }, 3000);
      }, 1000);
      setInterviewState('listening');
      return;
    }

    setInterviewState('listening');
    setCurrentTranscript('');
    
    try {
      speechRecognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListeningAndProcess = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }

    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    if (!currentTranscript.trim()) return;

    setInterviewState('processing');
    setProcessingMessage('Analyzing your response...');

    // Save the response
    if (session) {
      const newResponse = {
        questionId: session.questions[session.currentQuestionIndex].id,
        response: currentTranscript,
        duration: Math.floor(Math.random() * 60) + 30, // Mock duration
        timestamp: new Date()
      };

      setSession(prev => prev ? {
        ...prev,
        responses: [...prev.responses, newResponse]
      } : null);
    }

    // Simulate AI processing time
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    
    if (nextIndex >= session.questions.length) {
      // Interview complete
      completeInterview();
      return;
    }

    // Move to next question
    setSession(prev => prev ? {
      ...prev,
      currentQuestionIndex: nextIndex
    } : null);

    setCurrentTranscript('');
    
    // Brief pause before next question
    setTimeout(() => {
      speakText("Thank you for that response. Here's your next question.");
      setTimeout(() => {
        askCurrentQuestion();
      }, 3000);
    }, 1000);
  };

  const completeInterview = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    if (sessionIntervalRef.current) {
      clearInterval(sessionIntervalRef.current);
    }

    setInterviewState('complete');

    // Save session data
    if (session) {
      const completedSession = {
        ...session,
        totalDuration: sessionTime,
        completedAt: new Date().toISOString()
      };
      
      localStorage.setItem(`interview_${session.id}`, JSON.stringify(completedSession));
    }

    speakText("Thank you for completing the interview. I'm now generating your detailed performance report with analysis of your responses, clarity, pacing, and use of the STAR methodology.");

    // Navigate to feedback page
    setTimeout(() => {
      if (session) {
        navigate(`/interview/feedback/${session.id}`);
      }
    }, 5000);
  };

  const skipQuestion = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    if (listeningTimeoutRef.current) {
      clearTimeout(listeningTimeoutRef.current);
    }

    setCurrentTranscript('');
    moveToNextQuestion();
  };

  const endInterview = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    completeInterview();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'behavioral': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-green-100 text-green-800';
      case 'situational': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateMessage = () => {
    switch (interviewState) {
      case 'greeting': return 'AI is introducing the interview...';
      case 'asking': return 'AI is asking a question...';
      case 'listening': return 'Listening to your response...';
      case 'processing': return processingMessage;
      case 'complete': return 'Interview complete! Generating report...';
      default: return '';
    }
  };

  const getStateIcon = () => {
    switch (interviewState) {
      case 'greeting':
      case 'asking':
        return <Volume2 className="h-5 w-5 text-blue-500" />;
      case 'listening':
        return <Mic className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />;
      case 'complete':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (interviewState === 'complete') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl text-gray-900 mb-4">Interview Complete!</h2>
            <p className="text-gray-600 mb-6">
              Excellent work! I'm now analyzing your responses to provide detailed feedback on your performance, including clarity, STAR methodology usage, pacing, and confidence levels.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Duration: {formatTime(sessionTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>Questions: {session?.responses.length || 0}/{mockQuestions.length}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Generating your personalized feedback report...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Voice Interview</h1>
          <p className="text-gray-600">
            Experience a natural conversation with our AI interviewer. Just speak naturally - no buttons to press!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Interview Setup</CardTitle>
                <CardDescription>
                  Choose your interview focus area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Interview Type</label>
                  <div className="grid grid-cols-1 gap-3">
                    {(['behavioral', 'technical', 'mixed'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setInterviewType(type)}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          interviewType === type
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h3 className="text-gray-900 mb-1 capitalize">{type}</h3>
                        <p className="text-xs text-gray-600">
                          {type === 'behavioral' && 'Focus on past experiences and soft skills'}
                          {type === 'technical' && 'Technical questions and problem solving'}
                          {type === 'mixed' && 'Combination of behavioral and technical questions'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm text-gray-700 mb-3">How it works</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <span>AI asks questions out loud</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <span>Automatic voice recognition</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Real-time transcription</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>15-20 minutes total</span>
                    </div>
                  </div>
                </div>

                <Button onClick={startInterview} className="w-full" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Voice Interview
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Voice Interview Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900">Natural Conversation</h4>
                    <p className="text-xs text-gray-600">
                      The AI interviewer will speak questions aloud and listen to your responses automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900">Real-time Processing</h4>
                    <p className="text-xs text-gray-600">
                      See your words transcribed live and watch the AI process your responses
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-900">Comprehensive Analysis</h4>
                    <p className="text-xs text-gray-600">
                      Get detailed feedback on clarity, STAR method usage, pacing, and confidence
                    </p>
                  </div>
                </div>

                <Alert>
                  <Volume2 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> Ensure your microphone is working and you're in a quiet environment for the best experience.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl text-gray-900">Voice Interview</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(sessionTime)}</span>
            </div>
            <Badge variant="outline">
              Question {session.currentQuestionIndex + 1} of {session.questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className={getQuestionTypeColor(currentQuestion.type)}>
              {currentQuestion.type}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {getStateIcon()}
              <span>{getStateMessage()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h2 className="text-lg text-gray-900 mb-6">{currentQuestion.text}</h2>
          
          {/* Voice Interaction Status */}
          <div className="text-center py-8">
            {interviewState === 'listening' && (
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <Mic className="h-8 w-8 text-red-600" />
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
                </div>
                <p className="text-red-600 mb-2">Listening...</p>
                <p className="text-sm text-gray-600">Speak naturally, I'll detect when you're finished</p>
              </div>
            )}

            {interviewState === 'asking' && (
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Volume2 className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-blue-600 mb-2">AI is speaking...</p>
                <p className="text-sm text-gray-600">Listen to the question, then respond naturally</p>
              </div>
            )}

            {interviewState === 'processing' && (
              <div className="mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                </div>
                <p className="text-purple-600 mb-2">Processing...</p>
                <p className="text-sm text-gray-600">Analyzing your response and preparing next question</p>
              </div>
            )}

            {interviewState === 'greeting' && (
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 mb-2">Welcome!</p>
                <p className="text-sm text-gray-600">The AI interviewer is introducing the session</p>
              </div>
            )}
          </div>

          {/* Live Transcription */}
          {currentTranscript && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm text-gray-700 mb-2">Your Response:</h4>
              <p className="text-sm text-gray-900">{currentTranscript}</p>
              {interviewState === 'listening' && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-600">Speaking...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={endInterview}>
          End Interview
        </Button>
        
        <div className="flex items-center gap-3">
          {interviewState === 'listening' && (
            <Button variant="outline" onClick={skipQuestion}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Question
            </Button>
          )}
          <div className="text-sm text-gray-600">
            {interviewState === 'listening' ? 'Stop speaking when finished' : 'Voice controls are automatic'}
          </div>
        </div>
      </div>
    </div>
  );
}