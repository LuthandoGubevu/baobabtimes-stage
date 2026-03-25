import { 
  BrowserRouter, 
  Routes, 
  Route, 
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import RootLayout from "./layouts/RootLayout";
import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage";
import ArticlesPage from "./features/articles/pages/ArticlesPage";
import RecognitionPage from "./features/recognition/pages/RecognitionPage";
import AskCeoPage from "./features/ceo-ama/pages/AskCeoPage";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ContributorDashboard from "./features/articles/pages/ContributorDashboard";
import CreateArticlePage from "./features/articles/pages/CreateArticlePage";
import CeoPanel from "./features/ceo-ama/pages/CeoPanel";
import LoginPage from "./features/auth/pages/LoginPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";

// Dashboard Imports
import { DashboardLayout } from './dashboard/layouts/DashboardLayout';
import { DashboardOverview } from './dashboard/modules/overview/pages/DashboardOverview';
import { ArticleList } from './dashboard/modules/articles/pages/ArticleList';
import { ArticleEditor } from './dashboard/modules/articles/pages/ArticleEditor';
import { RecognitionModeration } from './dashboard/modules/recognition/pages/RecognitionModeration';
import { CeoAmaModeration } from './dashboard/modules/ask-ceo/pages/CeoAmaModeration';
import { HomepageCuration } from './dashboard/modules/curation/pages/HomepageCuration';
import { 
  CategoryList, 
  MediaLibrary, 
  UserManagement, 
  SettingsPage 
} from './dashboard/pages/Placeholders';

// Placeholder Pages
const Home = () => (
  <div className="space-y-12">
    <section className="text-center py-20 bg-stone-900 text-white rounded-3xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/baobab/1920/1080')] bg-cover bg-center"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
          The Baobab Times
        </h1>
        <p className="text-xl text-stone-300 font-light mb-8 max-w-2xl mx-auto">
          Reimagining internal communication through editorial excellence and employee engagement.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-white text-stone-900 font-semibold rounded-full hover:bg-stone-100 transition-all">
            Read Latest News
          </button>
          <button className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all">
            Recognize a Peer
          </button>
        </div>
      </div>
    </section>

    <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div className="flex justify-between items-end border-b border-stone-200 pb-4">
          <h2 className="text-3xl font-serif font-bold italic">Featured Articles</h2>
          <button className="text-sm font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[16/10] bg-stone-200 rounded-2xl overflow-hidden mb-4">
                <img 
                  src={`https://picsum.photos/seed/article${i}/800/500`} 
                  alt="Article" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Company News</p>
              <h3 className="text-xl font-serif font-bold group-hover:text-stone-600 transition-colors">
                How we're scaling our global operations in 2026
              </h3>
              <p className="text-stone-500 text-sm mt-2 line-clamp-2">
                An in-depth look at our strategic roadmap and the teams making it happen across three continents.
              </p>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-8">
        <div className="bg-stone-100 p-6 rounded-3xl">
          <h2 className="text-xl font-serif font-bold mb-4">Recent Recognition</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200/50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-stone-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Sarah Jenkins</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Engineering</p>
                  </div>
                </div>
                <p className="text-sm text-stone-600 italic">"Amazing work on the new API deployment! You saved us so much time."</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors">
            See All Recognition
          </button>
        </div>

        <div className="bg-stone-900 text-white p-6 rounded-3xl">
          <h2 className="text-xl font-serif font-bold mb-2">Ask the CEO</h2>
          <p className="text-stone-400 text-sm mb-6">Have a question for our leadership? Get direct answers here.</p>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-stone-300 mb-1">Latest Answer:</p>
              <p className="text-sm font-serif font-bold">"What is our policy on remote work for the next quarter?"</p>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-white text-stone-900 text-sm font-semibold rounded-xl hover:bg-stone-100 transition-colors">
            Ask a Question
          </button>
        </div>
      </aside>
    </section>
  </div>
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="articles" element={<ArticlesPage />} />
                <Route path="articles/:id" element={<ArticleDetailPage />} />
                <Route path="recognition" element={<RecognitionPage />} />
                <Route path="ask-ceo" element={<AskCeoPage />} />
                <Route path="login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="contributor" element={
                  <ProtectedRoute role="EDITOR">
                    <ContributorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="contributor/create" element={
                  <ProtectedRoute role="EDITOR">
                    <CreateArticlePage />
                  </ProtectedRoute>
                } />
                <Route path="ceo-panel" element={
                  <ProtectedRoute role="ADMIN">
                    <CeoPanel />
                  </ProtectedRoute>
                } />
                <Route path="admin" element={
                  <ProtectedRoute role="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Route>

              {/* New Dashboard System */}
              <Route path="/dashboard" element={
                <ProtectedRoute role="EDITOR">
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardOverview />} />
                <Route path="articles" element={<ArticleList />} />
                <Route path="articles/new" element={<ArticleEditor />} />
                <Route path="articles/:id/edit" element={<ArticleEditor />} />
                <Route path="categories" element={<CategoryList />} />
                <Route path="curation" element={<HomepageCuration />} />
                <Route path="recognition" element={<RecognitionModeration />} />
                <Route path="ask-ceo" element={<CeoAmaModeration />} />
                <Route path="ask-ceo/:id/answer" element={<CeoAmaModeration />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
