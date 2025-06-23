import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './components/layouts/MainLayout';
import LoginPage from './components/auth/loginPage';
import RegisterPage from './components/auth/RegisterPage';
import useAuth from './hooks/useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthProvider';
import { useThemeStore } from './store/useThemeStore';
import UserManagementPage from './components/admin/users/UserManagementPage';
import Profile from './components/admin/profile/layout';
import PaymentViewerPage from './pages/PaymentViewerPage';
import CompanyList from './components/admin/companies/CompanyList';
import CompanyEdit from './components/admin/companies/CompanyEdit';
import SettingPage from './components/shares/SettingPage';
import About from './components/clientPage/About';
import Mission from './components/clientPage/Mission';
import Vision from './components/clientPage/Vision';
import Contact from './components/clientPage/Contact';
import PolicyPrivacy from './components/clientPage/PolicyPrivacy';
import TermsAndConditions from './components/clientPage/TermsAndConditions';
import Home from './components/clientPage/Home';
import FaqPage from './components/clientPage/FaqPage';
import ProfessionalPage from './components/clientPage/ProfessionalPage';
import Chatbot from './components/chatbot/Chatbot';
import Navbar from './components/shares/Navbar';
import Footer from './components/shares/Footer';
import SuperAdminLayout from './components/admin/layouts/SuperAdminLayout';
import SuperAdminDashboard from './components/admin/dashboard/SuperAdminDashboard';
import SEO from './components/SEO';
import { routesMetadata } from './config/metadata';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const PrivateRoute = ({ children, roles }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(profile.type)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  const { isAuthenticated, profile } = useAuth();
  const { theme } = useThemeStore();
  const isSuperAdmin = profile?.type === 'super_admin';

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <Toaster position="top-right" />
          <div data-theme={theme}>
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <>
                    <SEO {...routesMetadata.login} />
                    {!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
                  </>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <>
                    <SEO {...routesMetadata.register} />
                    {!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />}
                  </>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <>
                    <SEO {...routesMetadata.about} />
                    <About />
                  </>
                } 
              />
              <Route 
                path="/mission" 
                element={
                  <>
                    <SEO {...routesMetadata.mission} />
                    <Mission />
                  </>
                } 
              />
              <Route 
                path="/vision" 
                element={
                  <>
                    <SEO {...routesMetadata.vision} />
                    <Vision />
                  </>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <>
                    <SEO {...routesMetadata.contact} />
                    <Contact />
                  </>
                } 
              />
              <Route 
                path="/privacy-policy" 
                element={
                  <>
                    <SEO {...routesMetadata.privacyPolicy} />
                    <PolicyPrivacy />
                  </>
                } 
              />
              <Route 
                path="/terms-conditions" 
                element={
                  <>
                    <SEO {...routesMetadata.termsAndConditions} />
                    <TermsAndConditions />
                  </>
                } 
              />
              <Route 
                path="/faq" 
                element={
                  <>
                    <SEO {...routesMetadata.faq} />
                    <FaqPage />
                  </>
                } 
              />
              <Route 
                path="/setting" 
                element={
                  <>
                    <SEO {...routesMetadata.settings} />
                    <SettingPage />
                  </>
                } 
              />
              <Route 
                path="/professional" 
                element={
                  <>
                    <SEO {...routesMetadata.professional} />
                    <ProfessionalPage />
                  </>
                } 
              />

              {/* Protected Routes */}
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<SuperAdminDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payments" element={<PaymentViewerPage />} />
                <Route path="/companies" element={<CompanyList />} />
                <Route path="/companies/:id" element={<CompanyEdit />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/admin/settings" element={<SettingPage />} />
              </Route>

              {/* Root Route - Conditional rendering based on authentication */}
              <Route 
                path="/" 
                element={
                  isSuperAdmin ? (
                    <PrivateRoute roles={['super_admin']}>
                      <SuperAdminLayout />
                    </PrivateRoute>
                  ) : (
                    <>
                      <SEO {...routesMetadata.home} />
                      <Home />
                    </>
                  )
                }
              >
                {isSuperAdmin && (
                  <>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<SuperAdminDashboard />} />
                  </>
                )}
              </Route>

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <>
                    <SEO 
                      title="404 - Page Not Found"
                      description="The page you are looking for does not exist."
                    />
                    <Navigate to="/" />
                  </>
                } 
              />
            </Routes>
            {/* Only show Footer if not super admin */}
            {!isSuperAdmin && <Footer />}
            <Chatbot />
          </div>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
