import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { NotificationBell } from "../features/notifications/components/NotificationBell";
import { 
  Home, 
  Newspaper, 
  Award, 
  MessageSquare, 
  LayoutDashboard, 
  User, 
  LogOut,
  Settings,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/cn";

/**
 * RootLayout component with common navigation
 */
export default function RootLayout() {
  const { user, logout, isAdmin, isCEO, hasDashboardAccess } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Articles", path: "/articles", icon: Newspaper },
    { label: "Recognition", path: "/recognition", icon: Award },
    { label: "Ask the CEO", path: "/ask-ceo", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-serif font-bold tracking-tight hidden sm:block">
                The Baobab Times
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-1 text-sm font-medium transition-colors",
                      isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-900"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <NotificationBell isPublicOnly={!user} />
              
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-stone-200">
                  {hasDashboardAccess && (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/dashboard/settings"
                        className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                        title="Settings"
                      >
                        <Settings className="w-5 h-5" />
                      </Link>
                    </>
                  )}
                  
                  <div className="h-8 w-px bg-stone-100 mx-2" />

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{user.displayName || user.email}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{user.role}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-stone-500 hover:text-red-600 transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-6 py-2 bg-stone-900 text-white text-sm font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <NotificationBell isPublicOnly={!user} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-500 hover:text-stone-900"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 py-4 px-4 space-y-4 shadow-lg">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 p-3 rounded-lg text-base font-medium",
                    isActive ? "bg-stone-100 text-stone-900" : "text-stone-500 hover:bg-stone-50"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <hr className="border-stone-100" />
            {user ? (
              <>
                {hasDashboardAccess && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg text-base font-bold text-stone-900 bg-stone-50"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Go to Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg text-base font-medium text-stone-900 hover:bg-stone-50"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg text-base font-bold text-white bg-stone-900"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-stone-900 rounded flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-sm">B</span>
                </div>
                <span className="text-lg font-serif font-bold tracking-tight">
                  The Baobab Times
                </span>
              </Link>
              <p className="text-stone-500 text-sm max-w-xs">
                Your unified modern internal media and communication hub. Reimagining company engagement through editorial excellence.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><Link to="/articles" className="hover:text-stone-900">News & Articles</Link></li>
                <li><Link to="/recognition" className="hover:text-stone-900">Recognition Wall</Link></li>
                <li><Link to="/ask-ceo" className="hover:text-stone-900">Ask the CEO</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-stone-500">
                <li><Link to="/help" className="hover:text-stone-900">Help Center</Link></li>
                <li><Link to="/guidelines" className="hover:text-stone-900">Editorial Guidelines</Link></li>
                <li><Link to="/contact" className="hover:text-stone-900">Internal Comms Team</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-stone-400">
              © 2026 The Baobab Times. All rights reserved.
            </p>
            <div className="flex space-x-6 text-xs text-stone-400">
              <Link to="/privacy" className="hover:text-stone-900">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-stone-900">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
