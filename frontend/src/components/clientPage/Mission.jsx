import React, { useEffect } from 'react'
import useCompanies from '../../hooks/useCompanies'
import { Link } from 'react-router-dom'

const Mission = () => {
  const { companies, loading, error, getCompanies } = useCompanies()

  useEffect(() => {
    getCompanies()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse p-4">
        {/* Banner skeleton */}
        <div className="relative h-[400px] w-full bg-base-300 rounded-lg">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-8 w-64 bg-base-200 rounded mb-4"></div>
            <div className="h-24 w-24 bg-base-200 rounded-full mb-4"></div>
            <div className="h-4 w-96 bg-base-200 rounded"></div>
          </div>
        </div>

        {/* Mission & Vision skeleton cards */}
        <div className="container px-4 relative z-10 ">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="card bg-base-100">
                <div className="card-body">
                  <div className="h-48 bg-base-300 rounded-lg mb-4"></div>
                  <div className="h-6 w-32 bg-base-300 rounded mb-4"></div>
                  <div className="space-y-2">
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
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    )
  }

  const company = companies[0] // Assuming we want to display the first company

  return (
    <div className="flex flex-col">
      {/* Banner Section */}
      <div className="relative h-[400px] w-full">
        {company?.missionImage ? (
          <img
            src={company.missionImage}
            alt="Company Banner"
            className="w-full h-full object-cover"
          />
        ) : company?.heroImages?.[0] && (
          <img
            src={company.heroImages[0]}
            alt="Company Banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
          <h1 className="text-5xl font-bold mb-4 text-center">{company?.name}</h1>
          {company?.logo && (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-24 h-24 object-contain mb-4"
            />
          )}
          <p className="text-xl max-w-3xl text-center px-4">{company?.mission}</p>
        </div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="container px-4 relative z-10 mx-auto">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card-body bg-base-100">
            <Link to="/about">
              <div className="card-body cursor-pointer hover:scale-105 transition-all duration-300">
              {company?.aboutImage && (
                <img
                  src={company.missionImage}
                  alt="Mission"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
                <h3 className="card-title text-2xl font-bold mb-4">About</h3>
                <p className="text-base-content/70">{company?.about}</p>
              </div>
            </Link>
          </div>
          <div className="card-body bg-base-100">
            <Link to="/vision">
              <div className="card-body cursor-pointer hover:scale-105 transition-all duration-300">
              {company?.visionImage && (
                <img
                  src={company.visionImage}
                  alt="Vision"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="card-title text-2xl font-bold mb-4">Vision</h3>
                <p className="text-base-content/70">{company?.vision}</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mission
