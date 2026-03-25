import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import AdminTable from "../../admin/components/AdminTable";
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send, X } from "lucide-react";
import { cn } from "../../../utils/cn";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";
import { useState } from "react";

/**
 * CeoPanel component for the CEO to answer questions
 */
export default function CeoPanel() {
  const queryClient = useQueryClient();
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const { data: questions, isLoading } = useQuery({
    queryKey: ["ceo", "questions"],
    queryFn: async () => {
      try {
        const q = query(collection(db, "ama_questions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "ama_questions");
        return [];
      }
    }
  });

  const answerMutation = useMutation({
    mutationFn: async ({ id, answer }) => {
      try {
        const docRef = doc(db, "ama_questions", id);
        await updateDoc(docRef, {
          answer,
          status: "ANSWERED",
          answeredAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `ama_questions/${id}`);
      }
    },
    onSuccess: () => {
      setAnsweringId(null);
      setAnswerText("");
      queryClient.invalidateQueries({ queryKey: ["ceo", "questions"] });
      queryClient.invalidateQueries({ queryKey: ["ceo-questions"] });
    }
  });

  const handleAnswerSubmit = (id) => {
    if (!answerText.trim()) return;
    answerMutation.mutate({ id, answer: answerText });
  };

  const columns = [
    { key: "content", label: "Question" },
    { 
      key: "status", 
      label: "Status",
      render: (status) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
          status === "ANSWERED" ? "bg-green-50 text-green-700 border border-green-100" : 
          status === "APPROVED" ? "bg-blue-50 text-blue-700 border border-blue-100" :
          status === "REJECTED" ? "bg-red-50 text-red-700 border border-red-100" :
          "bg-amber-50 text-amber-700 border border-amber-100"
        )}>
          {status}
        </span>
      )
    }
  ];

  const stats = [
    { label: "Total Questions", value: questions?.length || 0, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Answered", value: questions?.filter(q => q.status === "ANSWERED").length || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending My Answer", value: questions?.filter(q => q.status === "APPROVED" || q.status === "PENDING").length || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Flagged", value: questions?.filter(q => q.status === "REJECTED").length || 0, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">CEO Answer Panel</h1>
          <p className="text-stone-500 text-lg font-light">
            Review and respond to questions from your team. Your voice matters.
          </p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg, stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-serif font-bold text-stone-900">{stat.value}</p>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Questions Queue */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold italic">Question Queue</h2>
        {isLoading ? (
          <div className="py-20 text-center">Loading questions...</div>
        ) : (
          <div className="space-y-4">
            {answeringId && (
              <div className="bg-stone-900 text-white p-6 rounded-3xl shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Answering Question</h4>
                    <p className="font-serif italic text-lg">"{questions.find(q => q.id === answeringId)?.content}"</p>
                  </div>
                  <button onClick={() => setAnsweringId(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea 
                  rows="4"
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all mb-4"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleAnswerSubmit(answeringId)}
                    disabled={answerMutation.isPending || !answerText.trim()}
                    className="px-6 py-3 bg-white text-stone-900 font-bold rounded-xl flex items-center space-x-2 hover:bg-stone-100 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{answerMutation.isPending ? "Posting..." : "Post Answer"}</span>
                  </button>
                </div>
              </div>
            )}
            <AdminTable 
              columns={columns} 
              data={questions || []} 
              renderActions={(row) => (
                <div className="flex items-center justify-end space-x-4">
                  {row.status !== "ANSWERED" && (
                    <button 
                      onClick={() => {
                        setAnsweringId(row.id);
                        setAnswerText(row.answer || "");
                      }}
                      className="text-stone-900 font-bold text-xs uppercase tracking-widest hover:underline"
                    >
                      Answer
                    </button>
                  )}
                  <button className="text-stone-400 hover:text-stone-900 transition-colors">Edit</button>
                  <button className="text-red-400 hover:text-red-600 transition-colors">Delete</button>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
