import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs, doc, updateDoc, serverTimestamp, where, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import AdminTable from "../../admin/components/AdminTable";
import { MessageSquare, CheckCircle, Clock, AlertCircle, Send, X, Newspaper, Plus } from "lucide-react";
import { cn } from "../../../utils/cn";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";
import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * CeoPanel component for the CEO to answer questions and manage articles
 */
export default function CeoPanel() {
  const queryClient = useQueryClient();
  const [answeringId, setAnsweringId] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [activeTab, setActiveTab] = useState("questions");

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
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

  const { data: ceoArticles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["ceo", "articles"],
    queryFn: async () => {
      try {
        const q = query(
          collection(db, "articles"), 
          where("category", "==", "From the CEO"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        // Fallback for index issues
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(a => a.category === "From the CEO");
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

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        await deleteDoc(doc(db, "articles", id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `articles/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceo", "articles"] });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id) => {
      try {
        await deleteDoc(doc(db, "ama_questions", id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `ama_questions/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ceo", "questions"] });
    }
  });

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(id);
    }
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
    { label: "CEO Articles", value: ceoArticles?.length || 0, icon: Newspaper, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending My Answer", value: questions?.filter(q => q.status === "APPROVED" || q.status === "PENDING").length || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Flagged", value: questions?.filter(q => q.status === "REJECTED").length || 0, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  const articleColumns = [
    { key: "title", label: "Article Title" },
    { 
      key: "author", 
      label: "Author",
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
            <img 
              src={row.author?.avatar || `https://i.pravatar.cc/150?u=${row.author?.id || row.authorId}`} 
              alt={row.author?.name || row.authorName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs font-medium">{row.author?.name || row.authorName || "Anonymous"}</span>
        </div>
      )
    },
    { 
      key: "status", 
      label: "Status",
      render: (status) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
          status === "PUBLISHED" ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-700 border border-amber-100"
        )}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">CEO Studio</h1>
          <p className="text-stone-500 text-lg font-light">
            Manage your leadership communications and respond to team questions.
          </p>
        </div>
        
        {activeTab === "articles" && (
          <Link 
            to="/dashboard/articles/new"
            className="px-6 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New CEO Article</span>
          </Link>
        )}
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

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-stone-200">
        <button 
          onClick={() => setActiveTab("questions")}
          className={cn(
            "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
            activeTab === "questions" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
          )}
        >
          Questions Queue
          {activeTab === "questions" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900" />}
        </button>
        <button 
          onClick={() => setActiveTab("articles")}
          className={cn(
            "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
            activeTab === "articles" ? "text-stone-900" : "text-stone-400 hover:text-stone-600"
          )}
        >
          From the CEO Articles
          {activeTab === "articles" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900" />}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "questions" ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold italic">Question Queue</h2>
          {isLoadingQuestions ? (
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
                    <button 
                      onClick={() => handleDeleteQuestion(row.id)}
                      disabled={deleteQuestionMutation.isPending}
                      className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleteQuestionMutation.isPending ? "..." : "Delete"}
                    </button>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold italic">Article History</h2>
          {isLoadingArticles ? (
            <div className="py-20 text-center">Loading articles...</div>
          ) : (
            <AdminTable 
              columns={articleColumns} 
              data={ceoArticles || []} 
              renderActions={(row) => (
                <div className="flex items-center justify-end space-x-4">
                  <Link 
                    to={`/dashboard/articles/${row.id}/edit`}
                    className="text-stone-900 font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(row.id)}
                    disabled={deleteMutation.isPending}
                    className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "..." : "Delete"}
                  </button>
                </div>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
