import React, { useState, useEffect } from 'react';
import useCompanies from '../../hooks/useCompanies';
import ProfessionalCard from './component/ProfessionalCard';
import { useTranslation } from 'react-i18next';
import { FaExclamationTriangle } from 'react-icons/fa';

const ProfessionalPage = () => {
  const { getCompanies } = useCompanies();
  const [allProfessionals, setAllProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const companiesData = await getCompanies();
        if (companiesData && companiesData.length > 0) {
          const profs = companiesData.flatMap(company => 
            company.professionals ? company.professionals.map(p => ({...p, companyName: company.name})) : []
          );
          setAllProfessionals(profs);
          setFilteredProfessionals(profs);

          const roleList = [...new Set(profs.map(p => p.role))];
          setRoles(roleList);
        }
        setError(null);
      } catch (err) {
        setError(t('professionalsManager.fetchError', 'Failed to fetch professionals.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [t]);

  useEffect(() => {
    let results = allProfessionals;

    if (searchTerm) {
      results = results.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      results = results.filter(prof => prof.role === selectedRole);
    }

    setFilteredProfessionals(results);
  }, [searchTerm, selectedRole, allProfessionals]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="h-10 w-3/4 mx-auto bg-base-300 animate-pulse rounded"></div>
          <div className="h-6 w-1/2 mx-auto bg-base-300 animate-pulse rounded mt-4"></div>
        </div>

        <div className="mb-8 p-4 bg-base-100 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center">
          <div className="h-10 w-full bg-base-300 animate-pulse rounded"></div>
          <div className="h-10 w-full sm:w-40 bg-base-300 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-base-100 rounded-lg shadow-md overflow-hidden">
              <div className="h-60 bg-base-300 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-base-300 animate-pulse rounded"></div>
                <div className="h-4 w-1/2 bg-base-300 animate-pulse rounded"></div>
                <div className="h-16 w-full bg-base-300 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-red-500">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-base-content">{t('professionalsManager.title', 'Our Professionals')}</h1>
          <p className="text-lg text-base-content/70 mt-2">{t('professionalsManager.subtitle', 'Meet the talented individuals driving our success.')}</p>
        </div>

        <div className="mb-8 p-4 bg-base-100 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder={t('professionalsManager.searchPlaceholder', 'Search by name or role...')}
            className="input input-bordered w-full sm:flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="select select-bordered w-full sm:w-auto"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">{t('professionalsManager.allProfessionals', 'All Professionals')}</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {filteredProfessionals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProfessionals.map((prof) => (
              <ProfessionalCard key={prof._id || prof.name} professional={prof} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-base-content/60">{t('professionalsManager.noResults', 'No professionals match your search.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalPage;
