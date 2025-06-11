import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrash, FaUserCog } from 'react-icons/fa';
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
    return <div>{t('professionalsManager.loading', 'Loading professionals...')}</div>; 
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-normal text-mute font-medium ">{t('professionalsManager.allProfessionals')}</h3>
        <button
          type="button"
          onClick={handleAddProfessional}
          className="btn btn-primary btn-sm gap-2"
        >
          <FaPlus />
          {t('professionalsManager.addProfessional')}
        </button>
      </div>

      <div className="space-y-4">
        {(professionals || []).map((prof, index) => (
          <div key={index} className="p-4 border rounded-lg bg-base-200 relative grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control md:col-span-1">
              <ImageUpload 
                field="image"
                currentImage={prof.image}
                onImageChange={(field, file) => handleImageChange(index, field, file)}
                aspectRatio="aspect-square"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">{t('professionalsManager.name')}</span></label>
                <input
                  type="text"
                  value={prof.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={t('professionalsManager.namePlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">{t('professionalsManager.role')}</span></label>
                <input
                  type="text"
                  value={prof.role}
                  onChange={(e) => handleInputChange(index, 'role', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={t('professionalsManager.rolePlaceholder')}
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">{t('professionalsManager.email')}</span></label>
                <input
                  type="text"
                  value={prof.email}
                  onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                  className="input input-bordered w-full"
                  placeholder={t('professionalsManager.emailPlaceholder')}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">{t('professionalsManager.description')}</span></label>
                <textarea
                  value={prof.description}
                  onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                  className="textarea textarea-bordered w-full h-45"
                  rows="3"
                  placeholder={t('professionalsManager.descriptionPlaceholder')}
                ></textarea>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveProfessional(index)}
              className="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
              aria-label={t('professionalsManager.removeProfessional')}
            >
              <FaTrash className="text-error" />
            </button>
          </div>
        ))}
      </div>

      {(!professionals || professionals.length === 0) && (
        <div className="text-center py-8 text-base-content/60">
          <p>{t('professionalsManager.noProfessionals')}</p>
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
