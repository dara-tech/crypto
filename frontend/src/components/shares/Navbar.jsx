import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaHome, FaSchool, FaEnvelope, FaChartLine, FaBuilding, FaUserCog } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { HiOutlineAcademicCap, HiAcademicCap } from 'react-icons/hi';
import { MdOutlineHome, MdHome } from 'react-icons/md';
import { IoInformationCircleOutline, IoInformationCircle } from 'react-icons/io5';
import { MdOutlineMail, MdMail } from 'react-icons/md';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { BsPersonGear } from 'react-icons/bs';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [language, setCurrentLanguage] = useState(i18n.language || 'en');
  const location = useLocation();
  
  // Update language when i18n language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      setCurrentLanguage(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Set initial language from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
    // Initialize language if not set
    if (!language) {
      setCurrentLanguage(i18n.language || 'en');
    }
  }, [i18n.language]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  // Fetch companies data on mount
  useEffect(() => {
    getCompanies();
  }, []);

  // Fetch user profile whenever token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getAdminProfile();
    }
  }, [localStorage.getItem('token')]);

  // Update current company when companies data changes
  useEffect(() => {
    if (companies && companies.length > 0) {
      setCurrentCompany(companies[0]);
    }
  }, [companies]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const adminLinks = [
    { 
      to: '/admin/dashboard', 
      label: t('dashboard'), 
      icon: <RiDashboardLine className="w-5 h-5" />,
      activeIcon: <RiDashboardFill className="w-5 h-5" />
    },
    { 
      to: '/admin/companies', 
      label: t('companies'), 
      icon: <FaBuilding className="w-5 h-5" />,
      activeIcon: <FaBuilding className="w-5 h-5 text-primary" />
    },
    { 
      to: '/admin/profile', 
      label: t('Profile'), 
      icon: <BsPersonGear className="w-5 h-5" />,
      activeIcon: <BsPersonGear className="w-5 h-5 text-primary" />
    }
  ];

  const publicLinks = [
    { 
      to: '/', 
      label: t('home'), 
      icon: <MdOutlineHome className="w-5 h-5" />,
      activeIcon: <MdHome className="w-5 h-5" />
    },
    { 
      to: '/companies', 
      label: t('companies'), 
      icon: <FaBuilding className="w-5 h-5" />,
      activeIcon: <FaBuilding className="w-5 h-5 text-primary" />
    },
    { 
      to: '/about', 
      label: t('about'), 
      icon: <IoInformationCircleOutline className="w-5 h-5" />,
      activeIcon: <IoInformationCircle className="w-5 h-5" />
    },
    { 
      to: '/contact', 
      label: t('contact'), 
      icon: <MdOutlineMail className="w-5 h-5" />,
      activeIcon: <MdMail className="w-5 h-5" />
    }
  ];

  const activeLinks = isAdminRoute ? adminLinks : publicLinks;

  return (
    <nav className="bg-base-100 border-b border-base-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {companiesLoading ? (
                  <div className="w-8 h-8 animate-pulse bg-base-200 rounded-full" />
                ) : currentCompany?.logo ? (
                  <img
                    className="object-cover w-full h-full"
                    src={currentCompany.logo}
                    alt={currentCompany.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-company-logo.png';
                    }}
                  />
                ) : (
                  <img
                    className="object-cover w-full h-full"
                    src="/default-company-logo.png"
                    alt="Default Company Logo"
                  />
                )}
              </div>
              <span className="ml-3 text-xl font-bold text-primary">
                {companiesLoading ? (
                  <div className="h-6 w-32 animate-pulse bg-base-200 rounded" />
                ) : (
                  currentCompany?.name || t('appName')
                )}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {activeLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 relative h-full
                  ${location.pathname === link.to
                    ? 'text-primary after:absolute after:bottom-[-1px] after:left-1 after:w-full after:h-[2px] after:bg-primary after:rounded-none'
                    : 'text-base-content hover:bg-base-200/20'
                  }`}
              >
                {location.pathname === link.to ? link.activeIcon : link.icon}
                {link.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {profileLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 animate-pulse bg-base-200 rounded-full" />
                <div className="h-4 w-24 animate-pulse bg-base-200 rounded" />
              </div>
            ) : profile?.user ? (
              <div className="relative">
                <button
                  onClick={toggleMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-base-200">
                    {profile.user.profilePic ? (
                      <img
                        src={profile.user.profilePic}
                        alt={profile.user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-base-content/50" />
                    )}
                  </div>
                  <span className="max-w-[100px] truncate">{profile.user.name}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to={"/"}
                        className="block px-4 py-2 text-sm text-base-content hover:bg-base-200"
                      >
                        {t('menu.title')}
                      </Link>
                      <Link
                        to={"/admin"}
                        className="block px-4 py-2 text-sm text-base-content hover:bg-base-200"
                      >
                        {t('menu.admin')}
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-base-content hover:bg-base-200"
                      >
                        {t('auth.logout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-content hover:bg-primary-focus"
              >
                {t('login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:bg-base-200"
            >
              <span className="sr-only">{t('menu.open')}</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {activeLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex px-3 py-2 rounded-md text-base font-medium items-center gap-2 relative
                ${location.pathname === link.to
                  ? 'text-primary after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-primary after:rounded-none'
                  : 'text-base-content hover:bg-base-200/50'
                }`}
            >
              {location.pathname === link.to ? link.activeIcon : link.icon}
              {link.label}
            </Link>
          ))}
          
          {profileLoading ? (
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="w-8 h-8 animate-pulse bg-base-200 rounded-full" />
              <div className="h-4 w-24 animate-pulse bg-base-200 rounded" />
            </div>
          ) : profile?.user ? (
            <>
              <div className="space-y-2">
                {/* Mobile Language Switcher */}
                <div className="border-b border-base-200 py-1">
                  <LanguageSwitcher />
                </div>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-base-200">
                    {profile.user.profilePic ? (
                      <img
                        src={profile.user.profilePic}
                        alt={profile.user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <FaUserCircle className="w-full h-full text-base-content/50" />
                    )}
                  </div>
                  <span className="text-base-content">{profile.user.name}</span>
                </div>
              </div>
              <Link
                to={isAdminRoute ? "/admin/profile" : "/profile"}
                className="flex px-3 py-2 rounded-md text-base font-medium text-base-content hover:bg-base-200"
              >
                {t('profile.settings')}
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-base-content hover:bg-base-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-content hover:bg-primary-focus"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
