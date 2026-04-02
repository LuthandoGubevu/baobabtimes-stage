import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  MoreVertical, 
  Clock, 
  MessageSquare, 
  Award, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';
import { StatusBadge } from '@/dashboard/components/StatusBadge';
import { EmptyState } from '@/dashboard/components/EmptyState';
import { cn } from '@/lib/utils';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { toast } from 'sonner';

export const RecognitionModeration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recognitions, setRecognitions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'recognitions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecognitions(recData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await updateDoc(doc(db, 'recognitions', id), {
        status,
        updatedAt: new Date()
      });
      toast.success(`Recognition ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error('Error updating recognition status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this recognition? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'recognitions', id));
        toast.success('Recognition deleted permanently.');
      } catch (error) {
        console.error('Error deleting recognition:', error);
        toast.error('Failed to delete recognition.');
      }
    }
  };

  const filteredRecognitions = recognitions.filter(rec => 
    rec.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.to?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Peer Recognition</h1>
          <p className="text-zinc-500 mt-1">Approve or reject employee shout-outs before they go public.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search recognitions..."
              className="pl-10 pr-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all w-[240px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
            <Filter size={18} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {filteredRecognitions.length === 0 ? (
        <EmptyState 
          title="No recognitions found" 
          description="There are no peer recognitions matching your search or criteria."
          icon={Award}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecognitions.map((rec) => (
            <div key={rec.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold text-xs border border-zinc-200">
                      {rec.from?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{rec.from}</span>
                      <span className="text-xs text-zinc-400">to {rec.to}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusBadge status={rec.status as any} />
                    <button 
                      onClick={() => handleDelete(rec.id)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-red-600 transition-colors"
                      title="Delete Recognition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 italic text-sm text-zinc-600 leading-relaxed">
                  "{rec.content}"
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {rec.createdAt?.toDate ? rec.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </div>
                  <div className="flex items-center">
                    <Award size={12} className="mr-1" />
                    Recognition
                  </div>
                </div>
              </div>

              {rec.status === 'PENDING' && (
                <div className="flex border-t border-zinc-100">
                  <button 
                    onClick={() => handleStatusUpdate(rec.id, 'REJECTED')}
                    className="flex-1 py-3 flex items-center justify-center text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-r border-zinc-100"
                  >
                    <X size={18} className="mr-2" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(rec.id, 'APPROVED')}
                    className="flex-1 py-3 flex items-center justify-center text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Check size={18} className="mr-2" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-zinc-500 font-medium">Showing {filteredRecognitions.length} recognitions</p>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400 disabled:opacity-50" disabled>
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
