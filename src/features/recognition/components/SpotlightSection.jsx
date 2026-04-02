import React from "react";
import { Trophy, Star, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import { recognitionService } from "../services/recognitionService";
import SpotlightCard from "./SpotlightCard";
import { cn } from "../../../utils/cn";

/**
 * SpotlightSection component for displaying top performers
 */
export const SpotlightSection = () => {
  const { 
    data: spotlightData = { topRecognizers: [], mostAppreciated: [] }, 
    isLoading,
    isError
  } = useQuery({
    queryKey: ["recognition-spotlight"],
    queryFn: recognitionService.getSpotlightData,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 animate-pulse">
        {[1, 2].map(i => (
          <div key={i} className="h-96 bg-stone-50 rounded-[3rem] border border-stone-100" />
        ))}
      </div>
    );
  }

  if (isError || (!spotlightData.topRecognizers.length && !spotlightData.mostAppreciated.length)) {
    return null; // Don't show anything if there's an error or no data
  }

  return (
    <div className="space-y-16 py-12">
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Monthly Spotlight</span>
        </div>
        <h2 className="text-4xl font-serif font-bold italic text-stone-900">
          Celebrating our Appreciation Champions
        </h2>
        <p className="text-stone-500 font-light text-lg">
          Highlighting the team members who have gone above and beyond to recognize and appreciate their peers this month.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
        {/* Top Recognizers Column */}
        {spotlightData.topRecognizers.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold italic text-stone-900">Appreciation Champions</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Top Recognizers this month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {spotlightData.topRecognizers.map((user, index) => (
                <SpotlightCard 
                  key={user.id} 
                  type="recognizer" 
                  user={user} 
                  rank={index + 1} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Most Appreciated Column */}
        {spotlightData.mostAppreciated.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold italic text-stone-900">Rising Stars</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Most Appreciated Employees</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
              {spotlightData.mostAppreciated.map((user, index) => (
                <SpotlightCard 
                  key={user.id} 
                  type="appreciated" 
                  user={user} 
                  rank={index + 1} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotlightSection;
