import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Award, 
  MessageSquare, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  LogOut,
  Layout,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navSections = [
  {
    label: 'Publishing',
    items: [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Articles', path: '/dashboard/articles', icon: FileText },
      { name: 'Curation', path: '/dashboard/curation', icon: Layout },
      { name: 'Media Library', path: '/dashboard/media', icon: ImageIcon },
    ]
  },
  {
    label: 'Engagement',
    items: [
      { name: 'Recognition', path: '/dashboard/recognition', icon: Award },
      { name: 'Ask the CEO', path: '/dashboard/ask-ceo', icon: MessageSquare },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Users', path: '/dashboard/users', icon: Users },
      { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ]
  }
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-400 border-r border-zinc-800">
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-white tracking-tighter"
          >
            BAOBAB <span className="text-zinc-500">TIMES</span>
          </motion.span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-zinc-900 transition-colors hidden md:block"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <div className="px-4 mb-6">
        <div className={cn(
          "flex items-center p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 overflow-hidden",
          isCollapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 border border-zinc-700 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                <User size={20} />
              </div>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 truncate">{user?.role || 'Employee'}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-8 mt-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {section.label}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-all duration-200 group",
                      isActive 
                        ? "bg-zinc-900 text-white" 
                        : "hover:bg-zinc-900 hover:text-zinc-200"
                    )}
                  >
                    <item.icon 
                      size={18} 
                      className={cn(
                        "transition-colors",
                        isActive ? "text-white" : "group-hover:text-zinc-200"
                      )} 
                    />
                    {!isCollapsed && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 font-medium text-sm"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-red-400 group"
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="ml-3 font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-zinc-950 text-white rounded-lg shadow-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <motion.div 
        className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <SidebarContent />
      </motion.div>

      {/* Desktop Sidebar */}
      <motion.aside 
        className={cn(
          "hidden md:block h-screen sticky top-0 transition-all duration-300 ease-in-out z-30",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
};
