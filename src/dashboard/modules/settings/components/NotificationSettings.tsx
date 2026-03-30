import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { Loader2, CheckCircle2, AlertCircle, BellRing } from 'lucide-react';

export const NotificationSettings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [formData, setFormData] = useState({
    notifications: {
      emailOnRecognition: true,
      emailOnArticle: true,
      ceoUpdates: true,
      systemAlerts: true
    }
  });

  useEffect(() => {
    if (user?.notifications) {
      setFormData({
        notifications: {
          emailOnRecognition: user.notifications.emailOnRecognition ?? true,
          emailOnArticle: user.notifications.emailOnArticle ?? true,
          ceoUpdates: user.notifications.ceoUpdates ?? true,
          systemAlerts: user.notifications.systemAlerts ?? true
        }
      });
    }
  }, [user]);

  const handleToggle = (name) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: !prev.notifications[name]
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
      console.error("Error updating notification preferences:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const NOTIFICATION_GROUPS = [
    {
      id: 'emailOnRecognition',
      title: 'Recognition Alerts',
      description: 'Receive an email when someone recognizes you on the wall.'
    },
    {
      id: 'emailOnArticle',
      title: 'Article Updates',
      description: 'Get notified when your articles are approved or published.'
    },
    {
      id: 'ceoUpdates',
      title: 'CEO AMA Updates',
      description: 'Stay updated on new answers from the CEO.'
    },
    {
      id: 'systemAlerts',
      title: 'System Alerts',
      description: 'Important dashboard and account security notifications.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-serif font-bold">Notification Preferences</h2>
        <p className="text-sm text-stone-500">Manage how and when you receive notifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          {NOTIFICATION_GROUPS.map((group) => (
            <div 
              key={group.id} 
              className="flex items-start justify-between p-4 border border-stone-100 bg-stone-50/50 hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-full border border-stone-200">
                  <BellRing className="w-4 h-4 text-stone-900" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase tracking-tight">{group.title}</p>
                  <p className="text-xs text-stone-500 leading-relaxed">{group.description}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => handleToggle(group.id)}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                  ${formData.notifications[group.id] ? 'bg-stone-900' : 'bg-stone-200'}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${formData.notifications[group.id] ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center space-x-2">
            {saveStatus === 'success' && (
              <div className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Notifications updated
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                Failed to update notifications
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
              <span>Save Notifications</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
