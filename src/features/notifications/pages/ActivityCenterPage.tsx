import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Filter,
  FileText,
  Award,
  MessageSquare,
  Activity as ActivityIcon,
  ShieldCheck,
  BellOff
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useActivity } from '../hooks/useActivity';
import { ActivityFeedItem } from '../components/ActivityFeedItem';

export default function ActivityCenterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPublicOnly = !user;
  
  const [limit, setLimit] = useState(25);
  const { activities, isLoading, error } = useActivity(isPublicOnly, limit);
  const [activeFilter, setActiveFilter] = useState('All');

  // Activity type mapping based on typical types in Baobab Times
  const filters = [
    { label: 'All', value: 'All' },
    { label: 'Recognition', value: 'recognition_approved' },
    { label: 'Articles', value: 'article_published' },
    { label: 'Ask the CEO', value: 'ceo_message_published' },
    { label: 'System', value: 'system' }
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'recognition_approved') return activity.type.includes('recognition');
    if (activeFilter === 'article_published') return activity.type.includes('article');
    if (activeFilter === 'ceo_message_published') return activity.type.includes('ceo');
    if (activeFilter === 'system') return activity.type.includes('system') || activity.type.includes('user');
    return activity.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-600 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-serif font-bold italic text-stone-900">Activity Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full">
              {activities.length} Updates
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto custom-scrollbar flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-stone-100 animate-pulse flex gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-stone-100 rounded w-1/4"></div>
                  <div className="h-3 bg-stone-50 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-2">Unable to load activity</h3>
            <p className="text-red-700 text-sm">Please check your connection and try again.</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white border border-stone-100 p-12 rounded-3xl text-center">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 italic">No recent activity yet.</h3>
            <p className="text-stone-500 text-sm max-w-sm mx-auto">
              Check back later for new stories, recognitions, and updates from across the company.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="hover:bg-stone-50/50 transition-colors">
                <ActivityFeedItem activity={activity} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredActivities.length > 0 && (
          <div className="mt-8 flex flex-col items-center space-y-4">
            {activities.length >= limit && (
              <button 
                onClick={() => setLimit(prev => prev + 25)}
                className="px-6 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs uppercase tracking-widest rounded-full transition-colors"
              >
                Load More
              </button>
            )}
            <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">
              Showing {filteredActivities.length} results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
