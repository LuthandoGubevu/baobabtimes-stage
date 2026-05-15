import React from "react";
import { Trophy, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { recognitionService } from "../services/recognitionService";
import LeaderboardPanel from "./LeaderboardPanel";

/**
 * SpotlightSection — compact side-by-side leaderboard panels.
 * Replaces the previous full-width large-card grid.
 * Data comes from the existing recognitionService.getSpotlightData().
 */
export const SpotlightSection = () => {
  const {
    data: spotlightData = { topRecognizers: [], mostAppreciated: [] },
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["recognition-spotlight"],
    queryFn: recognitionService.getSpotlightData,
    staleTime: 1000 * 60 * 5, // 5-minute cache
  });

  // Don't render the section header if there's nothing to show
  const hasData =
    spotlightData.topRecognizers.length > 0 ||
    spotlightData.mostAppreciated.length > 0;

  if (isError || (!isLoading && !hasData)) return null;

  return (
    <div className="space-y-4">
      {/* Section label */}
      <div className="flex items-center gap-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 whitespace-nowrap">
          Monthly Spotlight
        </h2>
        <div className="h-px flex-grow bg-stone-100" />
      </div>

      {/* Two compact panels side-by-side on md+, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LeaderboardPanel
          title="Appreciation Champions"
          subtitle="Top recognizers this month"
          icon={Trophy}
          iconBg="bg-amber-50 text-amber-600"
          items={spotlightData.topRecognizers}
          countKey="monthlyGiven"
          countLabel="given"
          isLoading={isLoading}
        />

        <LeaderboardPanel
          title="Rising Stars"
          subtitle="Most appreciated this month"
          icon={Star}
          iconBg="bg-blue-50 text-blue-600"
          items={spotlightData.mostAppreciated}
          countKey="monthlyReceived"
          countLabel="received"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default SpotlightSection;
