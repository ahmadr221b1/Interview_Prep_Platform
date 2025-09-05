import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  FileText,
  Search,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  Calendar,
  Upload
} from 'lucide-react';

interface ResumeVersion {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'processed' | 'processing' | 'failed';
  version: number;
  fileSize: string;
}

export function ResumeHistory() {
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  useEffect(() => {
    loadResumeHistory();
  }, []);

  const loadResumeHistory = () => {
    // Mock data - in real app, this would come from your backend
    const mockResumes: ResumeVersion[] = [
      {
        id: '1',
        fileName: 'john_doe_resume_v3.pdf',
        uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'processed',
        version: 3,
        fileSize: '245 KB'
      },
      {
        id: '2',
        fileName: 'john_doe_resume_v2.pdf',
        uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'processed',
        version: 2,
        fileSize: '238 KB'
      },
      {
        id: '3',
        fileName: 'john_doe_resume_v1.docx',
        uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'processed',
        version: 1,
        fileSize: '156 KB'
      },
      {
        id: '4',
        fileName: 'software_engineer_resume.pdf',
        uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'failed',
        version: 1,
        fileSize: '412 KB'
      }
    ];

    setResumes(mockResumes);
  };

  const filteredAndSortedResumes = resumes
    .filter(resume =>
      resume.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else {
        return a.fileName.localeCompare(b.fileName);
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleDownload = (resume: ResumeVersion) => {
    // Mock download functionality
    console.log('Downloading:', resume.fileName);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Resume History</h1>
            <p className="text-gray-600">
              View and manage all your resume versions
            </p>
          </div>
          <Link to="/resume/upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload New Resume
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search resumes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by {sortBy === 'date' ? 'Date' : 'Name'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                <FileText className="h-4 w-4 mr-2" />
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Resume List */}
      {filteredAndSortedResumes.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">No resumes found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search term' : 'Upload your first resume to get started'}
            </p>
            <Link to="/resume/upload">
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedResumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 mb-1">{resume.fileName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Version {resume.version}</span>
                        <span>•</span>
                        <span>{formatDate(resume.uploadDate)}</span>
                        <span>•</span>
                        <span>{resume.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(resume.status)}>
                      {resume.status}
                    </Badge>

                    {resume.status === 'processed' && (
                      <div className="flex items-center gap-2">
                        <Link to={`/resume/refine/${resume.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(resume)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {resume.status === 'processed' && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to={`/resume/refine/${resume.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(resume)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl text-gray-900 mb-1">{resumes.length}</p>
              <p className="text-sm text-gray-600">Total Resumes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl text-gray-900 mb-1">
                {resumes.filter(r => r.status === 'processed').length}
              </p>
              <p className="text-sm text-gray-600">Successfully Processed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl text-gray-900 mb-1">
                {Math.max(...resumes.map(r => r.version), 0)}
              </p>
              <p className="text-sm text-gray-600">Latest Version</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}