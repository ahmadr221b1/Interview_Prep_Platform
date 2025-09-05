import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Download,
  ArrowLeft,
  FileText,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Copy,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ResumeData {
  id: string;
  fileName: string;
  uploadDate: string;
  extractedText: string;
  status: string;
}

interface Suggestion {
  type: 'improvement' | 'keyword' | 'format' | 'content';
  title: string;
  description: string;
  original?: string;
  improved?: string;
  priority: 'high' | 'medium' | 'low';
}

export function ResumeRefinement() {
  const { id } = useParams<{ id: string }>();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [refinedContent, setRefinedContent] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState('refined');

  useEffect(() => {
    if (id) {
      const savedData = localStorage.getItem(`resume_${id}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setResumeData(data);
        processResume(data);
      }
    }
  }, [id]);

  const processResume = async (data: ResumeData) => {
    setIsRefining(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock refined content
    const mockRefinedContent = `JOHN DOE
Senior Software Engineer | Full-Stack Developer

PROFESSIONAL SUMMARY
Results-driven Senior Software Engineer with 6+ years of experience developing scalable web applications and leading cross-functional teams. Proven track record of delivering high-quality software solutions that drive business growth and improve user experience. Expertise in React, Node.js, Python, and cloud technologies.

CORE COMPETENCIES
• Frontend Development: React, TypeScript, JavaScript, HTML5, CSS3, Redux
• Backend Development: Node.js, Python, Express.js, RESTful APIs, GraphQL
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Jenkins
• Databases: PostgreSQL, MongoDB, Redis
• Project Management: Agile, Scrum, Cross-functional team leadership

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2021 - Present
• Led development of customer-facing web application serving 100K+ daily active users
• Implemented microservices architecture resulting in 40% improvement in system performance
• Mentored 3 junior developers and established code review best practices
• Collaborated with product managers to define technical requirements and project timelines

Software Engineer | StartupXYZ | San Francisco, CA | 2019 - 2021
• Developed responsive web applications using React and Node.js
• Built RESTful APIs and integrated third-party services
• Optimized database queries reducing response time by 60%
• Participated in agile development process and daily standups

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2019

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate (2022)
• Certified Scrum Master (2021)`;

    // Mock suggestions
    const mockSuggestions: Suggestion[] = [
      {
        type: 'improvement',
        title: 'Enhanced Professional Summary',
        description: 'Added quantifiable achievements and specific technologies',
        original: 'Software engineer with experience in web development.',
        improved: 'Results-driven Senior Software Engineer with 6+ years of experience developing scalable web applications and leading cross-functional teams.',
        priority: 'high'
      },
      {
        type: 'keyword',
        title: 'Added Industry Keywords',
        description: 'Included relevant technical keywords to improve ATS scanning',
        priority: 'high'
      },
      {
        type: 'content',
        title: 'Quantified Achievements',
        description: 'Added specific metrics and numbers to demonstrate impact',
        original: 'Improved system performance',
        improved: 'Implemented microservices architecture resulting in 40% improvement in system performance',
        priority: 'medium'
      },
      {
        type: 'format',
        title: 'Consistent Formatting',
        description: 'Standardized bullet points and section headers',
        priority: 'low'
      }
    ];

    setRefinedContent(mockRefinedContent);
    setSuggestions(mockSuggestions);
    setIsRefining(false);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([refinedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `refined_${resumeData?.fileName || 'resume'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Resume downloaded successfully!');
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(refinedContent);
    toast.success('Content copied to clipboard!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="h-4 w-4" />;
      case 'keyword': return <Lightbulb className="h-4 w-4" />;
      case 'format': return <FileText className="h-4 w-4" />;
      case 'content': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (!resumeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Resume not found. Please upload a resume first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/resume/upload">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl text-gray-900 mb-2">Resume Refinement</h1>
          <p className="text-gray-600">
            AI-powered improvements for your resume
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRefining ? (
            <div className="flex items-center gap-2 text-blue-600">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={handleCopyContent}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Content
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </>
          )}
        </div>
      </div>

      {/* File Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-gray-900">{resumeData.fileName}</h3>
              <p className="text-sm text-gray-600">
                Uploaded on {new Date(resumeData.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="refined">Refined Resume</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions ({suggestions.length})</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
        </TabsList>

        <TabsContent value="refined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Resume</CardTitle>
              <CardDescription>
                Your resume with AI-powered improvements and optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRefining ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg text-gray-900 mb-2">Processing Your Resume</h3>
                    <p className="text-sm text-gray-600">
                      Our AI is analyzing and improving your resume...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">
                    {refinedContent}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{suggestion.title}</h3>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {suggestion.description}
                      </p>
                      {suggestion.original && suggestion.improved && (
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">BEFORE:</h4>
                            <div className="bg-red-50 p-3 rounded text-sm text-gray-900">
                              {suggestion.original}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">AFTER:</h4>
                            <div className="bg-green-50 p-3 rounded text-sm text-gray-900">
                              {suggestion.improved}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="original" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Original Content</CardTitle>
              <CardDescription>
                The extracted text from your uploaded resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-6 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-900 leading-relaxed">
                  {resumeData.extractedText}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}