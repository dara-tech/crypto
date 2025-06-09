import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ allowedRoles = ['admin', 'user', 'payment_view'] }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Get user info to check role
        const response = await axios.get('/api/auth/current-user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userRole = response.data?.type || 'user';
        
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          console.log(`User role ${userRole} not in allowed roles:`, allowedRoles);
          toast.error(t('common.unauthorized'));
        }
      } catch (error) {
        console.error('Error verifying auth:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          toast.error(t('common.sessionExpired'));
        } else {
          toast.error(t('common.authError'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [token, allowedRoles, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!token) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (!isAuthorized) {
    // User not authorized for this route, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
