import { useQuery } from "@tanstack/react-query";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import AdminTable from "../components/AdminTable";
import { Users, Newspaper, Award, MessageSquare, ShieldCheck } from "lucide-react";
import { cn } from "../../../utils/cn";

/**
 * AdminDashboard component for the main admin console
 */
export default function AdminDashboard() {
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const path = "articles";
      const q = query(
        collection(db, path), 
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  const articleColumns = [
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
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

  const stats = [
    { label: "Total Users", value: "1,240", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Articles", value: "86", icon: Newspaper, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending Recognition", value: "12", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Unanswered Qs", value: "4", icon: MessageSquare, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 text-stone-400 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Admin Console</span>
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4 italic">Platform Overview</h1>
          <p className="text-stone-500 text-lg font-light">
            Manage your content, users, and engagement metrics from one unified dashboard.
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

      {/* Content Management */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-serif font-bold italic">Article Management</h2>
          <button className="px-4 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-stone-800 transition-colors">
            Create New Article
          </button>
        </div>
        
        {articlesLoading ? (
          <div className="py-20 text-center">Loading articles...</div>
        ) : (
          <AdminTable columns={articleColumns} data={articles || []} />
        )}
      </div>

      {/* Moderation Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold italic">Recognition Moderation</h2>
          <div className="bg-white rounded-3xl border border-stone-200 p-6 text-center text-stone-500 py-20">
            <Award className="w-8 h-8 mx-auto mb-4 opacity-20" />
            <p className="text-sm">No recognition posts pending review.</p>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold italic">Ask the CEO Moderation</h2>
          <div className="bg-white rounded-3xl border border-stone-200 p-6 text-center text-stone-500 py-20">
            <MessageSquare className="w-8 h-8 mx-auto mb-4 opacity-20" />
            <p className="text-sm">No questions pending moderation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
