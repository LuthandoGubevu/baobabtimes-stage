import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AccountSettings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [formData, setFormData] = useState({
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      landingPage: 'overview'
    }
  });

  useEffect(() => {
    if (user?.preferences) {
      setFormData({
        preferences: {
          theme: user.preferences.theme || 'system',
          language: user.preferences.language || 'en',
          timezone: user.preferences.timezone || 'UTC',
          landingPage: user.preferences.landingPage || 'overview'
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      const success = await userService.updateUser(user.uid, formData);
      if (success) {
        setSaveStatus('success');
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error("Error updating account preferences:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-serif font-bold">Account Preferences</h2>
        <p className="text-sm text-stone-500">Personalize your dashboard experience and language settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Theme Preference</label>
            <select
              name="theme"
              value={formData.preferences.theme}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode (Coming Soon)</option>
              <option value="system">System Default</option>
            </select>
            <p className="text-[10px] text-stone-400 italic">Choose how the dashboard looks on your device.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Language</label>
            <select
              name="language"
              value={formData.preferences.language}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            >
              <option value="en">English (UK)</option>
              <option value="fr">French (Coming Soon)</option>
              <option value="de">German (Coming Soon)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Timezone</label>
            <select
              name="timezone"
              value={formData.preferences.timezone}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            >
              <option value="UTC">UTC (Universal Time)</option>
              <option value="GMT">GMT (Greenwich Mean Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Default Landing Page</label>
            <select
              name="landingPage"
              value={formData.preferences.landingPage}
              onChange={handleChange}
              className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            >
              <option value="overview">Overview Dashboard</option>
              <option value="articles">Article List</option>
              <option value="recognition">Recognition Wall</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center space-x-2">
            {saveStatus === 'success' && (
              <div className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Preferences updated
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                Failed to update preferences
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="bg-stone-900 text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
