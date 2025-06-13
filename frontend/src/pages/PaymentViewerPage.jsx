import { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLink, FaSignOutAlt, FaDownload, FaCopy, FaQrcode } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import usePaymentGateways from '../hooks/usePaymentGateways';

// Memoized QR Code component
const QRCodeSection = memo(({ paymentQR, onDownload, t }) => (
  <div className="p-6 bg-base-100/50 backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <FaQrcode className="text-primary" />
      {t('company.paymentGateway.qrCode')}
    </h2>
    <div className="flex justify-center relative group">
      <div className="relative">
        <img
          src={paymentQR}
          alt="Payment QR Code"
          className="max-w-xs w-full h-auto border-2 border-primary/20 rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 rounded-lg transition-all duration-300"></div>
      </div>
    </div>
    <div className="mt-4 text-center">
      <button
        onClick={onDownload}
        className="btn btn-primary btn-sm gap-2"
      >
        <FaDownload />
        {t('common.download')}
      </button>
    </div>
    <p className="text-sm text-base-content/70 mt-3 text-center">
      {t('company.paymentGateway.qrDescription')}
    </p>
  </div>
));

// Memoized Payment Link component
const PaymentLinkSection = memo(({ paymentGateway, onCopy, t }) => (
  <div className="p-6 bg-base-100/50 backdrop-blur-sm border border-primary/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
      <FaLink className="text-primary" />
      {t('company.paymentGateway.link')}
    </h2>
    <div className="flex items-center justify-between gap-4 flex-wrap bg-base-200/50 p-3 rounded-lg">
      <a
        href={paymentGateway}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 break-all text-sm transition-colors duration-300"
      >
        {paymentGateway}
      </a>
      <button
        onClick={onCopy}
        className="btn btn-primary btn-sm gap-2"
      >
        <FaCopy />
        {t('common.copy')}
      </button>
    </div>
  </div>
));

const PaymentViewerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gateways: paymentInfo, loading, error } = usePaymentGateways();

  useEffect(() => {
    if (error) {
      if (error.response?.status === 401) {
        toast.error(t('errors.sessionExpired', 'Session expired. Please login again.'));
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || error.message || t('errors.failedToLoadPaymentInfo', 'Failed to load payment information'));
      }
    }
  }, [error, navigate, t]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCopyLink = () => {
    if (paymentInfo?.paymentGateway) {
      navigator.clipboard.writeText(paymentInfo.paymentGateway);
      toast.success(t('company.paymentGateway.linkCopied', 'Payment link copied!'));
    }
  };

  const handleDownloadQR = () => {
    if (!paymentInfo?.paymentQR) return;

    const link = document.createElement('a');
    link.href = paymentInfo.paymentQR;
    link.download = 'payment-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t('company.paymentGateway.qrDownloaded', 'QR code downloaded!'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 via-base-200 to-base-300 pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-base-content/70">Loading payment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-100/95 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('paymentViewer.title')}
            </h1>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10"
            >
              <FaSignOutAlt />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {paymentInfo?.paymentGateway && (
            <PaymentLinkSection 
              key="payment-link"
              paymentGateway={paymentInfo.paymentGateway}
              onCopy={handleCopyLink}
              t={t}
            />
          )}

          {paymentInfo?.paymentQR && (
            <QRCodeSection 
              key="qr-code"
              paymentQR={paymentInfo.paymentQR}
              onDownload={handleDownloadQR}
              t={t}
            />
          )}

          {!loading && !error && (!paymentInfo || (!paymentInfo.paymentGateway && !paymentInfo.paymentQR)) && (
            <div className="text-center py-12 text-base-content/70">
              {t('paymentViewer.noPaymentInfo')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PaymentViewerPage);
