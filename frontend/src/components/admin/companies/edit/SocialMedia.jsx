import { useState } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

const SocialMedia = ({ formData, onInputChange }) => {
  const [focusedField, setFocusedField] = useState(null);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const socialPlatforms = [
    {
      name: 'facebook',
      icon: <FaFacebook className="text-[#1877F2] text-xl" />,
      placeholder: 'https://facebook.com/your-school',
      color: '#1877F2'
    },
    {
      name: 'instagram',
      icon: <FaInstagram className="text-[#E4405F] text-xl" />,
      placeholder: 'https://instagram.com/your-school',
      color: '#E4405F'
    },
    {
      name: 'youtube',
      icon: <FaYoutube className="text-[#FF0000] text-xl" />,
      placeholder: 'https://youtube.com/your-school',
      color: '#FF0000'
    },
    {
      name: 'linkedin',
      icon: <FaLinkedin className="text-[#0A66C2] text-xl" />,
      placeholder: 'https://linkedin.com/company/your-school',
      color: '#0A66C2'
    }
  ];

  return (
    <div className="space-y-4">
      {socialPlatforms.map((platform) => (
        <div key={platform.name} className="form-control space-y-2">
          <label className="label">
            <span className="label-text font-medium capitalize flex items-center gap-2">
              {platform.icon}
              {platform.name}
            </span>
          </label>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 group-hover:text-[${platform.color}] transition-colors duration-200">
              {platform.icon}
            </span>
            <input
              name={`socialMedia.${platform.name}`}
              value={formData.socialMedia[platform.name]}
              onChange={onInputChange}
              onFocus={() => handleFocus(platform.name)}
              onBlur={handleBlur}
              className={`input input-bordered w-full pl-10 transition-all duration-200 hover:border-[${platform.color}] ${
                focusedField === platform.name ? `border-[${platform.color}] ring-1 ring-[${platform.color}]` : ''
              }`}
              placeholder={platform.placeholder}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialMedia;