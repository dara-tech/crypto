import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useCompanies from '../../hooks/useCompanies';
import { useTranslation } from 'react-i18next';

const FaqPage = () => {
  const { id } = useParams();
  const { getCompanies, loading, error } = useCompanies();
  const [company, setCompany] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCompany = async () => {
      const companies = await getCompanies();
      if (companies && companies.length > 0) {
        setCompany(companies[0]);
      }
    };
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-base-300 animate-pulse"></div>
            <div className="h-8 w-48 mx-auto bg-base-300 animate-pulse rounded"></div>
            <div className="h-4 w-32 mx-auto mt-2 bg-base-300 animate-pulse rounded"></div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border border-base-300 rounded-xl bg-base-200 shadow-sm">
                <div className="px-6 py-4">
                  <div className="h-6 bg-base-300 animate-pulse rounded w-3/4"></div>
                </div>
                <div className="px-6 pb-4">
                  <div className="h-4 bg-base-300 animate-pulse rounded w-full mb-2"></div>
                  <div className="h-4 bg-base-300 animate-pulse rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-semibold text-error mb-2">{t('company.errors.fetchFailed')}</h2>
        <p className="text-base text-base-content/70 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          {company?.logo && (
            <img
              src={company.logo}
              alt={`${company.name} Logo`}
              className="w-20 h-20 mx-auto mb-4 rounded-full object-cover shadow-md"
            />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content">{company.name}</h1>
          <p className="mt-2 text-base-content/70">{t('company.tabs.faq')}</p>
        </div>

        <div className="space-y-4">
          {company?.FAQs?.length > 0 ? (
            company.FAQs.map((faq, index) => (
              <details key={index} className="group border border-base-300 rounded-xl bg-base-200 transition-all duration-300 shadow-sm open:shadow-md">
                <summary className="cursor-pointer px-6 py-4 text-lg font-medium text-base-content group-open:bg-base-300 rounded-t-xl transition">
                  {faq.question}
                </summary>
                <div className="px-6 pb-4 text-base-content/80">
                  {faq.answer}
                </div>
              </details>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-base text-base-content/70">{t('company.faqs.noFaqs')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
