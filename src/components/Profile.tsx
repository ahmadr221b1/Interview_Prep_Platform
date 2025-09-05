import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import {
  User as UserIcon,
  Camera,
  Eye,
  EyeOff,
  Save,
  Upload,
  Shield,
  Mail,
  MapPin,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { User } from '../App';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

interface ProfileFormData {
  name: string;
  email: string;
  city: string;
  state: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function Profile({ user, onUpdateUser }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: user.name || '',
    email: user.email || '',
    city: user.city || '',
    state: user.state || ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(user.profilePicture || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser: User = {
        ...user,
        name: profileForm.name,
        email: profileForm.email,
        city: profileForm.city,
        state: profileForm.state,
        profilePicture: profilePicture || user.profilePicture
      };

      onUpdateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password form
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call for password change
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password. Please check your current password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Create a preview URL
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfilePicture(imageUrl);
      toast.success('Profile picture updated!');
    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    toast.success('Profile picture removed.');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Unknown';
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profilePicture || undefined} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <label htmlFor="profile-picture" className="cursor-pointer">
                      <Button type="button" variant="outline" disabled={isUploadingImage}>
                        <Camera className="h-4 w-4 mr-2" />
                        {isUploadingImage ? 'Uploading...' : 'Change Picture'}
                      </Button>
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                    {profilePicture && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeProfilePicture}
                        disabled={isUploadingImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        name: e.target.value
                      }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({
                          ...prev,
                          email: e.target.value
                        }))}
                        required
                      />
                      {user.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                      )}
                    </div>
                    {user.isVerified && (
                      <p className="text-sm text-green-600">Verified email address</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={profileForm.city}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        city: e.target.value
                      }))}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={profileForm.state}
                      onChange={(e) => setProfileForm(prev => ({
                        ...prev,
                        state: e.target.value
                      }))}
                      placeholder="Enter your state"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Ensure your account stays secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        current: !prev.current
                      }))}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        new: !prev.new
                      }))}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {passwordForm.newPassword && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Password strength:</span>
                        <span className={`${
                          passwordStrength <= 2 ? 'text-red-600' :
                          passwordStrength <= 3 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {getPasswordStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        confirm: !prev.confirm
                      }))}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="text-sm text-red-600">Passwords do not match</p>
                  )}
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Password requirements:</strong>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Contains at least one number</li>
                      <li>• Special characters recommended</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isLoading || passwordForm.newPassword !== passwordForm.confirmPassword}>
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Additional security information for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="text-sm text-gray-900">Email Verification</h4>
                    <p className="text-sm text-gray-600">
                      {user.isVerified ? 'Your email is verified' : 'Email not verified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  {user.isVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Button variant="outline" size="sm">
                      Verify Email
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="text-sm text-gray-900">Location Information</h4>
                    <p className="text-sm text-gray-600">
                      {user.city && user.state ? `${user.city}, ${user.state}` : 'Location not set'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>
                Customize your experience and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Notification preferences and other settings will be available in future updates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}