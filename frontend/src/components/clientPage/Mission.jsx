import React, { useEffect } from 'react'
import useCompanies from '../../hooks/useCompanies'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { FaRocket, FaLightbulb, FaChartLine, FaUsers } from 'react-icons/fa'
import AdvancedLoading from '../shared/AdvancedLoading'

const Mission = () => {
  const { companies, loading, error, getCompanies } = useCompanies()
  const { t } = useTranslation()

  useEffect(() => {
    getCompanies()
  }, [])

  if (loading) {
    return <AdvancedLoading />
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-base-200/50 to-base-100">
      {/* Hero Section - Mission */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[600px] w-full overflow-hidden"
      >
        {company?.missionImage ? (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={company.missionImage} 
            alt="Mission Banner" 
            className="w-full h-full object-cover" 
          />
        ) : company?.heroImages?.[0] ? (
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={company.heroImages[0]} 
            alt="Company Banner" 
            className="w-full h-full object-cover" 
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex flex-col items-center justify-center text-white px-6 text-center">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
          >
            {company?.logo && (
              <motion.img 
                variants={fadeInUp}
                src={company.logo} 
                alt={`${company.name} logo`} 
                className="w-28 h-28 object-contain mb-6 mx-auto bg-white/10 p-2 rounded-full hover:scale-110 transition-transform duration-300" 
              />
            )}
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Our Mission
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            >
              {company?.mission}
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 -mt-20 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: <FaRocket className="w-6 h-6" />, label: 'Innovation', value: '100%' },
            { icon: <FaLightbulb className="w-6 h-6" />, label: 'Creativity', value: '∞' },
            { icon: <FaChartLine className="w-6 h-6" />, label: 'Growth', value: '24/7' },
            { icon: <FaUsers className="w-6 h-6" />, label: 'Community', value: '10K+' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="card-body items-center text-center">
                <div className="text-primary mb-2">{stat.icon}</div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-base-content/70">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cards Section - About & Vision */}
      <div className="container mx-auto px-4 py-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Our Philosophy
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* About Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/about" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <figure className="relative h-72">
                {company?.aboutImage ? (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={company.aboutImage} 
                    alt="About" 
                    className="w-full h-full object-cover transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-secondary/30">About</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">About Us</h3>
                <p className="text-base-content/80 line-clamp-4">{company?.about}</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-secondary btn-sm group-hover:btn-primary transition-all duration-300">
                    Discover More
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
          
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/vision" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <figure className="relative h-72">
                {company?.visionImage ? (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={company.visionImage} 
                    alt="Vision" 
                    className="w-full h-full object-cover transition-transform duration-300" 
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">Vision</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 to-transparent opacity-50 group-hover:opacity-30 transition-opacity duration-300"></div>
              </figure>
              <div className="card-body">
                <h3 className="card-title text-2xl font-bold group-hover:text-primary transition-colors duration-300">Our Vision</h3>
                <p className="text-base-content/80 line-clamp-4">{company?.vision}</p>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm group-hover:btn-secondary transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Mission
