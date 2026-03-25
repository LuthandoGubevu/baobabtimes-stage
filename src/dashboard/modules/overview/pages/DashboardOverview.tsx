import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Award, 
  MessageSquare, 
  ArrowUpRight, 
  Clock,
  Image as ImageIcon
} from 'lucide-react';
import { collection, query, where, onSnapshot, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-start justify-between">
      <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
        <Icon size={22} className="text-zinc-600" />
      </div>
      {change && (
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {change}
          <ArrowUpRight size={12} className={cn("ml-1", trend === 'down' && "rotate-90")} />
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-sm font-medium text-zinc-500">{title}</h3>
      <p className="text-3xl font-bold text-zinc-900 mt-1 tracking-tight">{value}</p>
    </div>
  </div>
);

const RecentActivityItem = ({ title, time, type }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-zinc-100 last:border-0 group cursor-pointer">
    <div className="flex items-center space-x-4">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        type === 'article' ? "bg-blue-50 text-blue-600" : 
        type === 'recognition' ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
      )}>
        {type === 'article' ? <FileText size={18} /> : 
         type === 'recognition' ? <Award size={18} /> : <MessageSquare size={18} />}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{title}</h4>
        <div className="flex items-center text-xs text-zinc-500 mt-0.5">
          <Clock size={12} className="mr-1" />
          {time}
        </div>
      </div>
    </div>
    <button className="p-2 rounded-lg hover:bg-zinc-50 text-zinc-400 opacity-0 group-hover:opacity-100 transition-all">
      <ArrowUpRight size={16} />
    </button>
  </div>
);

export const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    pendingRecognition: 0,
    unansweredQuestions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const usersCount = await getCountFromServer(collection(db, 'users'));
      const articlesCount = await getCountFromServer(query(collection(db, 'articles'), where('status', '==', 'PUBLISHED')));
      const recognitionCount = await getCountFromServer(query(collection(db, 'recognitions'), where('status', '==', 'PENDING')));
      const questionsCount = await getCountFromServer(query(collection(db, 'ama_questions'), where('status', '==', 'PENDING')));

      setStats({
        users: usersCount.data().count,
        articles: articlesCount.data().count,
        pendingRecognition: recognitionCount.data().count,
        unansweredQuestions: questionsCount.data().count
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}</h1>
          <p className="text-zinc-500 mt-1">Here's what's happening at The Baobab Times today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            View Site
          </button>
          <button 
            onClick={() => navigate('/dashboard/articles/new')}
            className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
          >
            Create Article
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.users.toString()} icon={Users} trend="up" />
        <StatCard title="Articles Published" value={stats.articles.toString()} icon={FileText} trend="up" />
        <StatCard title="Pending Recognition" value={stats.pendingRecognition.toString()} icon={Award} trend="down" />
        <StatCard title="Unanswered Questions" value={stats.unansweredQuestions.toString()} icon={MessageSquare} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-zinc-900">Recent Activity</h2>
              <button className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-zinc-100">
              <p className="text-sm text-zinc-500 py-4 italic">Real-time activity feed coming soon...</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 p-8 rounded-2xl text-white shadow-xl shadow-zinc-200 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-2">Editor's Tip</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Remember to add alt-text to your images for better accessibility. It helps everyone stay informed.
              </p>
              <button className="mt-6 text-sm font-bold flex items-center group-hover:translate-x-1 transition-transform">
                Learn More <ArrowUpRight size={16} className="ml-1" />
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <FileText size={120} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/dashboard/recognition')}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors text-left group"
              >
                <Award size={20} className="text-amber-600 mb-2" />
                <span className="text-xs font-bold text-zinc-900 block">Moderate Recognition</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard/ask-ceo')}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors text-left group"
              >
                <MessageSquare size={20} className="text-purple-600 mb-2" />
                <span className="text-xs font-bold text-zinc-900 block">Answer Questions</span>
              </button>
              <button className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors text-left group">
                <ImageIcon size={20} className="text-blue-600 mb-2" />
                <span className="text-xs font-bold text-zinc-900 block">Upload Media</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard/users')}
                className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors text-left group"
              >
                <Users size={20} className="text-emerald-600 mb-2" />
                <span className="text-xs font-bold text-zinc-900 block">Manage Team</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
