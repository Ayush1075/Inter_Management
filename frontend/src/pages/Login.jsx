import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertCircle, 
  Users,
  ArrowRight,
  UserCheck,
  GitBranch,
  Target
} from 'lucide-react';
import innodataticsLogo from '../assets/innodatatics_logo.png';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'INTERN') {
        navigate('/intern-upload');
      } else {
        navigate('/admin');
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoginError(null);
      await login(data.email, data.password, rememberMe);
    } catch (error) {
      console.error('Failed to login', error);
      setLoginError('Invalid credentials. Please check your email and password.');
    }
  };

  const features = [
    {
      icon: UserCheck,
      title: "Manage Interns",
      description: "Track intern progress and assignments"
    },
    {
      icon: GitBranch,
      title: "Team Collaboration", 
      description: "Connect mentors and HR seamlessly"
    },
    {
      icon: Target,
      title: "Progress Tracking",
      description: "Monitor internship milestones"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Top left logo - Fixed to square shape */}
      <div className="absolute top-6 left-6 z-30">
        <div className="w-16 h-16 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-2">
          <img
            src={innodataticsLogo}
            alt="Innodatatics Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      
      <div className="relative flex h-full">
        {/* Left Panel - Features Only */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden">
          {/* Enhanced Background Decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/10 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <div className="mb-16">
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Welcome to
                <span className="block text-5xl bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent font-extrabold">
                  Innodatatics
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed font-light">
                Streamline your internship management with our comprehensive platform
              </p>
            </div>

            <div className="space-y-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-6 group">
                  {/* Enhanced Icon Container */}
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/30 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                    <feature.icon className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-white group-hover:text-blue-100 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-blue-100 text-base leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-gray-600">
                Access your internship management dashboard
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white py-8 px-4 shadow-2xl ring-1 ring-gray-900/5 sm:rounded-2xl sm:px-10 border-0">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none transition-all duration-200 ${
                        errors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{loginError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        Sign in to Dashboard
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </button>
                </div>
              </form>

              {/* Additional Links */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Need help? {' '}
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Contact Support
                  </a>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                © 2024 Innodatatics. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
