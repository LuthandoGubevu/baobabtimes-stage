import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import RecognitionForm from "./RecognitionForm";
import { recognitionService } from "../services/recognitionService";
import { activityService } from "../../notifications/services/activityService";
import { useAuth } from "../../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function RecognitionModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: recognitionService.createRecognition,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recognitions"] });
      queryClient.invalidateQueries({ queryKey: ["recognition-stats"] });
      queryClient.invalidateQueries({ queryKey: ["recognition-spotlight"] });
      
      // Create activity
      activityService.createActivity({
        type: 'recognition_posted',
        title: `Recognition posted for ${variables.toName}`,
        message: variables.content,
        entityId: '', // We don't have the new doc ID easily here without changing service, but it's okay for now
        isPublic: true,
        metadata: {
          recognitionValue: variables.category,
          fromName: variables.fromName,
          toName: variables.toName
        }
      });

      setIsSuccess(true);
      setError(null);
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (err) => {
      console.error("Failed to post recognition:", err);
      setError("Failed to post recognition. Please check your connection and try again.");
    }
  });

  const handleFormSubmit = (formData) => {
    mutation.mutate({
      fromId: user?.uid || "anonymous",
      fromName: formData.from,
      fromAvatar: user?.photoURL || "",
      toId: "external", // Since it's a text input now
      toName: formData.to,
      toAvatar: "",
      content: formData.thankYouFor,
      category: formData.values[0] || "General", // Fallback or first value
      categories: formData.values, // Store all values
      dateString: formData.date,
      status: "APPROVED",
      isAnonymous: !user
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-none shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-stone-100 transition-colors z-10"
        >
          <X className="w-6 h-6 text-stone-400" />
        </button>

        {isSuccess ? (
          <div className="p-20 text-center space-y-6 bg-[#fcfcfb]">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">Recognition Posted!</h3>
              <p className="text-stone-500">Your appreciation has been shared on the wall.</p>
            </div>
          </div>
        ) : (
          <div className="max-h-[90vh] overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-bold border-b border-red-100">
                {error}
              </div>
            )}
            <RecognitionForm 
              onSubmit={handleFormSubmit} 
              isSubmitting={mutation.isPending} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
