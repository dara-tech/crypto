import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaBuilding, FaPen, FaPhoneAlt, FaGlobe } from "react-icons/fa";
import useCompanies from "../../../hooks/useCompanies";
import LogoUpload from "./edit/LogoUpload";
import BasicInfo from "./edit/BasicInfo";
import ContactInfo from "./edit/ContactInfo";
import SocialMedia from "./edit/SocialMedia";
import FormSection from "./edit/FormSection";
import { useTranslation } from "react-i18next";

const CampanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getCompany, updateCompany } = useCompanies();

  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    about: "",
    aboutImage: "",
    mission: "",
    missionImage: "",
    vision: "",
    visionImage: "",
    contact: {
      address: "",
      phone: "", 
      email: "",
      mapLocation: ""
    },
    socialMedia: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: ""
    },
    heroImages: [],
    programsOffered: [],
    testimonials: []
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState({
    about: null,
    mission: null,
    vision: null
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyData = await getCompany(id);
        if (companyData) {
          setFormData({
            ...formData,
            name: companyData.name || "",
            logo: companyData.logo || "",
            about: companyData.about || "",
            aboutImage: companyData.aboutImage || "",
            mission: companyData.mission || "",
            missionImage: companyData.missionImage || "",
            vision: companyData.vision || "",
            visionImage: companyData.visionImage || "",
            contact: {
              address: companyData.contact?.address || "",
              phone: companyData.contact?.phone || "",
              email: companyData.contact?.email || "",
              mapLocation: companyData.contact?.mapLocation || ""
            },
            socialMedia: {
              facebook: companyData.socialMedia?.facebook || "",
              instagram: companyData.socialMedia?.instagram || "",
              youtube: companyData.socialMedia?.youtube || "",
              linkedin: companyData.socialMedia?.linkedin || ""
            },
            heroImages: companyData.heroImages || [],
            programsOffered: companyData.programsOffered || [],
            testimonials: companyData.testimonials || []
          });
          if (companyData.logo) {
            setLogoPreview(companyData.logo);
          }
          setImagePreview({
            about: companyData.aboutImage || null,
            mission: companyData.missionImage || null,
            vision: companyData.visionImage || null
          });
        }
      } catch (err) {
        setError(t('company.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLogoChange = (file) => {
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (field, file) => {
    if (!file) {
      setFormData(prev => ({
        ...prev,
        [`${field}Image`]: ""
      }));
      setImagePreview(prev => ({
        ...prev,
        [field]: null
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [`${field}Image`]: file
    }));
    setImagePreview(prev => ({
      ...prev,
      [field]: URL.createObjectURL(file)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!formData.name.trim()) throw new Error(t('company.companyNameRequired'));

      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("about", formData.about || "");
      formDataToSend.append("mission", formData.mission || "");
      formDataToSend.append("vision", formData.vision || "");
      
      // Handle logo file if updated
      if (formData.logo instanceof File) {
        formDataToSend.append("logo", formData.logo);
      } else if (typeof formData.logo === 'string') {
        formDataToSend.append("logo", formData.logo);
      }

      // Handle section images
      if (formData.aboutImage instanceof File) {
        formDataToSend.append("aboutImage", formData.aboutImage);
      } else if (typeof formData.aboutImage === 'string') {
        formDataToSend.append("aboutImage", formData.aboutImage);
      }

      if (formData.missionImage instanceof File) {
        formDataToSend.append("missionImage", formData.missionImage);
      } else if (typeof formData.missionImage === 'string') {
        formDataToSend.append("missionImage", formData.missionImage);
      }

      if (formData.visionImage instanceof File) {
        formDataToSend.append("visionImage", formData.visionImage);
      } else if (typeof formData.visionImage === 'string') {
        formDataToSend.append("visionImage", formData.visionImage);
      }

      // Append contact as JSON string
      formDataToSend.append("contact", JSON.stringify({
        address: formData.contact.address || "",
        phone: formData.contact.phone || "",
        email: formData.contact.email || "",
        mapLocation: formData.contact.mapLocation || ""
      }));
      
      // Append social media as JSON string  
      formDataToSend.append("socialMedia", JSON.stringify({
        facebook: formData.socialMedia.facebook || "",
        instagram: formData.socialMedia.instagram || "",
        youtube: formData.socialMedia.youtube || "",
        linkedin: formData.socialMedia.linkedin || ""
      }));

      // Handle arrays
      if (Array.isArray(formData.programsOffered)) {
        formData.programsOffered.forEach((program, index) => {
          formDataToSend.append(`programsOffered[${index}]`, program);
        });
      }

      if (Array.isArray(formData.heroImages)) {
        formData.heroImages.forEach((image, index) => {
          formDataToSend.append(`heroImages[${index}]`, image);
        });
      }

      if (Array.isArray(formData.testimonials)) {
        formData.testimonials.forEach((testimonial, index) => {
          Object.entries(testimonial).forEach(([key, value]) => {
            formDataToSend.append(`testimonials[${index}][${key}]`, value);
          });
        });
      }

      const updated = await updateCompany(id, formDataToSend);
      if (!updated) throw new Error(t('company.errors.updateFailed'));

      navigate("/admin/companies");
    } catch (err) {   
      console.error("Update error:", err);
      setError(err.message || "Failed to update company");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="h-8 w-48 bg-base-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-base-200 animate-pulse rounded"></div>
        </div>

        <div className="space-y-6">
          {/* Logo Upload Skeleton */}
          <div className="p-6 border rounded-lg bg-base-100">
            <div className="h-6 w-32 bg-base-200 animate-pulse rounded mb-4"></div>
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-base-200 animate-pulse"></div>
            </div>
          </div>

          {/* Basic Info Skeleton */}
          <div className="p-6 border rounded-lg bg-base-100">
            <div className="h-6 w-40 bg-base-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-4 w-24 bg-base-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 bg-base-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div className="p-6 border rounded-lg bg-base-100">
            <div className="h-6 w-44 bg-base-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-4 w-24 bg-base-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 bg-base-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Skeleton */}
          <div className="p-6 border rounded-lg bg-base-100">
            <div className="h-6 w-36 bg-base-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i}>
                  <div className="h-4 w-24 bg-base-200 animate-pulse rounded mb-2"></div>
                  <div className="h-10 bg-base-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-10 w-24 bg-base-200 animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-base-200 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">{t('company.editTitle')}</h2>
        <button 
          onClick={() => navigate("/admin/companies")}
          className="btn btn-ghost"
        >
          {t('company.backToCompanies')}
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection title={t('company.sections.logo')} icon={<FaBuilding />}>
          <LogoUpload
            logo={formData.logo}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
            error={error}
            setError={setError}
          />
        </FormSection>

        <FormSection title={t('company.sections.basicInfo')} icon={<FaPen />}>
          <BasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            onImageChange={handleImageChange}
            imagePreview={imagePreview}
          />
        </FormSection>

        <FormSection title={t('company.sections.contactInfo')} icon={<FaPhoneAlt />}>
          <ContactInfo
            formData={formData}
            onInputChange={handleInputChange}
          />
        </FormSection>

        <FormSection title={t('company.sections.socialMedia')} icon={<FaGlobe />}>
          <SocialMedia
            formData={formData}
            onInputChange={handleInputChange}
          />
        </FormSection>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/companies")}
            className="btn btn-ghost"
            disabled={submitting}
          >
            {t('company.cancel')}
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t('company.updating')}
              </>
            ) : (
              t('company.updateCompany')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CampanyEdit;