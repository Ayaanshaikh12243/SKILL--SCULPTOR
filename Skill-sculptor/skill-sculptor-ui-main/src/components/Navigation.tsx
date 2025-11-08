import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, User, LogIn, UserPlus, Menu, X, Upload, Brain, Trophy, Award } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isDashboard = location.pathname === '/dashboard';
  const isQueryForm = location.pathname === '/query-form';
  const isRoadmap = location.pathname === '/roadmap';
  const isLoggedIn = localStorage.getItem('token');

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">SkillSculptor</span>
            <span className="text-xl font-bold gradient-text sm:hidden">SS</span>
          </Link>

          {/* Desktop Navigation Actions */}
          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/upload" className="flex items-center space-x-1">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/flashcards" className="flex items-center space-x-1">
                    <Brain className="w-4 h-4" />
                    <span>Flashcards</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/quiz" className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>Quiz</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/gamified-dashboard" className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Progress</span>
                  </Link>
                </Button>
              </>
            )}
            <ThemeToggle />
            {!isAuthPage && !isLoggedIn && (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login" className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-primary hover:opacity-90 border-0">
                  <Link to="/signup" className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>Get Started</span>
                  </Link>
                </Button>
              </>
            )}

            {isLoggedIn && (
              <Button variant="ghost" asChild>
                <Link to="/dashboard" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            )}

            {isAuthPage && (
              <Button variant="ghost" asChild>
                <Link to="/" className="flex items-center space-x-2">
                  <span>← Back to Home</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn && (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/upload" className="flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/flashcards" className="flex items-center space-x-2">
                      <Brain className="w-4 h-4" />
                      <span>Flashcards</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/quiz" className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>Quiz</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/gamified-dashboard" className="flex items-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Progress Dashboard</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </Button>
                </>
              )}
              {!isAuthPage && !isLoggedIn && (
                <>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/login" className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild className="w-full bg-gradient-primary hover:opacity-90 border-0">
                    <Link to="/signup" className="flex items-center space-x-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </>
              )}

              {isAuthPage && (
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/" className="flex items-center space-x-2">
                    <span>← Back to Home</span>
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}