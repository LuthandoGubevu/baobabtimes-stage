import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Send, 
  Eye, 
  ChevronLeft, 
  Image as ImageIcon, 
  Settings, 
  Hash, 
  Calendar,
  Plus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Company News');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category || 'Company News');
        }
      };
      fetchArticle();
    }
  }, [id]);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!user) return;
    if (!title.trim() || !content.trim()) {
      alert('Please provide a title and content.');
      return;
    }

    setIsSaving(true);
    try {
      const articleData = {
        title,
        content,
        category,
        status,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, 'articles', id), articleData);
      } else {
        const newId = doc(collection(db, 'articles')).id;
        await setDoc(doc(db, 'articles', newId), {
          ...articleData,
          authorId: user.uid,
          authorName: user.displayName,
          views: 0,
          createdAt: serverTimestamp(),
        });
        navigate(`/dashboard/articles/${newId}/edit`, { replace: true });
      }
      alert(`Article ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);
    } catch (error) {
      console.error("Error saving article:", error);
      alert('Failed to save article.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      {/* Editor Header */}
      <header className="h-16 border-b border-zinc-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard/articles')}
            className="p-2 rounded-lg hover:bg-zinc-50 text-zinc-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-zinc-100 mx-2" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Drafting Article</span>
            <span className="text-sm font-bold text-zinc-900 truncate max-w-[200px]">
              {title || 'Untitled Article'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            disabled={isSaving}
            onClick={() => handleSave('DRAFT')}
            className="flex items-center px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} className="mr-2" />
            Save Draft
          </button>
          <button 
            disabled={isSaving}
            onClick={() => handleSave('PUBLISHED')}
            className="flex items-center px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
          >
            <Send size={18} className="mr-2" />
            Publish
          </button>
          <div className="h-6 w-px bg-zinc-100 mx-2" />
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isSidebarOpen ? "bg-zinc-900 text-white" : "hover:bg-zinc-50 text-zinc-500"
            )}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50">
          <div className="max-w-3xl mx-auto py-20 px-8">
            <textarea
              placeholder="Article Title..."
              className="w-full bg-transparent text-5xl font-bold text-zinc-900 placeholder:text-zinc-200 border-none focus:ring-0 resize-none leading-tight mb-8"
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <div className="prose prose-zinc prose-lg max-w-none">
              <textarea
                placeholder="Start writing your story..."
                className="w-full bg-transparent text-xl text-zinc-700 placeholder:text-zinc-200 border-none focus:ring-0 resize-none min-h-[500px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </main>

        {/* Editor Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 320 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="bg-white border-l border-zinc-100 overflow-hidden flex flex-col"
        >
          <div className="p-6 space-y-8 w-[320px]">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <ImageIcon size={14} className="mr-2" />
                Featured Image
              </h3>
              <div className="aspect-video bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:border-zinc-300 transition-all cursor-pointer group">
                <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Upload Image</span>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Hash size={14} className="mr-2" />
                Metadata
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                  >
                    <option>Company News</option>
                    <option>Employee Spotlight</option>
                    <option>Strategy</option>
                    <option>Culture</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Calendar size={14} className="mr-2" />
                Publishing
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Schedule for later</span>
                  <div className="w-10 h-5 bg-zinc-200 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600">Pin to homepage</span>
                  <div className="w-10 h-5 bg-zinc-900 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </motion.aside>
      </div>
    </div>
  );
};
