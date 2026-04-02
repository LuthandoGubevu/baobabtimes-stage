import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import CeoQuestionCard from "../components/CeoQuestionCard";
import { Send, Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { amaService } from "../services/amaService";

/**
 * AskCeoPage component for displaying the CEO AMA section
 */
export default function AskCeoPage() {
  const [questionText, setQuestionText] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["ceo-questions"],
    queryFn: amaService.getQuestions
  });

  const mutation = useMutation({
    mutationFn: amaService.submitQuestion,
    onSuccess: () => {
      setQuestionText("");
      queryClient.invalidateQueries({ queryKey: ["ceo-questions"] });
      alert("Your question has been submitted for moderation.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    if (!user) {
      alert("Please log in to submit a question.");
      return;
    }

    mutation.mutate({
      content: questionText,
      authorId: user.uid,
      authorName: user.displayName || user.email,
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">Ask the CEO Anything</h1>
          <p className="text-stone-500 text-lg font-light">
            Direct access to our leadership. Ask questions, share concerns, and get transparent answers from the top.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Question Submission */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-stone-900 text-white p-8 rounded-3xl shadow-xl">
              <h2 className="text-2xl font-serif font-bold mb-4">Submit a Question</h2>
              <p className="text-stone-400 text-sm mb-6">
                Your question will be reviewed by our moderation team before being sent to the CEO.
              </p>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <textarea 
                  rows="4"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="What's on your mind?"
                  disabled={mutation.isPending}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={mutation.isPending || !questionText.trim()}
                  className="w-full py-4 bg-white text-stone-900 font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{mutation.isPending ? "Sending..." : "Send Question"}</span>
                </button>
              </form>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start space-x-4">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 mb-1">How it works</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The CEO will Answer any question you may have here
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h2 className="text-2xl font-serif font-bold italic">Recent Questions & Answers</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-stone-900 text-white rounded-full">All</button>
              <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:bg-stone-100 rounded-full">Answered</button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">Loading questions...</div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">Error loading questions.</div>
          ) : (
            <div className="space-y-6">
              {questions?.map((q) => (
                <CeoQuestionCard key={q.id} question={q} />
              ))}
              {questions?.length === 0 && (
                <div className="py-20 text-center text-stone-500">No questions found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
