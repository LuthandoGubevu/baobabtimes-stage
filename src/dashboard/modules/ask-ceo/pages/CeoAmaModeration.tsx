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
  Send,
  User,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { StatusBadge } from '@/dashboard/components/StatusBadge';
import { EmptyState } from '@/dashboard/components/EmptyState';
import { cn } from '@/lib/utils';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export const CeoAmaModeration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'ama_questions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const qData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setQuestions(qData);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ama_questions');
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'ANSWERED' | 'REJECTED', answer?: string) => {
    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      };
      if (answer) updateData.answer = answer;
      
      await updateDoc(doc(db, 'ama_questions', id), updateData);
      setAnsweringId(null);
      setAnswerText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `ama_questions/${id}`);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.content?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Ask the CEO</h1>
          <p className="text-zinc-500 mt-1">Triage and answer employee questions for the leadership team.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search questions..."
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

      {filteredQuestions.length === 0 ? (
        <EmptyState 
          title="No questions found" 
          description="There are no questions matching your search or criteria."
          icon={MessageSquare}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-bold text-xs border border-zinc-200">
                      {q.isAnonymous ? <ShieldCheck size={18} /> : <User size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">{q.isAnonymous ? 'Anonymous' : q.authorName || 'Unknown'}</span>
                      <span className="text-xs text-zinc-400">{q.upvotes || 0} Upvotes</span>
                    </div>
                  </div>
                  <StatusBadge status={q.status as any} />
                </div>

                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 italic text-lg font-serif font-bold text-zinc-900 leading-relaxed">
                  "{q.content}"
                </div>

                {q.status === 'ANSWERED' && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700 leading-relaxed">
                    <span className="font-bold block mb-1">CEO Answer:</span>
                    {q.answer}
                  </div>
                )}

                {answeringId === q.id && (
                  <div className="space-y-3 pt-2">
                    <textarea 
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type the CEO's answer here..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 min-h-[100px]"
                    />
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => setAnsweringId(null)}
                        className="px-4 py-2 text-sm font-bold text-zinc-500 hover:bg-zinc-50 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(q.id, 'ANSWERED', answerText)}
                        className="px-6 py-2 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800"
                      >
                        Post Answer
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {q.createdAt?.toDate ? q.createdAt.toDate().toLocaleDateString() : 'Just now'}
                  </div>
                  <div className="flex items-center">
                    <MessageSquare size={12} className="mr-1" />
                    Ask the CEO
                  </div>
                </div>
              </div>

              {q.status === 'PENDING' && !answeringId && (
                <div className="flex border-t border-zinc-100">
                  <button 
                    onClick={() => handleStatusUpdate(q.id, 'REJECTED')}
                    className="flex-1 py-3 flex items-center justify-center text-sm font-bold text-red-600 hover:bg-red-50 transition-colors border-r border-zinc-100"
                  >
                    <X size={18} className="mr-2" />
                    Reject
                  </button>
                  <button 
                    onClick={() => setAnsweringId(q.id)}
                    className="flex-1 py-3 flex items-center justify-center text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Send size={18} className="mr-2" />
                    Answer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-zinc-500 font-medium">Showing {filteredQuestions.length} questions</p>
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
