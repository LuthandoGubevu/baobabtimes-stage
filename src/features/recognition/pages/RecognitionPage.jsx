import React, { useState } from "react";
import { Award, Heart, Star, Plus, Loader2, MessageSquare } from "lucide-react";
import RecognitionCard from "../components/RecognitionCard";
import RecognitionModal from "../components/RecognitionModal";
import { recognitionService } from "../services/recognitionService";
import { useQuery } from "@tanstack/react-query";

export default function RecognitionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: recognitions = [], 
    isLoading: isLoadingRecognitions,
    isError: isErrorRecognitions
  } = useQuery({
    queryKey: ["recognitions"],
    queryFn: recognitionService.getApprovedRecognitions
  });

  const { 
    data: stats = { Innovation: 0, Impact: 0, Heart: 0, total: 0 },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ["recognition-stats"],
    queryFn: recognitionService.getRecognitionStats
  });

  const statCards = [
    { label: "Innovation", value: stats.Innovation, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Impact", value: stats.Impact, icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { label: "Heart", value: stats.Heart, icon: Award, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Simple Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">Recognition Wall</h1>
          <p className="text-stone-500 text-lg font-light">
            Celebrating the achievements, teamwork, and innovation of our incredible people.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Recognize a Peer</span>
        </button>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm flex items-center space-x-6">
            <div className={`w-16 h-16 ${stat.bg} rounded-3xl flex items-center justify-center`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-serif font-bold">
                {isLoadingStats ? "..." : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recognition Feed */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-serif font-bold italic">Latest Recognitions</h2>
          <div className="h-px flex-grow mx-8 bg-stone-200 hidden md:block" />
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
            {recognitions.length} Total Posts
          </span>
        </div>

        {isLoadingRecognitions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-stone-200 h-64 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 bg-stone-100 rounded-full" />
                    <div className="space-y-2">
                      <div className="w-24 h-4 bg-stone-100 rounded" />
                      <div className="w-16 h-3 bg-stone-50 rounded" />
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-stone-100 rounded-2xl" />
                </div>
                <div className="w-full h-20 bg-stone-50 rounded-3xl" />
                <div className="w-20 h-4 bg-stone-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : isErrorRecognitions ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-stone-200">
            <p className="text-stone-500">Failed to load recognitions. Please try again later.</p>
          </div>
        ) : recognitions.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-stone-200 space-y-6">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-10 h-10 text-stone-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold">No recognitions yet</h3>
              <p className="text-stone-500 max-w-xs mx-auto">Be the first to celebrate a colleague's contribution to the team!</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 text-stone-900 font-bold hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>Recognize someone now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recognitions.map((recognition) => (
              <RecognitionCard key={recognition.id} recognition={recognition} />
            ))}
          </div>
        )}
      </div>

      <RecognitionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
