import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import LoginPage from './components/auth/loginPage';
import RegisterPage from './components/auth/RegisterPage';
import Profile from './components/admin/profile/layout';
import Navbar from './components/shares/Navbar';
import SettingPage from './components/shares/SettingPage';
import { useThemeStore } from './store/useThemeStore';
import About from './components/clientPage/About';
import Footer from './components/shares/Footer';
import Mission from './components/clientPage/Mission';
import Vision from './components/clientPage/Vision';
import CompanyEdit from './components/admin/companies/CompanyEdit';
import CompanyList from './components/admin/companies/CompanyList';
import Contact from './components/clientPage/Contact';
import PolicyPrivacy from './components/clientPage/PolicyPrivacy';
import TermsAndConditions from './components/clientPage/TermsAndConditions';
import Home from './components/clientPage/Home';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PaymentViewerPage from "./pages/PaymentViewerPage";
import FaqPage from './components/clientPage/FaqPage';
import ProfessionalPage from './components/clientPage/ProfessionalPage';
import Chatbot from './components/chatbot/Chatbot';
import UserManagementPage from './components/admin/users/UserManagementPage';
import EditUserPage from './components/admin/users/EditUserPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { theme } = useThemeStore()
  return (
    <QueryClientProvider client={queryClient}>
      <div data-theme={theme}>
        <Navbar />
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PolicyPrivacy />} />
            <Route path="/terms-conditions" element={<TermsAndConditions />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/professional" element={<ProfessionalPage />} />
            
            {/* Protected routes - only accessible when authenticated */}
            {/* Generic Protected routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'user', 'payment_viewer']} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<UserManagementPage />} /> 
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/users/:userId/edit" element={<EditUserPage />} />
              <Route path="/companies/:id" element={<CompanyEdit />} />
              <Route path="/companies" element={<CompanyList />} />
            </Route>
            
            {/* Payment viewer route - accessible to payment_viewer and admin roles */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'payment_viewer']} />}>
              <Route path="/payments" element={<PaymentViewerPage />} />
            </Route>

            {/* Redirect to home for any unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <Chatbot />
      </div>
    </QueryClientProvider>
  )
}

export default App
