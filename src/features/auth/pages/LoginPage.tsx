import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/ui/Button";
import { LogIn, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(5, "Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * LoginPage component for user authentication
 */
export default function LoginPage() {
  const { login, loginWithEmail, registerWithEmail, error: authError } = useAuth();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [localError, setLocalError] = useState<string | null>(null);
  
  const displayError = localError || authError;
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>({
    resolver: zodResolver(authMode === 'login' ? loginSchema : registerSchema),
  });

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    try {
      console.log("Attempting Google login...");
      await login();
      console.log("Google login successful, navigating home...");
      navigate("/");
    } catch (err: any) {
      console.error("Google login failed:", err);
      setLocalError(err.message || "Google login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLocalError(null);
    try {
      console.log(`Attempting ${authMode} with email: ${data.email}`);
      if (authMode === 'login') {
        await loginWithEmail(data.email, data.password);
      } else {
        await registerWithEmail(data.email, data.password, data.displayName);
      }
      console.log(`${authMode} successful, navigating home...`);
      navigate("/");
    } catch (err: any) {
      console.error(`${authMode} failed:`, err);
      let message = err.message || "Authentication failed";
      
      if (err.code === 'auth/network-request-failed') {
        message = "Network error: Firebase could not be reached. Please check your internet connection and ensure no ad-blockers are blocking 'identitytoolkit.googleapis.com'.";
      } else if (err.code === 'auth/operation-not-allowed') {
        message = "Email/Password authentication is not enabled in the Firebase Console.";
      }
      
      setLocalError(message);
    }
  };

  const toggleMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setLocalError(null);
    reset();
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 z-0" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-stone-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <span className="text-2xl font-serif font-bold">B</span>
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Join the Times'}
          </h1>
          <p className="text-stone-500 mb-8 text-sm">
            {authMode === 'login' 
              ? 'Sign in to access your internal dashboard.' 
              : 'Create an account to join our internal community.'}
          </p>

          <div className="flex p-1 bg-stone-100 rounded-2xl mb-8">
            <button
              onClick={() => { setAuthMode('login'); setLocalError(null); reset(); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                authMode === 'login' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('register'); setLocalError(null); reset(); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                authMode === 'register' 
                  ? 'bg-white text-stone-900 shadow-sm' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {displayError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-1">
              {displayError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left mb-8">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    {...registerField("displayName")}
                    type="text" 
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                  />
                </div>
                {errors.displayName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.displayName.message as string}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  {...registerField("email")}
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  {...registerField("password")}
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                />
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message as string}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all group"
              isLoading={isSubmitting}
            >
              <span className="flex items-center justify-center">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-stone-300">Or continue with</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin} 
            className="w-full py-4 rounded-2xl flex items-center justify-center space-x-3 bg-white border-2 border-stone-100 text-stone-900 hover:bg-stone-50 hover:border-stone-200 transition-all shadow-sm mb-8"
            isLoading={isLoggingIn}
          >
            {!isLoggingIn && (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-bold">Google Account</span>
          </Button>

          <button 
            onClick={toggleMode}
            className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
          >
            {authMode === 'login' 
              ? "Don't have an account? Join the team" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
