import React, { useEffect } from 'react'
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa'
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md'
import useCompanies from '../../hooks/useCompanies'

const Footer = () => {
  const { companies, loading, error, getCompanies } = useCompanies()

  useEffect(() => {
    getCompanies()
  }, [])

  if (loading) {
    return (
      <footer className="bg-base-200 text-base-content">
        <div className="container mx-auto p-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-8 w-48 bg-base-300 rounded"></div>
              <div className="h-4 w-32 bg-base-300 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-48 bg-base-300 rounded"></div>
              <div className="h-4 w-32 bg-base-300 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 w-48 bg-base-300 rounded"></div>
              <div className="h-4 w-32 bg-base-300 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (error) {
    return (
      <footer className="bg-base-200 text-base-content p-8">
        <div className="text-center text-error">
          Error loading footer content: {error}
        </div>
      </footer>
    )
  }

  const company = companies[0]

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {company?.logo && (
                <img 
                  src={company.logo} 
                  alt={company.name}
                  className="w-12 h-12 object-contain"
                />
              )}
              <h3 className="font-bold text-lg">{company?.name}</h3>
            </div>
            <p className="text-base-content/70">{company?.about}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-primary" />
                <span>{company?.contact?.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdPhone className="text-primary" />
                <span>{company?.contact?.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MdEmail className="text-primary" />
                <span>{company?.contact?.email}</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {company?.socialMedia?.facebook && (
                <a href={company.socialMedia.facebook} target="_blank" rel="noopener noreferrer" 
                   className="hover:text-primary transition-colors">
                  <FaFacebook size={24} />
                </a>
              )}
              {company?.socialMedia?.instagram && (
                <a href={company.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary transition-colors">
                  <FaInstagram size={24} />
                </a>
              )}
              {company?.socialMedia?.youtube && (
                <a href={company.socialMedia.youtube} target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary transition-colors">
                  <FaYoutube size={24} />
                </a>
              )}
              {company?.socialMedia?.linkedin && (
                <a href={company.socialMedia.linkedin} target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary transition-colors">
                  <FaLinkedin size={24} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-base-300 mt-8 pt-8 text-center">
          <p>© {new Date().getFullYear()} {company?.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer