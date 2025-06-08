import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useCompanies from '../../hooks/useCompanies';

const HeroSection = () => {
  const { t } = useTranslation();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();

  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getCompanies();
      setInitialFetchComplete(true);
    };
    fetchData();
  }, []);

  const overallLoading = !initialFetchComplete || companiesLoading;

  const company = companies?.[0];

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side: Text */}
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
              {overallLoading ? t('hero.loading') : company?.tagline || t('hero.tagline')}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {overallLoading ? t('hero.loading') : company?.name || t('hero.title')}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              {overallLoading ? t('hero.loading') : company?.description || t('hero.subtitle')}
              <Link to="/about" className="text-green-600 hover:text-green-700 font-medium ml-1">
                {t('hero.learnMore')}
              </Link>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/get-started"
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-center transition-colors duration-200"
              >
                {t('hero.cta')}
              </Link>
            </div>
          </div>

          {/* Right side: Hero Image from company.heroImage ONLY */}
          <div className="relative">
            <div className="relative z-10">
              {overallLoading ? (
                <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <img
                  src={company?.heroImage || '/images/hero-placeholder.jpg'}
                  alt={company?.name || 'Company Hero'}
                  className="w-full h-auto max-w-lg mx-auto "
                />
              )}
            </div>

            {/* Decorative blobs */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
            <div className="absolute top-1/2 -right-12 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
