import React, { useEffect, useState } from 'react'
import useCompanies from '../../hooks/useCompanies'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaFileAlt, FaHome } from 'react-icons/fa'

const TermsAndConditions = () => {
  const { t } = useTranslation()
  const { companies, getCompanies } = useCompanies()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      await getCompanies()
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <FaFileAlt className="text-blue-600 text-2xl" />
        <h1 className="text-3xl font-bold text-gray-800">{t('company.termsConditions')}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : companies?.[0]?.termsConditions ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: companies[0].termsConditions }} />
        ) : (
          <div className="text-center py-12">
            <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500">{t('company.termsConditionsPlaceholder')}</p>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium">
          <FaHome /> {t('home')}
        </Link>
      </div>
    </div>
  )
}

export default TermsAndConditions
