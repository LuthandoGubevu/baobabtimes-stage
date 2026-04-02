import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Archive,
  User,
  Calendar,
  Tag,
  ArrowRight,
  Loader2,
  Trash2
} from "lucide-react";
import { db } from "../../../../firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";
import { format } from "date-fns";
import { toast } from "sonner";

interface StoryIdea {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  title: string;
  description: string;
  category: "TEAM_MILESTONE" | "INNOVATIVE_PROJECT" | "RECOGNITION" | "OTHER";
  status: "PENDING" | "REVIEWED" | "ARCHIVED";
  createdAt: Timestamp;
}

export function StoryIdeaModeration() {
  const [ideas, setIdeas] = useState<StoryIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const q = query(collection(db, "story_ideas"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StoryIdea[];
      setIdeas(ideasData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching story ideas:", error);
      toast.error("Failed to load story ideas.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "story_ideas", id), {
        status: newStatus
      });
      toast.success(`Idea marked as ${newStatus.toLowerCase()}.`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this story idea? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "story_ideas", id));
      toast.success("Story idea deleted permanently.");
    } catch (error) {
      console.error("Error deleting idea:", error);
      toast.error("Failed to delete idea.");
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesFilter = filter === "ALL" || idea.status === filter;
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         idea.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "TEAM_MILESTONE": return "Team Milestone";
      case "INNOVATIVE_PROJECT": return "Innovative Project";
      case "RECOGNITION": return "Recognition Spotlight";
      default: return "Other";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
      case "REVIEWED": return "bg-green-50 text-green-600 border-green-100";
      case "ARCHIVED": return "bg-stone-50 text-stone-600 border-stone-100";
      default: return "bg-stone-50 text-stone-600 border-stone-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-stone-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold italic text-stone-900">Story Ideas</h1>
          <p className="text-stone-500 text-sm mt-1">Review and manage submissions from the Internal Comms Team page.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-stone-400" size={18} />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all text-sm font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Ideas List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(idea.status)}`}>
                        {idea.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-600 border border-stone-200">
                        {getCategoryLabel(idea.category)}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold italic text-stone-900">{idea.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {idea.status !== "REVIEWED" && (
                      <button 
                        onClick={() => handleUpdateStatus(idea.id, "REVIEWED")}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                        title="Mark as Reviewed"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}
                    {idea.status !== "ARCHIVED" && (
                      <button 
                        onClick={() => handleUpdateStatus(idea.id, "ARCHIVED")}
                        className="p-2 text-stone-400 hover:bg-stone-50 rounded-xl transition-colors"
                        title="Archive"
                      >
                        <Archive size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <p className="text-stone-600 leading-relaxed font-light">
                  {idea.description}
                </p>

                <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs text-stone-400">
                  <div className="flex items-center space-x-2">
                    <User size={14} />
                    <span>{idea.authorName} ({idea.authorEmail})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>{idea.createdAt ? format(idea.createdAt.toDate(), "MMM d, yyyy • h:mm a") : "Just now"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 border-dashed">
            <div className="w-16 h-16 bg-stone-50 text-stone-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">No story ideas found</h3>
            <p className="text-stone-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
