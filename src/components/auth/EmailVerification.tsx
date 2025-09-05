import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Mail, ArrowLeft } from 'lucide-react';
import { User } from '../../App';

interface EmailVerificationProps {
  onLogin: (user: User) => void;
}

export function EmailVerification({ onLogin }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('pendingUser');
    if (userData) {
      setPendingUser(JSON.parse(userData));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful verification
      const verifiedUser: User = {
        id: '1',
        name: pendingUser?.name || 'John Doe',
        email: pendingUser?.email || 'user@example.com',
        isVerified: true
      };

      localStorage.removeItem('pendingUser');
      onLogin(verifiedUser);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to {pendingUser?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert>
                <AlertDescription>Verification code sent successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                className="text-center text-lg tracking-widest"
                value={verificationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setVerificationCode(value);
                  if (error) setError('');
                }}
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend'}
              </button>
            </p>
            <Link to="/signin" className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}