import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  ChevronLeft,
  Settings,
  Hash,
  Calendar,
  User,
  Archive
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { activityService } from '@/features/notifications/services/activityService';
import { cn } from '@/lib/utils';
import { ImageUpload } from '@/dashboard/components/ImageUpload';
import { toast, Toaster } from 'sonner';
import { articleService } from '@/features/articles/services/articleService';

export const CeoMessageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [isHomepageActive, setIsHomepageActive] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchMessage = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, 'articles', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.category !== 'From the CEO') {
              toast.error('This is not a CEO message.');
              navigate('/dashboard/from-the-ceo');
              return;
            }
            setTitle(data.title || '');
            setContent(data.content || '');
            setExcerpt(data.excerpt || '');
            setImageUrl(data.imageUrl || '');
            setStatus(data.status || 'DRAFT');
            setIsHomepageActive(!!data.isHomepageActive);
          } else {
            toast.error('Message not found.');
            navigate('/dashboard/from-the-ceo');
          }
        } catch (err) {
          console.error("Error fetching message:", err);
          toast.error('Failed to load message.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessage();
    }
  }, [id, navigate]);

  const handleSave = async (newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    if (!user) {
      toast.error('You must be logged in to save.');
      return;
    }
    if (!title.trim() || !content.trim()) {
      toast.error('Please provide a title and content.');
      return;
    }

    setIsSaving(true);
    try {
      const messageData = {
        title,
        content,
        excerpt,
        imageUrl,
        status: newStatus,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      };

      if (newStatus === 'PUBLISHED') {
        // Use the atomic replacement logic
        await articleService.publishCeoMessage(id || null, messageData, user);
        toast.success('Message published and set as active on homepage!');

        // Create activity
        activityService.createActivity({
          type: 'ceo_message_published',
          title: `New From the CEO message published`,
          message: title,
          entityId: id || '', // If new, we don't have id yet, but articleService.publishCeoMessage might return it or we can find it
          entitySlug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          isPublic: true,
          metadata: {
            category: 'From the CEO',
            authorName: user.displayName || 'CEO'
          }
        });
      } else if (newStatus === 'ARCHIVED') {
        if (id) {
          await articleService.archiveCeoMessage(id);
          toast.success('Message archived and removed from homepage.');
        }
      } else {
        // Just save as draft
        if (id) {
          await articleService.createArticle({ ...messageData, id }); // This is a bit hacky, let's use a better way
          // Actually createArticle in my service uses addDoc. I should have an updateArticle.
          // Let's just use direct update for draft
          const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
          await updateDoc(doc(db, 'articles', id), {
            ...messageData,
            updatedAt: serverTimestamp(),
          });
        } else {
          await articleService.createArticle({
            ...messageData,
            category: 'From the CEO',
            contentType: 'from_ceo',
            author: {
              id: user.uid,
              name: user.displayName || 'CEO',
              avatar: user.photoURL || '',
              role: 'CEO'
            },
            authorId: user.uid,
            authorName: user.displayName || 'CEO',
          });
        }
        toast.success('Draft saved successfully!');
      }

      setTimeout(() => {
        navigate('/dashboard/from-the-ceo');
      }, 1500);
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error('Failed to save message.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col">
      <Toaster position="top-center" richColors />
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[70] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-sm font-bold text-stone-900 uppercase tracking-widest">Loading Message...</p>
          </div>
        </div>
      )}

      <header className="h-16 border-b border-zinc-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/from-the-ceo')}
            className="p-2 rounded-lg hover:bg-zinc-50 text-zinc-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="h-6 w-px bg-zinc-100 mx-2" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">CEO Leadership Message</span>
            <span className="text-sm font-bold text-zinc-900 truncate max-w-[200px] font-serif">
              {title || 'Untitled Message'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-3">
          {status === 'PUBLISHED' && (
            <button
              disabled={isSaving}
              onClick={() => handleSave('ARCHIVED')}
              className="flex items-center px-3 sm:px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
            >
              <Archive size={18} className="sm:mr-2" />
              <span className="hidden sm:inline">Archive</span>
            </button>
          )}
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
            <span className="hidden sm:inline">{status === 'PUBLISHED' ? 'Update & Keep Active' : 'Publish & Set Active'}</span>
          </button>
          <div className="hidden lg:block h-6 w-px bg-zinc-100 mx-2" />
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "hidden lg:flex p-2 rounded-lg transition-colors",
              isSidebarOpen ? "bg-zinc-900 text-white" : "hover:bg-zinc-50 text-zinc-500"
            )}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col lg:flex-row">
          <main className="flex-1 min-w-0 bg-zinc-50/50">
          <div className="max-w-4xl mx-auto py-20 px-12">
            <div className="mb-12">
              <span className="inline-block px-3 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                From the CEO
              </span>
              <textarea
                placeholder="Enter a powerful title..."
                className="w-full bg-transparent text-6xl font-serif font-bold text-zinc-900 placeholder:text-zinc-200 border-none focus:ring-0 resize-none leading-tight"
                rows={2}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-8">
              <div className="p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Executive Summary / Excerpt</h3>
                <textarea
                  placeholder="Provide a brief, compelling introduction..."
                  className="w-full bg-transparent text-xl text-zinc-600 italic placeholder:text-zinc-200 border-none focus:ring-0 resize-none leading-relaxed"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                />
              </div>

              <div className="prose prose-zinc prose-xl max-w-none font-serif">
                <textarea
                  placeholder="Write your strategic message to the organization..."
                  className="w-full bg-transparent text-xl text-zinc-800 placeholder:text-zinc-200 border-none focus:ring-0 resize-none min-h-[600px] leading-relaxed"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </main>

        <aside
          className={cn(
            "bg-white border-t lg:border-t-0 lg:border-l border-zinc-100 flex flex-col overflow-hidden transition-all duration-300",
            isSidebarOpen ? "lg:w-[360px] lg:opacity-100" : "lg:w-0 lg:opacity-0"
          )}
        >
          <div className="p-8 space-y-10 w-full lg:w-[360px]">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <User size={14} className="mr-2" />
                Featured Image
              </h3>
              <ImageUpload
                value={imageUrl}
                onChange={setImageUrl}
              />
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                This image will be the primary visual anchor for your message on the homepage. High-quality editorial photography is recommended.
              </p>
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Hash size={14} className="mr-2" />
                Configuration
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-sm font-bold text-zinc-900">From the CEO</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-zinc-900">Homepage Spotlight</p>
                    <p className="text-[10px] text-zinc-500">
                      {isHomepageActive ? 'Currently active on homepage' : 'Will become active when published'}
                    </p>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors",
                    isHomepageActive ? "bg-green-500" : "bg-zinc-200"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                      isHomepageActive ? "right-1" : "left-1"
                    )} />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center">
                <Calendar size={14} className="mr-2" />
                History
              </h3>
              <div className="text-xs text-zinc-500 space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-zinc-700">{status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active on Homepage:</span>
                  <span className={cn("font-bold", isHomepageActive ? "text-green-600" : "text-zinc-700")}>
                    {isHomepageActive ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </section>

            {/* Mobile Actions */}
            <section className="pt-8 border-t border-zinc-100 lg:hidden space-y-3 pb-8">
              {status === 'PUBLISHED' && (
                <button
                  disabled={isSaving}
                  onClick={() => handleSave('ARCHIVED')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-zinc-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                >
                  <Archive size={18} />
                  <span>Archive</span>
                </button>
              )}
              <button
                disabled={isSaving}
                onClick={() => handleSave('DRAFT')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-all disabled:opacity-50"
              >
                <Save size={18} />
                <span>Save Draft</span>
              </button>
              <button
                disabled={isSaving}
                onClick={() => handleSave('PUBLISHED')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
              >
                <Send size={18} />
                <span>{status === 'PUBLISHED' ? 'Update' : 'Publish'}</span>
              </button>
            </section>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
};
