import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaBuilding, FaChevronDown } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { MdOutlineHome, MdHome, MdOutlineMail, MdMail, MdPrivacyTip } from 'react-icons/md';
import { IoInformationCircleOutline, IoInformationCircle } from 'react-icons/io5';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { BsPersonGear } from 'react-icons/bs';
import { HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [language, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (lng) => setCurrentLanguage(lng);
    i18n.on('languageChanged', handleLanguageChange);
    return () => i18n.off('languageChanged', handleLanguageChange);
  }, [i18n]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage) setCurrentLanguage(savedLanguage);
    if (!language) setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language, language]);

  useEffect(() => { getCompanies(); }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) getAdminProfile();
  }, [getAdminProfile]);

  useEffect(() => {
    if (companies && companies.length > 0) {
      setCurrentCompany(companies[0]);
    }
  }, [companies]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: t('dashboard'), icon: <RiDashboardLine />, activeIcon: <RiDashboardFill /> },
    { to: '/admin/companies', label: t('companies'), icon: <FaBuilding />, activeIcon: <FaBuilding /> },
    { to: '/admin/profile', label: t('Profile'), icon: <BsPersonGear />, activeIcon: <BsPersonGear /> },
  ];

  const publicLinks = [
    { to: '/', label: t('home'), icon: <MdOutlineHome />, activeIcon: <MdHome /> },
    { to: '/companies', label: t('companies'), icon: <FaBuilding />, activeIcon: <FaBuilding /> },
    { to: '/about', label: t('about'), icon: <IoInformationCircleOutline />, activeIcon: <IoInformationCircle /> },
    { to: '/contact', label: t('contact'), icon: <MdOutlineMail />, activeIcon: <MdMail /> },
    { to: '/privacy-policy', label: t('privacy-policy'), icon: <MdPrivacyTip />, activeIcon: <MdPrivacyTip /> },
  ];

  // Show admin links when authenticated, public links when not
  const activeLinks = profile?.user ? adminLinks : publicLinks;

  return (
    <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative w-10 h-10 rounded-xl bg-transparent flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {companiesLoading ? (
                  <div className="w-8 h-8 animate-pulse bg-white/20 rounded-lg" />
                ) : currentCompany?.logo ? (
                  <img
                    className="object-cover w-8 h-8 rounded-lg"
                    src={currentCompany.logo}
                    alt={currentCompany.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-company-logo.png';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 bg-white rounded text-blue-600 flex items-center justify-center font-bold text-sm">
                    C
                  </div>
                )}
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {companiesLoading ? (
                    <div className="h-6 w-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  ) : (
                    currentCompany?.name || t('appName')
                  )}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {activeLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {isActive ? link.activeIcon : link.icon}
                  </span>
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>

            {/* Profile Section */}
            {profileLoading ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ) : profile?.user ? (
              <div className="relative ml-4" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
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
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <FaUserCircle className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-900 rounded-full z-10"></div>
                  </div>
                  <span className="max-w-[120px] truncate text-gray-700 dark:text-gray-300">
                    {profile.user.name}
                  </span>
                  <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                            {profile.user.profilePic ? (
                              <img
                                src={profile.user.profilePic}
                                alt={profile.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                <FaUserCircle className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {profile.user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {profile.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      {/* <Link
                        to="/"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <MdHome className="w-4 h-4 mr-3" />
                        {t('menu.title') || 'Home'}
                      </Link> */}
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <HiOutlineCog className="w-4 h-4 mr-3" />
                        {t('menu.admin') || 'Admin Panel'}
                      </Link>
                      <Link
                        to="/admin/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      >
                        <HiOutlineUser className="w-4 h-4 mr-3" />
                        {t('profile.settings') || 'Profile Settings'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                      >
                        <HiOutlineLogout className="w-4 h-4 mr-3" />
                        {t('auth.logout') || 'Logout'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {t('login') || 'Login'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <span className="sr-only">{t('menu.open') || 'Open menu'}</span>
              <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transform transition-all duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-0' : 'rotate-0 -translate-y-2'
                }`}>
                  <span className="block absolute h-0.5 w-6 bg-current transform transition-all duration-300" />
                </span>
                <span className={`absolute inset-0 transform transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}>
                  <span className="block absolute h-0.5 w-6 bg-current transform transition-all duration-300" />
                </span>
                <span className={`absolute inset-0 transform transition-all duration-300 ${
                  isMenuOpen ? '-rotate-45 translate-y-0' : 'rotate-0 translate-y-2'
                }`}>
                  <span className="block absolute h-0.5 w-6 bg-current transform transition-all duration-300" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`} ref={mobileMenuRef}>
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/20 dark:border-gray-700/20">
          {activeLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {isActive ? link.activeIcon : link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
          
          {/* Mobile Language Switcher */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Profile Section */}
          {profileLoading ? (
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-10 h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="h-4 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ) : profile?.user ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
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
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <FaUserCircle className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {profile.user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {profile.user.email}
                  </p>
                </div>
              </div>
              
              <Link
                to="/admin/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                <HiOutlineUser className="w-5 h-5" />
                {t('profile.settings') || 'Profile Settings'}
              </Link>
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <HiOutlineLogout className="w-5 h-5" />
                {t('auth.logout') || 'Logout'}
              </button>
            </div>
          ) : (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {t('login') || 'Login'}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;