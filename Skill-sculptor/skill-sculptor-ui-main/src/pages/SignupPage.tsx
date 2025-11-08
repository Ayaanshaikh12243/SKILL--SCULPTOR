import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await API.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Save token for authenticated subsequent requests
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      localStorage.setItem('user', JSON.stringify({ _id: data.user._id, username: data.user.username }));

      toast({ title: "Welcome! 🎉", description: "Your account has been created." });
      navigate('/query-form');
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-primary shadow-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Create Your Account</h2>
            <p className="mt-2 text-muted-foreground">Start your learning journey with SkillSculptor</p>
          </div>

          <Card className="shadow-card border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
              <CardDescription className="text-center">Enter your details to create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {['username', 'email', 'password', 'confirmPassword'].map((field) => {
                  const Icon = field === 'username' ? User : field.includes('email') ? Mail : Lock;
                  const isPasswordField = field.includes('password');
                  const showPasswordState = field === 'password' ? showPassword : showConfirmPassword;
                  const setShowPasswordState = field === 'password' ? setShowPassword : setShowConfirmPassword;
                  
                  return (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field === 'confirmPassword' ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={field}
                          name={field}
                          type={isPasswordField ? (showPasswordState ? 'text' : 'password') : 'text'}
                          placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                          value={formData[field]}
                          onChange={handleInputChange}
                          className="pl-10 focus-ring"
                          required
                        />
                        {isPasswordField && (
                          <button
                            type="button"
                            onClick={() => setShowPasswordState(!showPasswordState)}
                            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPasswordState ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 border-0" size="lg" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : <>
                    Create Account<ArrowRight className="ml-2 h-4 w-4" />
                  </>}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account? <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">Sign in here</Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
