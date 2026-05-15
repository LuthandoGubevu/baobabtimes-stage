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
import { activityService } from '@/features/notifications/services/activityService';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/dashboard/components/ImageUpload';
import { toast, Toaster } from 'sonner';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { Trash2 } from 'lucide-react';
import { articleService } from '@/features/articles/services/articleService';

import { CATEGORIES } from '@/constants/categories';

export const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [featuredImage, setFeaturedImage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, 'articles', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setContent(data.content || '');
            setExcerpt(data.excerpt || '');
            setCategory(data.category || 'Company News');
            setFeaturedImage(data.featuredImage || data.imageUrl || '');
          } else {
            toast.error('Article not found.');
            navigate('/dashboard/articles');
          }
        } catch (err) {
          console.error("Error fetching article:", err);
          toast.error('Failed to load article.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticle();
    }
  }, [id, navigate]);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!user) {
      toast.error('You must be logged in to save an article.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide a title and content.');
      return;
    }

    setIsSaving(true);
    const path = id ? `articles/${id}` : 'articles';
    let articleId = id;
    try {
      const articleData = {
        title,
        content,
        excerpt,
        category,
        featuredImage,
        status,
        updatedAt: serverTimestamp(),
        publishedAt: status === 'PUBLISHED' ? serverTimestamp() : null,
      };

      if (id) {
        try {
          await updateDoc(doc(db, 'articles', id), articleData);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      } else {
        const newId = doc(collection(db, 'articles')).id;
        articleId = newId;
        try {
          await setDoc(doc(db, 'articles', newId), {
            ...articleData,
            author: {
              id: user.uid,
              name: user.displayName || 'Anonymous',
              avatar: user.photoURL || '',
              role: 'Contributor' // Default role
            },
            authorId: user.uid,
            authorName: user.displayName || 'Anonymous',
            views: 0,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `articles/${newId}`);
        }
      }

      toast.success(`Article ${status === 'PUBLISHED' ? 'published' : 'saved as draft'} successfully!`);

      // Create activity if published
      if (status === 'PUBLISHED') {
        activityService.createActivity({
          type: 'article_published',
          title: `New article published: ${title}`,
          message: excerpt || content.substring(0, 100) + '...',
          entityId: articleId,
          entitySlug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          isPublic: true,
          metadata: {
            category,
            authorName: user.displayName || 'Anonymous'
          }
        });
      }

      // Redirect back to list after a short delay to show the toast
      setTimeout(() => {
        navigate('/dashboard/articles');
      }, 1500);
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error('Failed to save article. Please check your permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to permanently delete this article? This action cannot be undone.')) {
      setIsSaving(true);
      try {
        await articleService.deleteArticle(id);
        toast.success('Article deleted successfully.');
        setTimeout(() => navigate('/dashboard/articles'), 1000);
      } catch (err) {
        console.error("Error deleting article:", err);
        toast.error('Failed to delete article.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      <Toaster position="top-center" richColors />
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">Loading Article...</p>
          </div>
        </div>
      )}
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

        <div className="flex items-center space-x-1 sm:space-x-3">
          <button
            disabled={isSaving}
            onClick={() => handleSave('DRAFT')}
            className="flex items-center px-3 sm:px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 rounded-xl transition-all disabled:opacity-50"
          >
            <Save size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            disabled={isSaving}
            onClick={() => handleSave('PUBLISHED')}
            className="flex items-center px-4 sm:px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
          >
            <Send size={18} className="sm:mr-2" />
            <span className="hidden sm:inline">Publish</span>
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

      <div className="flex-1 flex flex-col lg:flex-row overflow-x-hidden overflow-y-auto lg:overflow-hidden">
        {/* Main Editor Area */}
        <main className="flex-1 min-w-0 lg:overflow-y-auto bg-zinc-50/50">
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
                placeholder="Article excerpt (brief summary)..."
                className="w-full bg-transparent text-lg text-zinc-500 italic placeholder:text-zinc-200 border-none focus:ring-0 resize-none mb-4"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
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
        <aside
          className={cn(
            "bg-white border-t lg:border-t-0 lg:border-l border-zinc-100 overflow-hidden flex flex-col transition-all duration-300",
            isSidebarOpen ? "lg:w-[320px] opacity-100" : "h-0 lg:h-auto lg:w-0 opacity-0"
          )}
        >
          <div className="p-6 space-y-8 w-full lg:w-[320px]">
            <section className="space-y-4">
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
              />
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
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

            {id && (
              <section className="pt-8 border-t border-zinc-100">
                <button
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  <span>Delete Article</span>
                </button>
              </section>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
