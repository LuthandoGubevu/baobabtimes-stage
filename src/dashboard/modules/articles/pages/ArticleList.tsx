import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  FileText
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { StatusBadge } from '@/dashboard/components/StatusBadge';
import { EmptyState } from '@/dashboard/components/EmptyState';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Article {
  id: string;
  title: string;
  authorName: string;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  category: string;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt: any;
  views: number;
}

export const ArticleList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      setArticles(docs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching articles:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
        toast.success('Article deleted permanently.');
      } catch (error) {
        console.error("Error deleting article:", error);
        toast.error('Failed to delete article.');
      }
    }
  };

  const handleBulkStatusUpdate = async (status: 'PUBLISHED' | 'ARCHIVED') => {
    try {
      await Promise.all(selectedArticles.map(id => 
        updateDoc(doc(db, 'articles', id), { status })
      ));
      setSelectedArticles([]);
    } catch (error) {
      console.error("Error updating articles:", error);
    }
  };

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter(a => a !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20">Loading articles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Articles</h1>
          <p className="text-zinc-500 mt-1">Manage and publish your editorial content.</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/articles/new')}
          className="flex items-center justify-center px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
        >
          <Plus size={18} className="mr-2" />
          Create New Article
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {selectedArticles.length > 0 && (
              <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-left-2 transition-all">
                <span className="text-xs font-bold text-zinc-500 px-2">{selectedArticles.length} selected</span>
                <button 
                  onClick={() => handleBulkStatusUpdate('PUBLISHED')}
                  className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  Publish
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('ARCHIVED')}
                  className="px-3 py-1.5 bg-white border border-zinc-200 text-zinc-600 rounded-lg text-xs font-bold hover:bg-zinc-50 transition-colors"
                >
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                    checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState 
                      icon={FileText}
                      title="No articles found"
                      description="Start writing your first article to see it here."
                      actionLabel="Create Article"
                      onAction={() => navigate('/dashboard/articles/new')}
                    />
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr 
                    key={article.id} 
                    className={cn(
                      "hover:bg-zinc-50/50 transition-colors group",
                      selectedArticles.includes(article.id) && "bg-zinc-50"
                    )}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleSelect(article.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span 
                          onClick={() => navigate(`/dashboard/articles/${article.id}/edit`)}
                          className="text-sm font-bold text-zinc-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          {article.title}
                        </span>
                        <span className="text-xs text-zinc-400 mt-0.5">ID: {article.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
                          <img 
                            src={article.author?.avatar || `https://i.pravatar.cc/150?u=${article.author?.id || article.authorId}`} 
                            alt={article.author?.name || article.authorName} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-sm text-zinc-600">{article.author?.name || article.authorName || "Anonymous"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">
                      {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 font-medium">{article.views || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => navigate(`/dashboard/articles/${article.id}/edit`)}
                          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(article.id)}
                          className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
