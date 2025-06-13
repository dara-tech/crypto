import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaUserCog, FaUser, FaBriefcase, FaEnvelope, FaAlignLeft } from 'react-icons/fa';
import ImageUpload from './ImageUpload';

const ProfessionalsManager = ({ professionals, onProfessionalsChange, loading = false }) => {
  const { t } = useTranslation();

  const handleAddProfessional = () => {
    onProfessionalsChange([...(professionals || []), { name: '', role: '', email: '', description: '', image: null, newImageFile: null }]);
  };

  const handleRemoveProfessional = (index) => {
    const newProfessionals = professionals.filter((_, i) => i !== index);
    onProfessionalsChange(newProfessionals);
  };

  const handleInputChange = (index, field, value) => {
    const newProfessionals = professionals.map((prof, i) =>
      i === index ? { ...prof, [field]: value } : prof
    );
    onProfessionalsChange(newProfessionals);
  };

  const handleImageChange = (index, field, file) => {
    const newProfessionals = professionals.map((prof, i) => {
      if (i === index) {
        return { ...prof, image: URL.createObjectURL(file), newImageFile: file };
      }
      return prof;
    });
    onProfessionalsChange(newProfessionals);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full max-w-3xl">
          <div className="h-8 bg-base-300 rounded w-1/4"></div>
          <div className="h-48 bg-base-300 rounded"></div>
          <div className="h-48 bg-base-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('professionalsManager.allProfessionals')}
          </h3>
          <p className="text-sm text-base-content/60">
            {t('professionalsManager.description', 'Manage your team members and their roles')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProfessional}
          className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <FaPlus className="text-sm" />
          {t('professionalsManager.addProfessional')}
        </button>
      </div>

      <div className="space-y-6">
        {(professionals || []).map((prof, index) => (
          <div 
            key={index} 
            className="p-6 border border-base-300 rounded-xl bg-base-200/50 backdrop-blur-sm relative grid grid-cols-1 md:grid-cols-3 gap-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="form-control md:col-span-1">
              <ImageUpload 
                field="image"
                currentImage={prof.image}
                onImageChange={(field, file) => handleImageChange(index, field, file)}
                aspectRatio="aspect-square"
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaUser className="text-primary" />
                    {t('professionalsManager.name')}
                  </span>
                </label>
                <input
                  type="text"
                  value={prof.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder={t('professionalsManager.namePlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaBriefcase className="text-primary" />
                    {t('professionalsManager.role')}
                  </span>
                </label>
                <input
                  type="text"
                  value={prof.role}
                  onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                  className="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder={t('professionalsManager.rolePlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaEnvelope className="text-primary" />
                    {t('professionalsManager.email')}
                  </span>
                </label>
                <input
                  type="email"
                  value={prof.email}
                  onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                  className="input input-bordered w-full focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder={t('professionalsManager.emailPlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FaAlignLeft className="text-primary" />
                    {t('professionalsManager.description')}
                  </span>
                </label>
                <textarea
                  value={prof.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                  className="textarea textarea-bordered w-full h-32 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder={t('professionalsManager.descriptionPlaceholder')}
                ></textarea>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProfessional(index)}
              className="btn btn-ghost btn-sm btn-circle absolute top-4 right-4 hover:bg-error/10 transition-colors duration-300"
              aria-label={t('professionalsManager.removeProfessional')}
            >
              <FaTrash className="text-error" />
            </button>
          </div>
        ))}
      </div>

      {(!professionals || professionals.length === 0) && (
        <div className="text-center py-12 bg-base-200/50 rounded-xl border border-dashed border-base-300">
          <FaUserCog className="mx-auto text-4xl text-base-content/30 mb-4" />
          <p className="text-base-content/60 text-lg">{t('professionalsManager.noProfessionals')}</p>
          <button
            type="button"
            onClick={handleAddProfessional}
            className="btn btn-primary btn-sm gap-2 mt-4"
          >
            <FaPlus />
            {t('professionalsManager.addFirstProfessional')}
          </button>
        </div>
      )}
    </div>
  );
};

ProfessionalsManager.propTypes = {
  professionals: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string,
      email: PropTypes.string,
      description: PropTypes.string,
      image: PropTypes.string,
      newImageFile: PropTypes.object
    })
  ),
  onProfessionalsChange: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ProfessionalsManager;
