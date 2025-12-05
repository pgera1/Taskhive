
import React, { useState } from 'react';
import { Hexagon, Mail, Lock, AlertCircle, User as UserIcon, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LoginPageProps {
  onLogin: (user: User, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateToken = (user: User) => {
    const payload = JSON.stringify({ ...user, exp: Date.now() + 3600000 });
    return btoa(payload);
  };

  const handleGoogleLogin = () => {
      setIsLoading(true);
      setTimeout(() => {
          const user: User = {
              id: 'google-user-' + uuidv4(),
              name: 'Google User',
              email: 'user@gmail.com',
              avatar: 'https://ui-avatars.com/api/?name=Google+User&background=DB4437&color=fff'
          };
          onLogin(user, generateToken(user));
      }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (isLoginMode) {
        if (email === 'admin@taskhive.com' && password === 'admin123') {
           const user: User = {
            id: 'admin-1',
            name: 'Admin User',
            email: 'admin@taskhive.com',
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=4f46e5&color=fff',
            isAdmin: true
           };
           onLogin(user, generateToken(user));
        } else if (email && password.length >= 6) {
           const user: User = {
            id: 'user-' + Math.floor(Math.random() * 1000),
            name: 'Demo User', 
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
           };
           onLogin(user, generateToken(user));
        } else {
            setIsLoading(false);
            setError('Invalid credentials. (Try admin@taskhive.com / admin123)');
        }
      } else {
        if (password !== confirmPassword) {
            setIsLoading(false);
            setError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            setIsLoading(false);
            setError('Password must be at least 6 characters');
            return;
        }

        const newUser: User = {
            id: uuidv4(),
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            isAdmin: false
        };
        
        onLogin(newUser, generateToken(newUser));
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-[60%] -left-[10%] w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="p-8 pb-4 text-center border-b border-slate-50">
                <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl mb-4">
                    <Hexagon size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h1>
                <p className="text-slate-500 mt-2 text-sm">
                    {isLoginMode ? 'Sign in to manage your projects' : 'Join TaskHive and start collaborating'}
                </p>
            </div>

            <div className="p-8 pt-6">
                <div className="mb-6">
                    <button 
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                    
                    <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or continue with</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center animate-in fade-in duration-200">
                            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {!isLoginMode && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="John Doe"
                                    required={!isLoginMode}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {!isLoginMode && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required={!isLoginMode}
                                />
                            </div>
                        </div>
                    )}

                    <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                        {isLoginMode ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        {isLoginMode ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                            className="ml-1 text-indigo-600 font-medium hover:underline focus:outline-none"
                        >
                            {isLoginMode ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </div>
            </div>
            
            <div className="bg-slate-50 px-8 py-4 text-center text-xs text-slate-400 border-t border-slate-100">
                By continuing, you agree to TaskHive's <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
            </div>
        </div>
    </div>
  );
};
