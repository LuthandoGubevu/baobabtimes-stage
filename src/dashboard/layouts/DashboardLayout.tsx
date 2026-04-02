import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'motion/react';
import { Search, HelpCircle, User as UserIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';

export const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Generate breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs = pathParts.map((part, index) => {
    const path = `/${pathParts.slice(0, index + 1).join('/')}`;
    return {
      name: part.replace(/-/g, ' '),
      path,
      isLast: index === pathParts.length - 1
    };
  });

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center px-4 sm:px-8 justify-between">
          <nav className="flex items-center space-x-2 text-sm text-zinc-500 overflow-hidden">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />}
                <Link 
                  to={crumb.path}
                  className={`capitalize transition-colors whitespace-nowrap ${
                    crumb.isLast 
                      ? 'text-zinc-900 font-medium pointer-events-none' 
                      : 'hover:text-zinc-900'
                  }`}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link 
              to="/"
              className="hidden sm:flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Website</span>
            </Link>
            
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..."
                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg text-xs focus:outline-none transition-all w-[200px]"
              />
            </div>
            <NotificationBell />
            <button className="hidden sm:block p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
              <HelpCircle size={18} />
            </button>
            <div className="hidden sm:block h-6 w-px bg-zinc-200 mx-1" />
            <Link 
              to="/dashboard/settings"
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden border border-zinc-200">
                {user?.photoURL ? (
                  <img 
                    src={`${user.photoURL}${user.photoURL.includes('?') ? '&' : '?'}v=${user.updatedAt || Date.now()}`} 
                    key={user.photoURL}
                    alt={user.displayName || ''} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserIcon size={14} />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-zinc-900 leading-none">{user?.displayName || 'User'}</p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-none capitalize">{user?.role || 'Employee'}</p>
              </div>
            </Link>
          </div>
        </header>
        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};
