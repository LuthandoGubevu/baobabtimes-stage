import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText,
  User,
  Archive,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { StatusBadge } from '@/dashboard/components/StatusBadge';
import { EmptyState } from '@/dashboard/components/EmptyState';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { articleService } from '@/features/articles/services/articleService';
import { toast, Toaster } from 'sonner';

interface CeoMessage {
  id: string;
  title: string;
  authorName: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt: any;
  publishedAt?: any;
  isHomepageActive?: boolean;
}

export const CeoMessageList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CeoMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filter by category "From the CEO"
    const q = query(
      collection(db, 'articles'), 
      where('category', '==', 'From the CEO'),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CeoMessage[];
      setMessages(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching CEO messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this CEO message? This action cannot be undone.')) {
      try {
        await articleService.deleteArticle(id);
        toast.success('Message removed completely.');
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error('Failed to delete message.');
      }
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await articleService.archiveCeoMessage(id);
      toast.success('Message archived and removed from homepage.');
    } catch (error) {
      console.error("Error archiving message:", error);
      toast.error('Failed to archive message.');
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium">Loading CEO messages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" richColors />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-zinc-900 tracking-tight">From the CEO</h1>
          <p className="text-zinc-500 mt-2 max-w-xl">
            Manage leadership communication and strategic updates. Only one message can be active on the homepage at a time.
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/from-the-ceo/new')}
          className="flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
        >
          <Plus size={18} className="mr-2" />
          Create CEO Message
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Message</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Published Date</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">Active</th>
                <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState 
                      icon={User}
                      title="No CEO messages found"
                      description="Start your leadership communication by creating your first message."
                      actionLabel="Create CEO Message"
                      onAction={() => navigate('/dashboard/from-the-ceo/new')}
                    />
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => navigate(`/dashboard/from-the-ceo/${msg.id}/edit`)}
                          className="text-base font-bold text-zinc-900 group-hover:text-zinc-600 transition-colors cursor-pointer font-serif"
                        >
                          {msg.title}
                        </span>
                        <span className="text-xs text-zinc-400 mt-1">ID: {msg.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge status={msg.status} />
                    </td>
                    <td className="px-8 py-6 text-sm text-zinc-500">
                      {msg.publishedAt?.toDate ? msg.publishedAt.toDate().toLocaleDateString() : 'Not published'}
                    </td>
                    <td className="px-8 py-6">
                      {msg.isHomepageActive ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                          <CheckCircle2 size={12} className="mr-1" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-400">
                          <XCircle size={12} className="mr-1" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {msg.isHomepageActive && (
                          <button 
                            onClick={() => handleArchive(msg.id)}
                            className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-orange-600 transition-colors"
                            title="Archive (Remove from Homepage)"
                          >
                            <Archive size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/dashboard/from-the-ceo/${msg.id}/edit`)}
                          className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                          title="Edit Message"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="p-2.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-red-600 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden divide-y divide-zinc-100">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center">
              <EmptyState 
                icon={User}
                title="No CEO messages found"
                description="Start your leadership communication by creating your first message."
                actionLabel="Create CEO Message"
                onAction={() => navigate('/dashboard/from-the-ceo/new')}
              />
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className="p-4 space-y-4 hover:bg-zinc-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span 
                      onClick={() => navigate(`/dashboard/from-the-ceo/${msg.id}/edit`)}
                      className="text-base font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer truncate font-serif"
                    >
                      {msg.title}
                    </span>
                    <span className="text-xs text-zinc-400 mt-0.5 truncate">ID: {msg.id}</span>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={msg.status} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-2">
                    {msg.isHomepageActive ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 w-fit">
                        <CheckCircle2 size={12} className="mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-400 w-fit">
                        <XCircle size={12} className="mr-1" />
                        Inactive
                      </span>
                    )}
                    <span className="text-xs text-zinc-500">
                      {msg.publishedAt?.toDate ? msg.publishedAt.toDate().toLocaleDateString() : 'Not published'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-1">
                    {msg.isHomepageActive && (
                      <button 
                        onClick={() => handleArchive(msg.id)}
                        className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-orange-600 transition-colors"
                        title="Archive (Remove from Homepage)"
                      >
                        <Archive size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => navigate(`/dashboard/from-the-ceo/${msg.id}/edit`)}
                      className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                      title="Edit Message"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-red-600 transition-colors"
                      title="Delete Message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
