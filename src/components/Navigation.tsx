import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import {
  Home,
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  LogOut,
  Menu,
  Upload,
  History,
  Mic
} from 'lucide-react';
import { User as UserType } from '../App';

interface NavigationProps {
  user: UserType;
  onLogout: () => void;
}

export function Navigation({ user, onLogout }: NavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/resume/upload', label: 'Resume Upload', icon: Upload },
    { href: '/resume/history', label: 'Resume History', icon: History },
    { href: '/interview/mock', label: 'Mock Interview', icon: Mic },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive(item.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } ${mobile ? 'text-sm' : ''}`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-gray-900">Interview Prep</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavItems />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profilePicture} alt={user?.name || 'User'} />
                    <AvatarFallback className="text-xs bg-blue-600 text-white">
                      {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none">{user?.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}