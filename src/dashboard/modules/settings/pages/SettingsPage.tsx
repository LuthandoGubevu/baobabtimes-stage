import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Bell, 
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';

const SETTINGS_NAV = [
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/settings/profile' },
  { id: 'account', label: 'Account', icon: SettingsIcon, path: '/dashboard/settings/account' },
  { id: 'security', label: 'Security', icon: Shield, path: '/dashboard/settings/security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/settings/notifications' },
];

export const SettingsPage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold tracking-tight">Settings</h1>
        <p className="text-stone-500">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {SETTINGS_NAV.map((item) => {
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-stone-900 text-white shadow-lg' 
                      : 'text-stone-600 hover:bg-stone-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-stone-200 p-6 md:p-8 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
