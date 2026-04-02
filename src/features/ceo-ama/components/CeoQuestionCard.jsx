import { format } from "date-fns";
import { MessageSquare, CheckCircle2, Clock } from "lucide-react";
import { cn } from "../../../utils/cn";
import ReactionRow from "./ReactionRow";

/**
 * CeoQuestionCard component for displaying Ask the CEO questions
 * @param {Object} props
 * @param {Object} props.question
 * @param {string} props.className
 */
export default function CeoQuestionCard({ question, className }) {
  const { id, content, authorName, status, answer, answeredAt, createdAt, reactions } = question;

  const isAnswered = status === "ANSWERED";

  const formatDate = (date) => {
    if (!date) return "Recently";
    if (date.toDate) return format(date.toDate(), "MMM d, yyyy");
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className={cn(
      "bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1",
              isAnswered ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-700 border border-amber-100"
            )}>
              {isAnswered ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Answered</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </>
              )}
            </div>
          </div>
          <span className="text-[10px] text-stone-400 font-medium">
            {formatDate(createdAt)}
          </span>
        </div>

        <div className="flex items-start space-x-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900 leading-tight mb-2">
              {content}
            </h3>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">
              Asked by {authorName || "Anonymous"}
            </p>
          </div>
        </div>

        {isAnswered && answer && (
          <div className="relative mt-6 pt-6 border-t border-stone-100">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              CEO Answer
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-stone-900 overflow-hidden border-2 border-white shadow-lg shrink-0">
                <img src="https://i.pravatar.cc/150?u=ceo" alt="CEO" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  "{answer}"
                </p>
                <p className="text-[10px] text-stone-400 mt-2 font-medium">
                  Answered on {formatDate(answeredAt)}
                </p>
                
                {/* Reaction Row */}
                <ReactionRow questionId={id} reactions={reactions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
