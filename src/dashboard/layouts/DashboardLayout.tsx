import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { motion } from 'motion/react';
import { Search, Bell, HelpCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const DashboardLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center px-8 justify-between">
          <div className="flex items-center space-x-2 text-sm text-zinc-500">
            {pathParts.map((part, index) => (
              <React.Fragment key={part}>
                <span className="capitalize hover:text-zinc-900 cursor-pointer transition-colors">
                  {part.replace('-', ' ')}
                </span>
                {index < pathParts.length - 1 && <span className="text-zinc-300">/</span>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..."
                className="pl-9 pr-4 py-1.5 bg-zinc-100 border-transparent focus:bg-white focus:border-zinc-200 rounded-lg text-xs focus:outline-none transition-all w-[200px]"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
              <HelpCircle size={18} />
            </button>
            <div className="h-6 w-px bg-zinc-200 mx-1" />
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-zinc-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden border border-zinc-200">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon size={14} />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-zinc-900 leading-none">{user?.displayName || 'User'}</p>
                <p className="text-[10px] text-zinc-500 mt-1 leading-none capitalize">{user?.role || 'Employee'}</p>
              </div>
            </button>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full">
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
