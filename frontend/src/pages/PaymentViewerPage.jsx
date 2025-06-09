import { useEffect } from 'react'; // useState removed as state is managed by the hook
import { useNavigate } from 'react-router-dom';
import { FaLink, FaSignOutAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
// axios import removed, http client is in the hook
import { toast } from 'react-hot-toast';
import usePaymentGateways from '../hooks/usePaymentGateways'; // Adjust path if necessary

const PaymentViewerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Use the hook to get payment data, loading state, and error state.
  // Assuming /api/payments for this page returns a single object, not an array of gateways.
  const { gateways: paymentInfo, loading, error } = usePaymentGateways(); 

  useEffect(() => {
    if (error) {
      // console.error('Error from usePaymentGateways hook:', error); // For client-side debugging
      if (error.response?.status === 401) {
        toast.error(t('errors.sessionExpired', 'Session expired. Please login again.'));
        // Consider centralizing logout logic (e.g., useAuth().logout())
        localStorage.removeItem('token'); 
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || error.message || t('errors.failedToLoadPaymentInfo', 'Failed to load payment information'));
      }
    }
  }, [error, navigate, t]); // Added t to dependencies array


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('paymentViewer.title')}</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <FaSignOutAlt />
            <span>{t('common.logout')}</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Payment Gateway Link */}
          {paymentInfo && paymentInfo.paymentGateway && (
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaLink className="text-blue-500" />
                {t('company.paymentGateway.link')}
              </h2>
              <a
                href={paymentInfo.paymentGateway}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {paymentInfo.paymentGateway}
              </a>
            </div>
          )}

          {/* QR Code */}
          {paymentInfo && paymentInfo.paymentQR && (
            <div className="p-4 border rounded-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaLink className="text-green-500" />
                {t('company.paymentGateway.qrCode')}
              </h2>
              <div className="flex justify-center">
                <img
                  src={paymentInfo.paymentQR}
                  alt="Payment QR Code"
                  className="max-w-xs w-full h-auto border rounded"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                {t('company.paymentGateway.qrDescription')}
              </p>
            </div>
          )}

          {/* Show this message only if not loading, no error, and paymentInfo is truly empty or null */}
          {!loading && !error && (!paymentInfo || (!paymentInfo.paymentGateway && !paymentInfo.paymentQR)) && (
            <div className="text-center py-8 text-gray-500">
              {t('paymentViewer.noPaymentInfo')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentViewerPage;
