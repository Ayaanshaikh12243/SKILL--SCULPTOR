import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Target, Map, TrendingUp, Sparkles, BookOpen, Trophy, Users, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

export default function HomePage() {
  const features = [
    {
      icon: Target,
      title: "🎯 Personalized Learning Goals",
      description: "Set your skill objectives and receive tailored learning paths designed specifically for your career aspirations.",
      emoji: "🎯"
    },
    {
      icon: Map,
      title: "🗺️ Interactive Roadmaps",
      description: "Visual step-by-step roadmaps that break down complex skills into manageable, actionable learning milestones.",
      emoji: "🗺️"
    },
    {
      icon: TrendingUp,
      title: "📈 Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and celebrate achievements as you master new skills.",
      emoji: "📈"
    }
  ];

  const studentFeatures = [
    {
      icon: BookOpen,
      title: "📚 Fun Learning Resources",
      description: "Access curated videos, articles, and interactive content that makes learning enjoyable and engaging.",
      color: "bg-blue-500"
    },
    {
      icon: Trophy,
      title: "🏆 Achievement System",
      description: "Earn badges and celebrate milestones as you progress through your learning journey.",
      color: "bg-yellow-500"
    },
    {
      icon: Users,
      title: "👥 Study Community",
      description: "Connect with fellow learners and share your progress in a supportive community environment.",
      color: "bg-green-500"
    },
    {
      icon: Zap,
      title: "⚡ Quick Learning",
      description: "Learn at your own pace with bite-sized lessons designed for busy student schedules.",
      color: "bg-purple-500"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-primary-muted text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Transform Your Learning Journey</span>
              <span className="sm:hidden">Start Learning Today!</span>
            </div>
            
            <h1 className="heading-responsive font-bold mb-4 sm:mb-6">
              <span className="gradient-text">Sculpt Your Skills,</span>
              <br />
              <span className="text-foreground">Step by Step</span> 🚀
            </h1>
            
            <p className="text-responsive text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4">
              Generate personalized learning roadmaps tailored to your goals and skill level. 
              Transform your ambitions into actionable learning paths with SkillSculptor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
              <Button 
                size="lg" 
                asChild 
                className="btn-student bg-gradient-primary hover:opacity-90 border-0 text-base sm:text-lg px-6 sm:px-8 py-3 shadow-glow w-full sm:w-auto"
              >
                <Link to="/signup" className="flex items-center justify-center space-x-2">
                  <span>🎓 Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
                <Link to="/login">I Already Have an Account</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-responsive font-bold mb-4">
              Why Choose <span className="gradient-text">SkillSculptor</span>? 🎯
            </h2>
            <p className="text-responsive text-muted-foreground max-w-2xl mx-auto px-4">
              Our platform combines AI-powered personalization with proven learning methodologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="fun-card border-0 shadow-card bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="achievement-badge w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student-Friendly Features */}
      <section className="py-12 sm:py-20 bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="heading-responsive font-bold mb-4">
              Perfect for <span className="gradient-text">Students</span>! 🎓
            </h2>
            <p className="text-responsive text-muted-foreground max-w-2xl mx-auto px-4">
              Designed with students in mind - fun, engaging, and effective learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {studentFeatures.map((feature, index) => (
              <Card key={index} className="fun-card border-0 shadow-card bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${feature.color} flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-center text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-8 sm:py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">SkillSculptor</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right text-sm sm:text-base">
              © 2025 SkillSculptor. Sculpting skills, one step at a time. 🚀
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}