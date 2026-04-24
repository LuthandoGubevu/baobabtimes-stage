import { 
  BrowserRouter, 
  Routes, 
  Route,
  Navigate
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import RootLayout from "./layouts/RootLayout";
import HomePage from "./pages/HomePage";
import ArticleDetailPage from "./features/articles/pages/ArticleDetailPage";
import PostDetailPage from "./features/articles/pages/PostDetailPage";
import ArticlesPage from "./features/articles/pages/ArticlesPage";
import ValuesPage from "./features/values/pages/ValuesPage";
import ThisIsMePage from "./pages/ThisIsMePage";
import RecognitionPage from "./features/recognition/pages/RecognitionPage";
import AskCeoPage from "./features/ceo-ama/pages/AskCeoPage";
import CeoArchivePage from "./features/articles/pages/CeoArchivePage";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import ContributorDashboard from "./features/articles/pages/ContributorDashboard";
import CreateArticlePage from "./features/articles/pages/CreateArticlePage";
import CeoPanel from "./features/ceo-ama/pages/CeoPanel";
import LoginPage from "./features/auth/pages/LoginPage";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import LoginModal from "./features/auth/components/LoginModal";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import HelpPage from "./pages/HelpPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import ContactPage from "./pages/ContactPage";

// Dashboard Imports
import { DashboardLayout } from './dashboard/layouts/DashboardLayout';
import { DashboardOverview } from './dashboard/modules/overview/pages/DashboardOverview';
import { ArticleList } from './dashboard/modules/articles/pages/ArticleList';
import { ArticleEditor } from './dashboard/modules/articles/pages/ArticleEditor';
import { RecognitionModeration } from './dashboard/modules/recognition/pages/RecognitionModeration';
import { CeoAmaModeration } from './dashboard/modules/ask-ceo/pages/CeoAmaModeration';
import { CeoMessageList } from './dashboard/modules/from-the-ceo/pages/CeoMessageList';
import { CeoMessageEditor } from './dashboard/modules/from-the-ceo/pages/CeoMessageEditor';
import { SettingsPage } from './dashboard/modules/settings/pages/SettingsPage';
import { ProfileSettings } from './dashboard/modules/settings/components/ProfileSettings';
import { SecuritySettings } from './dashboard/modules/settings/components/SecuritySettings';
import { NotificationSettings } from './dashboard/modules/settings/components/NotificationSettings';
import { 
  CategoryList, 
  UserManagement
} from './dashboard/pages/Placeholders';

// This is me Management
import { ThisIsMeList } from './dashboard/modules/this-is-me/pages/ThisIsMeList';
import { ThisIsMeEditor } from './dashboard/modules/this-is-me/pages/ThisIsMeEditor';

const queryClient = new QueryClient();

const DashboardIndex = () => {
  return (
    <ProtectedRoute role="ADMIN_OR_CEO">
      <DashboardOverview />
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LoginModal />
          <PWAInstallPrompt />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="articles" element={<ArticlesPage />} />
                <Route path="values" element={<ValuesPage />} />
                <Route path="this-is-me" element={<ThisIsMePage />} />
                <Route path="articles/:id" element={<ArticleDetailPage />} />
                <Route path="posts/:slug" element={<PostDetailPage />} />
                <Route path="recognition" element={<RecognitionPage />} />
                <Route path="ask-ceo" element={<AskCeoPage />} />
                <Route path="from-the-ceo" element={<CeoArchivePage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="guidelines" element={<GuidelinesPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="contributor" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ContributorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="contributor/create" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <CreateArticlePage />
                  </ProtectedRoute>
                } />
                <Route path="ceo-panel" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoPanel />
                  </ProtectedRoute>
                } />
                <Route path="admin" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Route>

              <Route path="/dashboard" element={
                <ProtectedRoute role="ADMIN_OR_CEO">
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardIndex />} />
                <Route path="articles" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ArticleList />
                  </ProtectedRoute>
                } />
                <Route path="articles/new" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ArticleEditor />
                  </ProtectedRoute>
                } />
                <Route path="articles/:id/edit" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ArticleEditor />
                  </ProtectedRoute>
                } />
                <Route path="categories" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <CategoryList />
                  </ProtectedRoute>
                } />
                <Route path="from-the-ceo" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoMessageList />
                  </ProtectedRoute>
                } />
                <Route path="from-the-ceo/new" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoMessageEditor />
                  </ProtectedRoute>
                } />
                <Route path="from-the-ceo/:id/edit" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoMessageEditor />
                  </ProtectedRoute>
                } />
                <Route path="recognition" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <RecognitionModeration />
                  </ProtectedRoute>
                } />
                <Route path="ask-ceo" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoAmaModeration />
                  </ProtectedRoute>
                } />
                <Route path="ask-ceo/:id/answer" element={
                  <ProtectedRoute role="CEO_ONLY">
                    <CeoAmaModeration />
                  </ProtectedRoute>
                } />
                <Route path="users" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="this-is-me" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ThisIsMeList />
                  </ProtectedRoute>
                } />
                <Route path="this-is-me/new" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ThisIsMeEditor />
                  </ProtectedRoute>
                } />
                <Route path="this-is-me/:id/edit" element={
                  <ProtectedRoute role="ADMIN_OR_CEO">
                    <ThisIsMeEditor />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={<SettingsPage />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="security" element={<SecuritySettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
