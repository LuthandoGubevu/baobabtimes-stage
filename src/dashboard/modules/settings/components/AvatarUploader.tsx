import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/firebase';

export const AvatarUploader = ({ currentUrl, onUploadSuccess, userId, updatedAt }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError("File is too large. Max size is 2MB.");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Please upload JPG, PNG, or GIF.");
      return;
    }

    setError(null);
    setIsUploading(true);

    // 1. Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // 2. Upload to Storage
      const fileExtension = file.name.split('.').pop();
      const fileName = `avatar_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `avatars/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 3. Update Firestore immediately
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });

      // 4. Notify parent (for form state sync)
      if (onUploadSuccess) {
        onUploadSuccess(downloadURL);
      }
      
      // 5. Keep preview for a bit longer to ensure Firestore sync is reflected in UI
      setTimeout(() => {
        setIsUploading(false);
        setPreviewUrl(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setError("Failed to update avatar. Please try again.");
      setPreviewUrl(null);
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-stone-100 border-2 border-stone-200 shadow-inner relative">
          {previewUrl || currentUrl ? (
            <img 
              src={previewUrl || (currentUrl ? `${currentUrl}${currentUrl.includes('?') ? '&' : '?'}v=${updatedAt || Date.now()}` : '')} 
              key={previewUrl || currentUrl}
              alt="Profile" 
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-300 ${isUploading ? 'opacity-40' : 'opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              <Camera className="w-8 h-8" />
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="absolute bottom-0 right-0 p-2 bg-stone-900 text-white rounded-full shadow-lg hover:bg-stone-800 transition-all hover:scale-110 disabled:opacity-50 disabled:scale-100"
          title="Upload new photo"
        >
          <Upload className="w-4 h-4" />
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="text-center space-y-1">
        <p className="text-sm font-bold uppercase tracking-tight">Profile Photo</p>
        <p className="text-[10px] text-stone-500 uppercase tracking-widest">JPG, GIF or PNG • Max 2MB</p>
        {error && (
          <div className="flex items-center justify-center text-red-600 text-[10px] font-bold mt-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
