import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaUserCircle,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaBuilding,
  FaEnvelope,
  FaFileContract,
  FaInfoCircle,
  FaUserCog,
} from 'react-icons/fa';
import { RiDashboardFill } from 'react-icons/ri';
import { FiMenu, FiX } from 'react-icons/fi';
import { debounce } from 'lodash';
import useAuth from '../../hooks/useAuth';
import useCompanies from '../../hooks/useCompanies';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const { profile, logout, getAdminProfile, loading: profileLoading } = useAuth();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Feature", message: "Our platform is now faster.", read: false, timestamp: new Date() },
    { id: 2, title: "Welcome!", message: "Thanks for joining.", read: true, timestamp: new Date() },
  ]);
  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  // Refs for click-outside detection
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // --- Effects ---

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setIsNotificationOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target)) setIsDesktopSearchOpen(false);
      // For mobile menu, clicking outside the menu (but not the toggle button) should close it
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMenuOpen) {
         const menuToggle = document.getElementById('mobile-menu-toggle');
         if(menuToggle && !menuToggle.contains(event.target)) {
            setIsMenuOpen(false);
         }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]); // Added isMenuOpen dependency

  useEffect(() => {
    if (isMenuOpen) setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getCompanies();
    getAdminProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Handlers & Memos ---

  const handleLogout = useCallback(() => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const debouncedSearch = useMemo(
    () => debounce((query) => {
      if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
    }, 500),
    [navigate]
  );
  
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const navLinks = useMemo(() => {
    const commonLinks = [
      { to: '/', label: t('home'), icon: <FaHome /> },
      { to: '/companies', label: t('companies'), icon: <FaBuilding /> },
      { to: '/about', label: t('about'), icon: <FaInfoCircle /> },
      { to: '/contact', label: t('contact'), icon: <FaEnvelope /> },
      { to: '/privacy-policy', label: t('privacyPolicy'), icon: <FaFileContract /> }
    ];
    const adminLinks = [
      { to: '/admin/dashboard', label: t('dashboard'), icon: <RiDashboardFill /> },
      { to: '/admin/companies', label: t('companies'), icon: <FaBuilding /> },
      { to: '/admin/profile', label: t('profile'), icon: <FaUserCog /> }
    ];
    return location.pathname.startsWith('/admin') ? adminLinks : commonLinks;
  }, [t, location.pathname]);

  const profileMenuItems = useMemo(() => [
    { label: t('profile.viewProfile'), icon: <FaUserCircle />, onClick: () => navigate('/profile') },
    { label: t('settings'), icon: <FaCog />, onClick: () => navigate('/settings') },
    { label: t('logout'), icon: <FaSignOutAlt />, onClick: handleLogout, isDanger: true },
  ], [t, navigate, handleLogout]);

  // --- Render ---

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-base-100/80 backdrop-blur-lg shadow-md border-b border-base-200/50'
            : 'bg-base-100 border-b border-transparent'
        }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                {companiesLoading ? (
                  <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
                ) : (
                  <img
                    src={companies?.[0]?.logo || '/default-company-logo.png'}
                    alt={`${companies?.[0]?.name || 'App'} Logo`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-base-300 group-hover:border-primary transition-colors"
                  />
                )}
              </div>
              <span className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                {companiesLoading ? <div className="h-6 w-32 bg-base-200 rounded animate-pulse" /> : (companies?.[0]?.name || t('appName'))}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 relative transition-colors ${
                    location.pathname === link.to ? 'text-primary' : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                  {location.pathname === link.to && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right-side Icons & Actions */}
            <div className="flex items-center space-x-2">
              {/* Desktop Search */}
              <div ref={searchRef} className="relative hidden md:block">
                <input
                  type="text"
                  placeholder={t('search.placeholder') + '...'}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsDesktopSearchOpen(true)}
                  className={`pl-10 pr-4 py-2 text-sm bg-base-200 rounded-full border border-transparent focus:ring-2 focus:ring-primary focus:border-primary focus:bg-base-100 transition-all duration-300 ease-in-out ${
                    isDesktopSearchOpen ? 'w-64' : 'w-10'
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
                  <FaSearch />
                </div>
              </div>
              
              <LanguageSwitcher />

              {/* Notifications */}
              <div ref={notificationRef} className="relative">
                 <button
                  onClick={() => setIsNotificationOpen(o => !o)}
                  className="p-2 rounded-full hover:bg-base-200 relative transition-transform hover:scale-110"
                >
                  <FaBell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-base-100" />
                  )}
                </button>
                {isNotificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-80 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50"
                  >
                    <div className="p-3 border-b border-base-200 font-semibold">{t('notifications')}</div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                         notifications.map(n => (
                          <div key={n.id} className={`p-3 border-b border-base-200 last:border-b-0 hover:bg-base-200 ${!n.read && 'bg-primary/10'}`}>
                            <p className="font-semibold text-sm">{n.title}</p>
                            <p className="text-xs text-base-content/70">{n.message}</p>
                          </div>
                         ))
                      ) : (
                        <p className="p-4 text-center text-sm text-base-content/60">{t('noNotifications')}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              {profileLoading ? (
                <div className="w-10 h-10 rounded-full bg-base-200 animate-pulse" />
              ) : profile?.user ? (
                <div ref={profileRef} className="relative">
                  <button onClick={() => setIsProfileOpen(o => !o)}>
                    <img
                      src={profile.user.profilePic || '/default-avatar.png'}
                      alt="User Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-primary transition-colors"
                    />
                  </button>
                  {isProfileOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-base-100 rounded-lg shadow-xl border border-base-300 z-50"
                    >
                       <div className="p-3 border-b border-base-200">
                         <p className="font-semibold truncate">{profile.user.name}</p>
                         <p className="text-sm text-base-content/60 truncate">{profile.user.email}</p>
                       </div>
                       <div className="py-1">
                         {profileMenuItems.map(item => (
                           <button
                             key={item.label}
                             onClick={() => { item.onClick(); setIsProfileOpen(false); }}
                             className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                               item.isDanger ? 'text-red-500 hover:bg-red-500/10' : 'text-base-content hover:bg-base-200'
                             }`}
                           >
                             {item.icon}
                             <span>{item.label}</span>
                           </button>
                         ))}
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 text-sm font-medium bg-primary text-primary-content rounded-full hover:bg-primary/90">
                  {t('login')}
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button id="mobile-menu-toggle" onClick={() => setIsMenuOpen(o => !o)} className="p-2" aria-label="Open menu">
                  {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
        
        {/* Panel */}
        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-base-100 z-50 shadow-lg flex flex-col transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <h2 className="font-bold text-lg">{t('menu.title')}</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2" aria-label="Close menu">
              <FiX className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder={t('search.placeholder') + '...'}
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 text-sm bg-base-200 rounded-full border border-transparent focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
                <FaSearch />
              </div>
            </div>
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={`mobile-${link.to}`}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 p-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === link.to ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;