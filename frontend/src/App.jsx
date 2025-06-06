import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import LoginPage from './components/auth/loginPage'
import RegisterPage from './components/auth/RegisterPage'
import Profile from './components/admin/profile/layout'
import Navbar from './components/shares/Navbar'
import SettingPage from './components/shares/SettingPage'
import { useThemeStore } from './store/useThemeStore'
import SchoolEdit from './components/admin/schools/SchoolEdit'
import SchoolList from './components/admin/schools/SchoolList'
import About from './components/clientPage/About'
import Footer from './components/shares/Footer'
import Mission from './components/clientPage/Mission'
import Vision from './components/clientPage/Vision'

function App() {
  const { theme } = useThemeStore()
  return (
    <div data-theme={theme}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/setting" element={<SettingPage />} />
        <Route path="/admin/schools" element={<SchoolList />} />
        <Route path="/admin/schools/:id" element={<SchoolEdit />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/vision" element={<Vision />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>
  )
}

export default App
