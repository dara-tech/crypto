import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = () => {
  const { t } = useTranslation();
  const token = localStorage.getItem('token');
  
  if (!token) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
