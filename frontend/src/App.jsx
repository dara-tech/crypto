import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const { theme } = useThemeStore()
  return (
    <div data-theme={theme}>
      <BrowserRouter>
        {/* <Suspense fallback={<div>Loading...</div>}> */}
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
            <Route element={<ProtectedRoute allowedRoles={['admin', 'user', 'payment_viewer']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/companies/:id" element={<CompanyEdit />} />
              <Route path="/admin/companies" element={<CompanyList />} />
            </Route>
            
            {/* Payment viewer route - accessible to payment_viewer and admin roles */}
            {/* <Route element={<ProtectedRoute allowedRoles={['admin', 'payment_viewer']} />}> */}
              <Route path="/payments" element={<PaymentViewerPage />} />
            {/* </Route> */}

            {/* Redirect to home for any unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        {/* </Suspense> */}
      </BrowserRouter>
    </div>
  )
}

export default App
