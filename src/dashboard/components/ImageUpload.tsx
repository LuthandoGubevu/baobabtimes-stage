import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, AlertCircle } from "lucide-react";
import { auth } from "@/firebase";
import { cn } from "../../lib/utils";

import { ImagePlaceholder } from "@/components/ui/GenericPlaceholder";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File is too large. Maximum size is 5MB.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG and WEBP are allowed.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      if (!auth.currentUser) {
        throw new Error("Unauthorized. Please sign in to upload images.");
      }

      const token = await auth.currentUser.getIdToken();
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned an invalid response format.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setUrlValue(data.url);
      setError(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setUrlValue("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    onChange(urlValue);
    setShowUrlInput(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
          Featured Image
        </label>
        {!value && !isUploading && (
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors flex items-center"
          >
            <LinkIcon className="w-3 h-3 mr-1" />
            {showUrlInput ? "Cancel" : "Use URL"}
          </button>
        )}
      </div>

      {showUrlInput ? (
        <div className="flex space-x-2">
          <input
            type="text"
            value={urlValue}
            onChange={(e) => setUrlValue(e.target.value)}
            placeholder="Paste image URL here..."
            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "relative aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden group",
            value ? "border-transparent" : "border-stone-200 hover:border-stone-400 bg-stone-50",
            error ? "border-red-200 bg-red-50" : ""
          )}
        >
          {isUploading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 text-stone-900 animate-spin mb-2" />
              <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">Uploading...</p>
            </div>
          ) : value ? (
            <>
              <ImagePlaceholder className="w-full h-full" />
              <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white text-stone-900 rounded-full hover:bg-stone-100 transition-colors shadow-lg"
                  title="Replace Image"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                  title="Remove Image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-stone-400" />
              </div>
              <p className="text-sm font-bold text-stone-900 mb-1">Upload Image</p>
              <p className="text-xs text-stone-400">JPG, PNG or WEBP (Max 5MB)</p>
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
