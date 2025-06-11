import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUserCircle, FaBuilding, FaChevronDown, FaMoneyBillWave, FaUserTie } from 'react-icons/fa';
import axios from 'axios';
import LanguageSwitcher from './LanguageSwitcher';
import { MdOutlineHome, MdHome, MdOutlineMail, MdMail, MdPrivacyTip, MdOutlineDescription } from 'react-icons/md';
import { IoInformationCircleOutline, IoInformationCircle } from 'react-icons/io5';
import { RiDashboardLine, RiDashboardFill } from 'react-icons/ri';
import { BsPersonGear } from 'react-icons/bs';
import { HiOutlineLogout, HiOutlineUser, HiOutlineCog } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAboutSubMenuOpen, setIsAboutSubMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [language, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const profileMenuRef = useRef(null);
  const aboutSubMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

useEffect(() => {
  const role = profile?.type || null;
  setUserRole(role);
}, [profile]);


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
      if (aboutSubMenuRef.current && !aboutSubMenuRef.current.contains(event.target)) {
        setIsAboutSubMenuOpen(false);
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
    setIsAboutSubMenuOpen(false);
  };

  const toggleAboutSubMenu = (e) => {
    e.stopPropagation();
    setIsAboutSubMenuOpen(!isAboutSubMenuOpen);
    setIsProfileMenuOpen(false);
  };

  const toggleMobileSubMenu = (label) => {
    setOpenMobileSubMenu(openMobileSubMenu === label ? null : label);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
  };

  const publicLinks = [
    { to: '/', label: t('home'), icon: <MdOutlineHome />, activeIcon: <MdHome /> },
    {
      label: t('about'),
      icon: <IoInformationCircleOutline />,
      activeIcon: <IoInformationCircle />,
      isDropdown: true,
      subMenu: [
        { to: '/about', label: t('about'), icon: <IoInformationCircleOutline />, activeIcon: <IoInformationCircle /> },
        { to: '/professional', label: t('professional'), icon: <FaUserTie />, activeIcon: <FaUserTie /> },
        { to: '/faq', label: t('faq'), icon: <MdOutlineDescription />, activeIcon: <MdOutlineDescription /> },
        { to: '/privacy-policy', label: t('privacy-policy'), icon: <MdPrivacyTip />, activeIcon: <MdPrivacyTip /> },
        { to: '/terms-conditions', label: t('terms-conditions'), icon: <MdOutlineDescription />, activeIcon: <MdOutlineDescription /> },
      ]
    },
    { to: '/contact', label: t('contact'), icon: <MdOutlineMail />, activeIcon: <MdMail /> },
  ];

  let linksForAuthenticatedUser = [];
  const paymentLinkItem = { to: '/payments', label: t('paymentViewer.title'), icon: <FaMoneyBillWave />, activeIcon: <FaMoneyBillWave /> };
  const userProfileLinkItem = { to: '/profile', label: t('Profile'), icon: <BsPersonGear />, activeIcon: <BsPersonGear /> };

  if (userRole === 'admin') { // Condition for admin
    const companyEditUrl = currentCompany ? `/admin/companies/${currentCompany._id}` : '/admin/companies';
    linksForAuthenticatedUser = [
      { to: '/admin/dashboard', label: t('dashboard'), icon: <RiDashboardLine />, activeIcon: <RiDashboardFill /> },
      paymentLinkItem,
      { to: companyEditUrl, label: t('companies'), icon: <FaBuilding />, activeIcon: <FaBuilding /> },
      userProfileLinkItem,
    ];
  } else if (userRole === 'payment_viewer') { // Condition for payment_viewer
    linksForAuthenticatedUser = [
      paymentLinkItem,
      userProfileLinkItem, 
    ];
  } else if (profile) { // Fallback for any other authenticated user
    linksForAuthenticatedUser = [userProfileLinkItem]; 
  }

  const activeLinks = profile ? linksForAuthenticatedUser : publicLinks;
  // The mobileMenuItems array is not directly used for rendering mobile links in the current JSX,
  // as the mobile menu iterates over `activeLinks`. This section is simplified.
  // If mobileMenuItems were used elsewhere, it would need similar conditional logic.

  return (
    <nav className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative w-10 h-10 rounded-xl bg-transparent flex items-center justify-center group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                {companiesLoading ? (
                  <div className="w-8 h-8 animate-pulse rounded-lg" />
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
                  <div className="w-6 h-6 rounded  flex items-center justify-center font-bold text-sm">
                    {currentCompany?.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold ">
                  {companiesLoading ? (
                    <div className="h-6 w-32 animate-pulse  rounded" />
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
              if (link.isDropdown) {
                const isDropdownActive = link.subMenu && link.subMenu.some(subLink => location.pathname.startsWith(subLink.to));
                return (
                  <div key={link.label} className="relative" ref={aboutSubMenuRef}>
                    <button
                      onClick={toggleAboutSubMenu}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                        isDropdownActive
                          ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 text-primary'
                          : 'hover:text-primary'
                      }`}
                    >
                      <span className={`transition-transform duration-200 ${isDropdownActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`}>
                        {isDropdownActive ? link.activeIcon : link.icon}
                      </span>
                      {link.label}
                      <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAboutSubMenuOpen ? 'rotate-180' : ''}`} />
                      {isDropdownActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      )}
                    </button>
                    {isAboutSubMenuOpen && (
                      <div className="absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-base-200 ring-1 ring-black ring-opacity-5 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                        <div className="py-1">
                          {link.subMenu.map(subLink => {
                            const isSubActive = location.pathname.startsWith(subLink.to);
                            return (
                              <Link
                                key={subLink.to}
                                to={subLink.to}
                                onClick={() => setIsAboutSubMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-150 ${
                                  isSubActive ? 'text-primary bg-base-300' : 'text-base-content/80 hover:bg-base-300 hover:text-primary'
                                }`}
                              >
                                {isSubActive ? subLink.activeIcon : subLink.icon}
                                {subLink.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/5 to-purple-500/5 text-primary'
                        : 'hover:text-primary'
                    }`}
                  >
                    <span className={`transition-transform duration-200 ${isActive ? 'scale-110 text-primary' : 'group-hover:scale-110'}`}>
                      {isActive ? link.activeIcon : link.icon}
                    </span>
                    {link.label}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    )}
                  </Link>
                );
              }
            })}

            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>

            {/* Profile Section */}
            {profileLoading ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="w-8 h-8 animate-pulse rounded-full" />
                <div className="h-4 w-24 animate-pulse rounded" />
              </div>
            ) : profile ? (
              <div className="relative ml-4" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white ">
                        {profile.profilePic ? (
                          <img
                            src={profile.profilePic}
                            alt={profile.name}
                            className="w-full h-full object-cover "
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaUserCircle className="w-6 h-6 " />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 rounded-full z-10"></div>
                  </div>
                  <span className="max-w-[120px] truncate">
                    {profile.name}
                  </span>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-base-200 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                    <div className="p-3 border-b ">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            {profile.profilePic ? (
                              <img
                                src={profile.profilePic}
                                alt={profile.name}
                                className="w-full h-full object-cover bg-white"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FaUserCircle className="w-6 h-6 " />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {profile.name}
                          </p>
                          <p className="text-xs text-base-content/50 truncate">
                            {profile.email}
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
                          {userRole === 'admin' && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-base-content/50 hover:bg-base-300  transition-colors duration-150"
                            >
                              <HiOutlineCog className="w-4 h-4 mr-3" />
                            {t('menu.admin') || 'Admin Panel'}
                          </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-base-content/50 hover:bg-base-300 transition-colors duration-150"
                      >
                        <HiOutlineUser className="w-4 h-4 mr-3 text-base-content/50" />
                        {t('profile.settings') || 'Profile Settings'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50  transition-colors duration-150"
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
                className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-primary text-white hover:from-primary hover:to-primary transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                {t('login') || 'Login'}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200"
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
        <div className="px-4 pt-2 pb-4 space-y-2 backdrop-blur-md">
          {activeLinks.map(link => {
            if (link.isDropdown) {
              const isDropdownActive = link.subMenu && link.subMenu.some(subLink => location.pathname.startsWith(subLink.to));
              const isSubMenuOpen = openMobileSubMenu === link.label;
              return (
                <div key={link.label}>
                  <button
                    onClick={() => toggleMobileSubMenu(link.label)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isDropdownActive
                        ? 'text-primary bg-gradient-to-r from-primary/5 to-accent/10'
                        : 'text-base-content/100 hover:bg-base-300 hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`transition-transform duration-200 ${isDropdownActive ? 'scale-110' : ''}`}>
                        {isDropdownActive ? link.activeIcon : link.icon}
                      </span>
                      {link.label}
                    </div>
                    <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSubMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="pl-8 pt-2 space-y-1">
                      {link.subMenu.map(subLink => {
                        const isSubActive = location.pathname.startsWith(subLink.to);
                        return (
                          <Link
                            key={subLink.to}
                            to={subLink.to}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                              isSubActive
                                ? 'text-primary bg-base-300'
                                : 'text-base-content/80 hover:bg-base-300 hover:text-primary'
                            }`}
                          >
                            {isSubActive ? subLink.activeIcon : subLink.icon}
                            {subLink.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            } else {
              const isActive = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-gradient-to-r from-primary/5 to-accent/10'
                      : 'text-base-content/100 hover:bg-base-300 hover:text-primary'
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {isActive ? link.activeIcon : link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            }
          })}
          
          {/* Mobile Language Switcher */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile Profile Section */}
          {profileLoading ? (
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-10 h-10 animate-pulse rounded-full" />
              <div className="h-4 w-24 animate-pulse rounded" />
            </div>
          ) : profile ? (
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex items-center space-x-3 px-4 py-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-primary to-primary p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center ">
                        <FaUserCircle className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-primary truncate">
                    {profile.name}
                  </p>
                  <p className="text-sm text-primary truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
              
              <Link
                to="/admin/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200"
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
            <div className="pt-4 mt-4">
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
            