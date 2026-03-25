import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "../../../firebase";
import RecognitionCard from "../components/RecognitionCard";
import { Plus, Heart, Award, Star } from "lucide-react";
import { handleFirestoreError, OperationType } from "../../../lib/firestore-errors";

/**
 * RecognitionPage component for displaying the recognition wall
 */
export default function RecognitionPage() {
  const { data: recognitions, isLoading, error } = useQuery({
    queryKey: ["recognitions"],
    queryFn: async () => {
      try {
        // Fetch all recognitions and filter in memory to avoid index requirement
        const q = query(
          collection(db, "recognitions"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(r => r.status === "APPROVED");
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, "recognitions");
        return [];
      }
    }
  });

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-serif font-bold mb-4 italic">Recognition Wall</h1>
          <p className="text-stone-500 text-lg font-light">
            Celebrating the achievements, teamwork, and innovation of our incredible people.
          </p>
        </div>
        
        <button className="flex items-center space-x-2 px-6 py-3 bg-stone-900 text-white font-bold rounded-full hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          <Plus className="w-5 h-5" />
          <span>Recognize a Peer</span>
        </button>
      </header>

      {/* Stats / Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-serif font-bold">124</p>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Teamwork</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-serif font-bold">86</p>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Innovation</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-serif font-bold">52</p>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Excellence</p>
          </div>
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="py-20 text-center">Loading recognition feed...</div>
      ) : error ? (
        <div className="py-20 text-center text-red-500">Error loading recognition.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recognitions?.map((rec) => (
            <RecognitionCard key={rec.id} recognition={rec} />
          ))}
          {/* Mock data for visual completeness */}
          {[1, 2, 3, 4, 5].map(i => (
            <RecognitionCard 
              key={`mock-${i}`} 
              recognition={{
                id: i,
                from: { name: "Alex Rivera", id: i },
                to: { name: "Jordan Smith", id: i + 10 },
                message: "Incredible work on the Q1 planning session. Your attention to detail is unmatched!",
                category: i % 3 === 0 ? "Innovation" : i % 2 === 0 ? "Teamwork" : "Excellence",
                createdAt: new Date()
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
