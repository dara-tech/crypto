import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaLinkedin, FaPaperPlane, FaYoutube } from 'react-icons/fa';
import useCompanies from '../../hooks/useCompanies';

const Contact = () => {
  const { t } = useTranslation();
  const { companies, loading, error } = useCompanies();
  const company = companies?.[0]; // Get the first company if available
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ success: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('contactPage.form.validation.required');
    if (!formData.email) {
      errors.email = t('contactPage.form.validation.required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('contactPage.form.validation.email');
    }
    if (!formData.subject.trim()) errors.subject = t('contactPage.form.validation.required');
    if (!formData.message.trim()) errors.message = t('contactPage.form.validation.required');
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      // Replace with your actual API call
      // const response = await api.post('/contact', formData);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setSubmitStatus({
        success: true,
        message: t('contactPage.form.success')
      });
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: t('contactPage.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-4xl mx-auto my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">{t('contactPage.title')}</h1>
          <p className="text-lg text-base-content/70">{t('contactPage.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-base-100 p-8 rounded-xl shadow-lg">
            {submitStatus.message && (
              <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-error'} mb-6`}>
                {submitStatus.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{t('contactPage.form.name')}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                    placeholder={t('contactPage.form.name')}
                  />
                  {formErrors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.name}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{t('contactPage.form.email')}</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`input input-bordered w-full ${formErrors.email ? 'input-error' : ''}`}
                    placeholder={t('contactPage.form.email')}
                  />
                  {formErrors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{formErrors.email}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('contactPage.form.subject')}</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${formErrors.subject ? 'input-error' : ''}`}
                  placeholder={t('contactPage.form.subject')}
                />
                {formErrors.subject && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.subject}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t('contactPage.form.message')}</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`textarea textarea-bordered w-full h-40 ${formErrors.message ? 'textarea-error' : ''}`}
                  placeholder={t('contactPage.form.message')}
                ></textarea>
                {formErrors.message && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.message}</span>
                  </label>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      {t('contactPage.form.sending')}
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      {t('contactPage.form.submit')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-base-100 p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">{t('contactPage.info.title')}</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-base-content/70">{company?.contact?.address || t('contactPage.info.address')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaPhoneAlt className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <a href={`tel:${company?.contact?.phone?.replace(/\D/g, '') || '+85512345678'}`} className="text-base-content/70 hover:text-primary">
                      {company?.contact?.phone || t('contactPage.info.phone')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaEnvelope className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <a href={`mailto:${company?.contact?.email || 'info@khhara.com'}`} className="text-base-content/70 hover:text-primary">
                      {company?.contact?.email || t('contactPage.info.email')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FaClock className="text-primary text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Working Hours</h4>
                    <p className="text-base-content/70">{t('contactPage.info.hours')}</p>
                  </div>
                </div>
              </div>
            </div>

           {/* Social Media Section */}
<div className="bg-base-100 p-8 rounded-xl shadow-lg">
  <h3 className="text-2xl font-bold mb-6">{t('contactPage.social.title')}</h3>
  <div className="flex flex-wrap gap-4 justify-center">
    <a 
      href="https://facebook.com/bfis" 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      aria-label={t('contactPage.social.facebook')}
    >
      <FaFacebook className="text-2xl text-[#1877F2]" />
    </a>
    
    <a 
      href="https://instagram.com/bfis" 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      aria-label={t('contactPage.social.instagram')}
    >
      <FaInstagram className="text-2xl text-[#E1306C]" />
    </a>
    
    <a 
      href="https://youtube.com/@bfis" 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      aria-label={t('contactPage.social.youtube')}
    >
      <FaYoutube className="text-2xl text-[#FF0000]" />
    </a>
    
    <a 
      href="https://linkedin.com/school/bfis" 
      target="_blank" 
      rel="noopener noreferrer"
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      aria-label={t('contactPage.social.linkedin')}
    >
      <FaLinkedin className="text-2xl text-[#0077B6]" />
    </a>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

