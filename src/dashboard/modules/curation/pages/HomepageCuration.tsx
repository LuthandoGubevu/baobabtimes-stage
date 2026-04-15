import React, { useState, useEffect } from 'react';
import { 
  Pin, 
  GripVertical, 
  Plus, 
  Trash2, 
  Eye, 
  Layout, 
  ArrowUpRight,
  Info,
  Search,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

import { ImagePlaceholder } from '@/components/ui/GenericPlaceholder';

export const HomepageCuration = () => {
  const [pinnedArticles, setPinnedArticles] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'articles'), 
      where('isPinned', '==', true),
      orderBy('pinnedOrder', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pinned = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPinnedArticles(pinned);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'articles');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const searchArticles = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const q = query(
          collection(db, 'articles'),
          where('status', '==', 'PUBLISHED'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter((art: any) => 
            art.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
            !art.isPinned
          );
        setSearchResults(results);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'articles');
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchArticles, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      await updateDoc(doc(db, 'articles', id), {
        isPinned: !isPinned,
        pinnedOrder: isPinned ? null : pinnedArticles.length,
        updatedAt: new Date()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `articles/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Homepage Curation</h1>
          <p className="text-zinc-500 mt-1">Manage featured content and hero sections on the public site.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.open('/', '_blank')}
            className="flex items-center px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            <Eye size={18} className="mr-2" />
            Preview Site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Layout size={20} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900">Hero Section</h2>
              </div>
            </div>

            <div className="space-y-4">
              {pinnedArticles.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                  <Pin className="mx-auto text-zinc-300 mb-3" size={32} />
                  <p className="text-sm text-zinc-500">No articles pinned to the homepage yet.</p>
                </div>
              ) : (
                pinnedArticles.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group hover:bg-white hover:border-zinc-200 hover:shadow-md transition-all cursor-move"
                  >
                    <div className="text-zinc-300 group-hover:text-zinc-400 transition-colors">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                      <ImagePlaceholder className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.category}</span>
                        <span className="text-[10px] font-bold text-zinc-300">•</span>
                        <span className="text-[10px] font-bold text-zinc-400">By {item.authorName}</span>
                      </div>
                      <h3 className="text-sm font-bold text-zinc-900 truncate">{item.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => togglePin(item.id, true)}
                        className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
              <Info size={18} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                The first article in this list will be displayed as the primary hero story with a large image. Subsequent articles will appear in the "Featured" grid.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl shadow-zinc-200">
            <h2 className="text-lg font-bold mb-4">Curation Tips</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rotate featured content every 2-3 days to keep the homepage fresh for employees.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ensure hero images are high resolution (at least 1920x1080) for best display.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Mix categories (News, Culture, Strategy) to provide a balanced view of the company.
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Quick Search</h2>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Find articles to pin to the homepage.</p>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                {isSearching ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-zinc-300" size={20} />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(art => (
                    <div key={art.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 transition-colors group cursor-pointer">
                      <span className="text-xs font-medium text-zinc-600 truncate mr-2">{art.title}</span>
                      <button 
                        onClick={() => togglePin(art.id, false)}
                        className="p-1 rounded-md bg-zinc-100 text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ))
                ) : searchTerm && (
                  <p className="text-[10px] text-zinc-400 text-center py-2">No results found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
