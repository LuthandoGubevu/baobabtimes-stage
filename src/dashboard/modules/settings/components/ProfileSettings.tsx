import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { AvatarUploader } from './AvatarUploader';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    jobTitle: '',
    department: '',
    bio: '',
    photoURL: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phone || '',
        jobTitle: user.jobTitle || '',
        department: user.department || '',
        bio: user.bio || '',
        photoURL: user.photoURL || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSuccess = (url) => {
    setFormData(prev => ({ ...prev, photoURL: url }));
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
      console.error("Error updating profile:", error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-serif font-bold">Profile Information</h2>
        <p className="text-sm text-stone-500">Update your personal information and profile photo.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <AvatarUploader 
            userId={user?.uid} 
            currentUrl={formData.photoURL} 
            updatedAt={user?.updatedAt}
            onUploadSuccess={handleAvatarSuccess} 
          />
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Display Name</label>
              <input
                required
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
                placeholder="johndoe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Email Address</label>
              <input
                disabled
                type="email"
                name="email"
                value={formData.email}
                className="w-full border-b border-stone-300 bg-transparent py-2 opacity-50 cursor-not-allowed"
              />
              <p className="text-[10px] text-stone-400">Email cannot be changed here.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
                placeholder="Senior Editor"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
                placeholder="Editorial"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Short Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border border-stone-300 bg-transparent p-3 focus:border-stone-900 focus:outline-none transition-colors resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              {saveStatus === 'success' && (
                <div className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Changes saved successfully
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center text-red-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  Failed to save changes
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
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
