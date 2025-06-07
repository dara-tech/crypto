import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useCompanies from '../../hooks/useCompanies';
// Re-import useAuth as it's for the current user's profile
import useAuth from '../../hooks/useAuth'; 
// No need for useUserProfile here, as it's for fetching arbitrary users by ID.
// import useUserProfile from '../../hooks/useUserProfile';

const HeroSection = () => {
  const { t } = useTranslation();
  const { companies, getCompanies, loading: companiesLoading } = useCompanies();
  // Correctly use useAuth for the current authenticated user's profile
  const { profile, getAdminProfile, loading: profileLoading } = useAuth(); 

  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // These functions are from useCompanies and useAuth, which are correct for this usage.
      await getCompanies();
      await getAdminProfile(); // Fetches the current authenticated user's profile
      setInitialFetchComplete(true);
    };
    fetchData();
  }, []); // Dependencies are correct

  // Combine loading states from all relevant hooks
  const overallLoading = !initialFetchComplete || companiesLoading || profileLoading;

  const company = companies?.[0]; // Get the first company from the fetched list

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
          {/* Left side - Content */}
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
              {/* Display loading text or actual tagline */}
              {overallLoading ? t('hero.loading') : company?.tagline || t('hero.tagline')}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {/* Display loading text or actual company name */}
              {overallLoading ? t('hero.loading') : company?.name || t('hero.title')}
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              {/* Display loading text or actual company description */}
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

          {/* Right side - Image (using authenticated user's profile pic) */}
          <div className="relative">
            <div className="relative z-10">
              <img
                // Use a placeholder if loading, otherwise the user's profile pic or a default hero image
                src={overallLoading ? "/images/placeholder.png" : profile?.user?.profilePic || "/images/hero-woman.png"}
                alt={overallLoading ? "Loading image" : profile?.user?.name || "Happy customer"}
                className="w-full h-auto max-w-lg mx-auto"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
            <div className="absolute top-1/2 -right-12 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;