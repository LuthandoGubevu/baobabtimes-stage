import React from "react";
import { motion } from "motion/react";
import { cn } from "../../../utils/cn";
import { useAuth } from "../../../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { amaService } from "../services/amaService";

const REACTION_TYPES = [
  { type: "helpful", emoji: "👍", label: "Helpful" },
  { type: "insightful", emoji: "💡", label: "Insightful" },
  { type: "more_detail", emoji: "🤔", label: "Need more detail" }
];

/**
 * ReactionRow component for CEO answers
 * @param {Object} props
 * @param {string} props.questionId
 * @param {Object} props.reactions - Map of reaction types to arrays of user IDs
 */
export default function ReactionRow({ questionId, reactions = {} }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ type, isReacted }) => {
      if (!user) throw new Error("Must be logged in to react");
      return await amaService.toggleReaction(questionId, user.uid, type, isReacted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceo-questions"] });
    }
  });

  const handleReaction = (type, isReacted) => {
    if (!user) {
      alert("Please log in to react to the CEO's answer.");
      return;
    }
    mutation.mutate({ type, isReacted });
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      {REACTION_TYPES.map(({ type, emoji, label }) => {
        const userIds = reactions[type] || [];
        const count = userIds.length;
        const isReacted = user && userIds.includes(user.uid);

        return (
          <button
            key={type}
            onClick={() => handleReaction(type, isReacted)}
            disabled={mutation.isPending}
            className={cn(
              "flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 group",
              isReacted 
                ? "bg-stone-900 border-stone-900 text-white shadow-md" 
                : "bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:bg-stone-50"
            )}
            title={label}
          >
            <motion.span 
              animate={isReacted ? { scale: [1, 1.4, 1] } : {}}
              className="text-sm"
            >
              {emoji}
            </motion.span>
            <span className={cn(
              "text-xs font-bold tabular-nums",
              isReacted ? "text-white" : "text-stone-600"
            )}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
