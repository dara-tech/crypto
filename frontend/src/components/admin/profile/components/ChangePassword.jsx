import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ChangePassword = ({ onPasswordChange }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = t('validation.required');
    }
    if (!formData.newPassword) {
      newErrors.newPassword = t('validation.required');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('validation.minLength', { count: 6 });
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.required');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('validation.passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onPasswordChange({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getInputClass = (field) =>
    `input input-bordered w-full ${errors[field] ? 'input-error' : ''}`;

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-xl font-bold mb-6">{t('profile.changePassword')}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
          <div key={field} className="form-control">
            <label className="label">
              <span className="label-text">{t(`profile.${field}`)}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword[field] ? 'text' : 'password'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={getInputClass(field)}
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center"
                onClick={() => togglePasswordVisibility(field)}
                tabIndex="-1"
              >
                {showPassword[field] ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors[field] && (
              <label className="label">
                <span className="label-text-alt text-error">{errors[field]}</span>
              </label>
            )}
          </div>
        ))}

        <div className="form-control mt-6">
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('common.saving') : t('profile.updatePassword')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
