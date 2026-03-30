import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/firebase';
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    setErrorMsg('');

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("New passwords don't match.");
      setIsSaving(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setIsSaving(false);
      return;
    }

    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) throw new Error("No user found");

      // Re-authenticate
      const credential = EmailAuthProvider.credential(currentUser.email, formData.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, formData.newPassword);
      
      setSaveStatus('success');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Error updating password:", error);
      setSaveStatus('error');
      setErrorMsg(error.message || "Failed to update password. Check your current password.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-1">
        <h2 className="text-xl font-serif font-bold">Security Settings</h2>
        <p className="text-sm text-stone-500">Update your password and manage account security.</p>
      </div>

      <div className="bg-stone-50 p-6 border border-stone-200 flex items-start space-x-4">
        <div className="p-2 bg-white rounded-full border border-stone-200">
          <ShieldCheck className="w-5 h-5 text-stone-900" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-tight">Security Best Practices</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Use a strong, unique password that you don't use anywhere else. 
            Avoid using common words or personal information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Current Password</label>
          <input
            required
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">New Password</label>
          <input
            required
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Confirm New Password</label>
          <input
            required
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border-b border-stone-300 bg-transparent py-2 focus:border-stone-900 focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          <div className="flex items-center space-x-2 min-h-[24px]">
            {saveStatus === 'success' && (
              <div className="flex items-center text-green-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Password updated successfully
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errorMsg || "Failed to update password"}
              </div>
            )}
            {errorMsg && saveStatus !== 'error' && (
               <div className="flex items-center text-red-600 text-sm font-medium animate-in fade-in slide-in-from-left-2">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errorMsg}
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSaving}
            className="bg-stone-900 text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all disabled:opacity-50 flex items-center space-x-2 w-fit"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
