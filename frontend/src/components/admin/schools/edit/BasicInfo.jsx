import { useState } from 'react';
import { IoInformationCircle } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const BasicInfo = ({ formData, onInputChange, onImageChange }) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Validate text length
  const validateTextLength = (text, maxLength) => {
    return text.length <= maxLength;
  };

  // Handle text input with validation
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const maxLengths = {
      about: 500,
      mission: 200,
      vision: 200
    };

    if (maxLengths[name] && !validateTextLength(value, maxLengths[name])) {
      toast.error(`Maximum ${maxLengths[name]} characters allowed`);
      return;
    }

    onInputChange(e);
  };

  const renderTextArea = (field, label, placeholder, maxLength, tooltip) => (
    <div className="form-control space-y-2">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
        <div className="tooltip" data-tip={tooltip}>
          <IoInformationCircle className="w-4 h-4 text-gray-400" />
        </div>
      </label>
      <div className="relative">
        <textarea
          name={field}
          value={formData[field] || ''}
          onChange={handleTextChange}
          onFocus={() => handleFocus(field)}
          onBlur={handleBlur}
          className={`textarea w-full textarea-bordered h-32 transition-all duration-200 ${
            focusedField === field ? 'textarea-primary' : ''
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {formData[field]?.length || 0}/{maxLength}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="form-control space-y-2">
        <label className="label">
          <span className="label-text font-medium">School Name</span>
          <div className="tooltip" data-tip="Enter your school's official name">
            <IoInformationCircle className="w-4 h-4 text-gray-400" />
          </div>
        </label>
        <input 
          name="name" 
          value={formData.name || ''} 
          onChange={onInputChange}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          className={`input input-bordered w-full transition-all duration-200 ${
            focusedField === 'name' ? 'input-primary' : ''
          }`}
          placeholder="Enter school name" 
          required 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          {renderTextArea(
            'about',
            'About',
            'Tell us about your school...',
            500,
            'Share your school\'s story and unique features (max 500 characters)'
          )}
          <ImageUpload
            field="about"
            label="About Image"
            currentImage={formData.aboutImage}
            onImageChange={onImageChange}
            tooltip="Upload an image that represents your school's story"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="space-y-4">
          {renderTextArea(
            'mission',
            'Mission',
            'What is your school\'s mission?',
            200,
            'Define your school\'s purpose and goals (max 200 characters)'
          )}
          <ImageUpload
            field="mission"
            label="Mission Image"
            currentImage={formData.missionImage}
            onImageChange={onImageChange}
            tooltip="Upload an image that represents your school's mission"
            aspectRatio="aspect-video"
          />
        </div>

        <div className="space-y-4">
          {renderTextArea(
            'vision',
            'Vision',
            'What is your school\'s vision?',
            200,
            'Describe your school\'s future aspirations (max 200 characters)'
          )}
          <ImageUpload
            field="vision"
            label="Vision Image"
            currentImage={formData.visionImage}
            onImageChange={onImageChange}
            tooltip="Upload an image that represents your school's vision"
            aspectRatio="aspect-video"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;