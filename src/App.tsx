import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import { SignUp } from './components/auth/SignUp';
import { SignIn } from './components/auth/SignIn';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { EmailVerification } from './components/auth/EmailVerification';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { ResumeUpload } from './components/resume/ResumeUpload';
import { ResumeRefinement } from './components/resume/ResumeRefinement';
import { ResumeHistory } from './components/resume/ResumeHistory';
import { MockInterview } from './components/interview/MockInterview';
import { InterviewFeedback } from './components/interview/InterviewFeedback';
import { ProgressTracking } from './components/ProgressTracking';
import { Navigation } from './components/Navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  city?: string;
  state?: string;
  isVerified: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

function App() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    // Check for saved auth state in localStorage
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const login = (user: User) => {
    const newAuth = { user, isAuthenticated: true };
    setAuth(newAuth);
    localStorage.setItem('authState', JSON.stringify(newAuth));
  };

  const logout = () => {
    const newAuth = { user: null, isAuthenticated: false };
    setAuth(newAuth);
    localStorage.removeItem('authState');
  };

  const updateUser = (updatedUser: User) => {
    const newAuth = { ...auth, user: updatedUser };
    setAuth(newAuth);
    localStorage.setItem('authState', JSON.stringify(newAuth));
  };

  if (!auth.isAuthenticated) {
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/signup" element={<SignUp onLogin={login} />} />
            <Route path="/signin" element={<SignIn onLogin={login} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<EmailVerification onLogin={login} />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation user={auth.user!} onLogout={logout} />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard user={auth.user!} />} />
            <Route path="/dashboard" element={<Dashboard user={auth.user!} />} />
            <Route path="/profile" element={<Profile user={auth.user!} onUpdateUser={updateUser} />} />
            <Route path="/resume/upload" element={<ResumeUpload />} />
            <Route path="/resume/refine/:id" element={<ResumeRefinement />} />
            <Route path="/resume/history" element={<ResumeHistory />} />
            <Route path="/interview/mock" element={<MockInterview />} />
            <Route path="/interview/feedback/:id" element={<InterviewFeedback />} />
            <Route path="/progress" element={<ProgressTracking />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;