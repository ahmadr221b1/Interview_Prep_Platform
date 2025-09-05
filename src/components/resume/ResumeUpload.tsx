import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content?: string;
}

export function ResumeUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PDF or DOCX file';
    }
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploadedFile({
      name: file.name,
      size: file.size,
      type: file.type
    });

    setIsProcessing(true);
    setProgress(0);

    // Simulate file processing
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate file upload and text extraction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress(100);
      
      // Save mock resume data
      const resumeId = Date.now().toString();
      const mockResumeData = {
        id: resumeId,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        extractedText: 'Mock extracted text from resume...',
        status: 'processed'
      };

      localStorage.setItem(`resume_${resumeId}`, JSON.stringify(mockResumeData));
      
      // Redirect to refinement page
      setTimeout(() => {
        navigate(`/resume/refine/${resumeId}`);
      }, 1000);
      
    } catch (error) {
      setError('Failed to process file. Please try again.');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    setProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Upload Resume</h1>
        <p className="text-gray-600">
          Upload your resume to get AI-powered feedback and improvements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Resume</CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX (Max 5MB)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!uploadedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">
                    Drag and drop your resume here
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Or click to browse files
                  </p>
                  <Button onClick={handleUploadClick}>
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* File Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="text-sm text-gray-900">{uploadedFile.name}</h4>
                      <p className="text-xs text-gray-600">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                    {!isProcessing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Processing Progress */}
                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {progress < 50 ? 'Uploading...' : 
                           progress < 90 ? 'Extracting text...' : 
                           'Processing complete!'}
                        </span>
                        <span className="text-sm text-gray-900">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}

                  {/* Success State */}
                  {progress === 100 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">Processing complete! Redirecting...</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900">Text Extraction</h4>
                  <p className="text-xs text-gray-600">
                    We extract text content from your resume
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900">AI Analysis</h4>
                  <p className="text-xs text-gray-600">
                    Our AI analyzes content and suggests improvements
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="text-sm text-gray-900">Enhanced Resume</h4>
                  <p className="text-xs text-gray-600">
                    Download your improved resume with better formatting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Use clear, readable fonts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Include relevant keywords</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Keep formatting simple</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>Ensure text is not embedded in images</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}