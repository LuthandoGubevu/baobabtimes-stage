import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../../hooks/useAuth";
import AdminTable from "../../admin/components/AdminTable";
import { Newspaper, FileEdit, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../../utils/cn";

/**
 * ContributorDashboard component for managing personal posts
 */
export default function ContributorDashboard() {
  const { user } = useAuth();
  const { data: articles, isLoading } = useQuery({
    queryKey: ["contributor", "my-articles", user?.uid],
    queryFn: async () => {
      if (!user?.uid) return [];
      const path = "articles";
      const q = query(
        collection(db, path), 
        where("authorId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!user?.uid
  });

  const columns = [
    { 
      key: "title", 
      label: "Title",
      render: (title, article) => (
        <Link 
          to={`/posts/${article.slug || article.id}`} 
          className="font-serif font-bold text-stone-900 hover:text-stone-600 transition-colors"
        >
          {title}
        </Link>
      )
    },
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
    { label: "My Articles", value: "12", icon: Newspaper, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Published", value: "8", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Drafts", value: "3", icon: FileEdit, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Review", value: "1", icon: Clock, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">Contributor Studio</h1>
          <p className="text-stone-500 text-lg font-light">
            Create, edit, and manage your contributions to The Baobab Times.
          </p>
        </div>
        
        <Link 
          to="/contributor/create"
          className="px-6 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg"
        >
          Create New Post
        </Link>
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

      {/* My Posts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold italic">My Recent Posts</h2>
        {isLoading ? (
          <div className="py-20 text-center">Loading your posts...</div>
        ) : (
          <AdminTable columns={columns} data={articles || []} />
        )}
      </div>
    </div>
  );
}
