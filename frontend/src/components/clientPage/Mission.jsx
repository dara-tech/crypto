import React, { useEffect } from 'react'
import useCompanies from '../../hooks/useCompanies'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Mission = () => {
  const { companies, loading, error, getCompanies } = useCompanies()
  const { t } = useTranslation()

  useEffect(() => {
    getCompanies()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse p-6 bg-gradient-to-b from-base-200 to-base-100">
        <div className="relative h-[500px] w-full bg-base-300 rounded-2xl shadow-xl">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-10 w-72 bg-base-200 rounded-lg mb-6"></div>
            <div className="h-28 w-28 bg-base-200 rounded-full mb-6"></div>
            <div className="h-5 w-[500px] max-w-full bg-base-200 rounded mb-2"></div>
            <div className="h-5 w-[400px] max-w-full bg-base-200 rounded"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="h-64 bg-base-300"></div>
                <div className="card-body">
                  <div className="h-8 w-40 bg-base-300 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-base-300 rounded w-full"></div>
                    <div className="h-4 bg-base-300 rounded w-5/6"></div>
                    <div className="h-4 bg-base-300 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-error/10 rounded-xl border border-error/20 max-w-lg">
          <h2 className="text-2xl font-bold text-error mb-3">{t('error.occurred')}</h2>
          <p className="text-error/80">{error}</p>
        </div>
      </div>
    )
  }

  const company = companies[0]

  return (
    <div className="flex flex-col bg-gradient-to-b from-base-200/50 to-base-100">
      {/* Hero Section - Mission */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {company?.missionImage ? (
          <img src={company.missionImage} alt="Mission Banner" className="w-full h-full object-cover" />
        ) : company?.heroImages?.[0] ? (
          <img src={company.heroImages[0]} alt="Company Banner" className="w-full h-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col items-center justify-center text-white px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {company?.logo && (
              <img src={company.logo} alt={`${company.name} logo`} className="w-28 h-28 object-contain mb-6 mx-auto bg-white/10 p-2 rounded-full" />
            )}
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">Our Mission</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">{company?.mission}</p>
          </div>
        </div>
      </div>

      {/* Cards Section - About & Vision */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Philosophy</h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* About Card */}
          <Link to="/about" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <figure className="relative h-72">
              {company?.aboutImage ? (
                <img src={company.aboutImage} alt="About" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-secondary/30">About</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50"></div>
            </figure>
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold">About Us</h3>
              <p className="text-base-content/80 line-clamp-4">{company?.about}</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-secondary btn-sm">Discover More</button>
              </div>
            </div>
          </Link>
          
          {/* Vision Card */}
          <Link to="/vision" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <figure className="relative h-72">
              {company?.visionImage ? (
                <img src={company.visionImage} alt="Vision" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary/30">Vision</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50"></div>
            </figure>
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold">Our Vision</h3>
              <p className="text-base-content/80 line-clamp-4">{company?.vision}</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary btn-sm">Learn More</button>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Mission
