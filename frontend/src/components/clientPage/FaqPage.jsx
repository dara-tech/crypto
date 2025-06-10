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
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-lg"></span>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error">{t('company.errors.fetchFailed')}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          {company && company.logo && (
            <img src={company.logo} alt={`${company.name} Logo`} className="w-24 h-24 mx-auto mb-4 rounded-full object-cover" />
          )}
          <h1 className="text-4xl font-bold">{company?.name}</h1>
          <p className="text-xl text-base-content mt-2">{t('company.tabs.faq')}</p>
        </div>

        <div className="space-y-4">
          {company?.FAQs && company.FAQs.length > 0 ? (
            company.FAQs.map((faq, index) => (
              <div key={index} tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
                <div className="collapse-title text-xl font-medium">
                  {faq.question}
                </div>
                <div className="collapse-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-lg">{t('company.faqs.noFaqs')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
