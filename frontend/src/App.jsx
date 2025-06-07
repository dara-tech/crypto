import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './components/auth/loginPage';
import RegisterPage from './components/auth/RegisterPage';
import Profile from './components/admin/profile/layout';
import Navbar from './components/shares/Navbar';
import SettingPage from './components/shares/SettingPage';
import { useThemeStore } from './store/useThemeStore';
import About from './components/clientPage/About'
import Footer from './components/shares/Footer'
import Mission from './components/clientPage/Mission'
import Vision from './components/clientPage/Vision'
import CampanyEdit from './components/admin/companies/CampanyEdit'
import CampanyList from './components/admin/companies/CampanyList'
import Contact from './components/clientPage/Contact'
import PolicyPrivacy from './components/clientPage/PolicyPrivacy'
import Home from './components/clientPage/Home'

function App() {
  const { theme } = useThemeStore()
  return (
    <div data-theme={theme}>
      <BrowserRouter>
        {/* <Suspense fallback={<div>Loading...</div>}> */}
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/setting" element={<SettingPage />} />
            <Route path="/admin/companies/:id" element={<CampanyEdit />} />
            <Route path="/admin/companies" element={<CampanyList />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PolicyPrivacy />} />
            <Route path="/" element={<Home />} />
            
          </Routes>
          <Footer />
        {/* </Suspense> */}
      </BrowserRouter>
    </div>
  )
}

export default App
