import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../../components/ui/Button";
import { LogIn, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").refine(
    (email) => email.endsWith("@baobabbrands.com") || email.endsWith("@kfcbaobab.com"),
    "Please use your work email address"
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * LoginPage component for user authentication
 */
export default function LoginPage() {
  const { loginWithEmail, registerWithEmail, error: authError } = useAuth();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const displayError = localError || authError;
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<any>({
    resolver: zodResolver(authMode === 'login' ? loginSchema : registerSchema),
  });

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
        message = "Network error: Firebase could not be reached. Please check your internet connection.";
      } else if (err.code === 'auth/operation-not-allowed') {
        message = "Email/Password authentication is not enabled in the Firebase Console.";
      } else if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please sign in instead.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        message = "Invalid email or password. Please try again.";
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
            {authMode === 'login' ? 'Welcome Back' : 'Internal Registration'}
          </h1>
          <p className="text-stone-500 mb-8 text-sm">
            {authMode === 'login' 
              ? 'Sign in with your work email to access the dashboard.' 
              : 'Register with your work email to join the internal team.'}
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
              Register
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
                    placeholder="Your Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                  />
                </div>
                {errors.displayName && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.displayName.message as string}</p>}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                <input 
                  {...registerField("email")}
                  type="email" 
                  placeholder="name@baobabbrands.com"
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
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.password.message as string}</p>}
            </div>

            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
                  <input 
                    {...registerField("confirmPassword")}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white focus:border-stone-200 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-1">{errors.confirmPassword.message as string}</p>}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all group"
              isLoading={isSubmitting}
            >
              <span className="flex items-center justify-center">
                {authMode === 'login' ? 'Sign In' : 'Register Account'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </form>

          <button 
            onClick={toggleMode}
            className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
          >
            {authMode === 'login' 
              ? "Don't have an account? Register as employee" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
