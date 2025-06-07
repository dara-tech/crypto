import { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaImage, FaSpinner } from 'react-icons/fa';

const LogoUpload = ({ logo, logoPreview, onLogoChange, error, setError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCheckingImage, setIsCheckingImage] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, or GIF)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    // Check if image is suitable for background removal
    checkImageSuitability(file);
  };

  const checkImageSuitability = (file) => {
    setIsCheckingImage(true);
    const img = new Image();
    img.onload = () => {
      // Check image dimensions
      if (img.width < 100 || img.height < 100) {
        setError('Image is too small. Please use an image at least 100x100 pixels.');
        setIsCheckingImage(false);
        return;
      }

      // Create a canvas to analyze the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check if image has enough contrast
      let hasContrast = false;
      let totalPixels = 0;
      let darkPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness < 128) {
          darkPixels++;
        }
        totalPixels++;
      }

      const darkPixelRatio = darkPixels / totalPixels;
      hasContrast = darkPixelRatio > 0.1 && darkPixelRatio < 0.9;

      if (!hasContrast) {
        setError('Image may not be suitable for background removal. Please use an image with a clear subject and good contrast.');
        setIsCheckingImage(false);
        return;
      }

      // If all checks pass, set the file
      onLogoChange(file);
      setIsCheckingImage(false);
    };

    img.onerror = () => {
      setError('Failed to load image. Please try another file.');
      setIsCheckingImage(false);
    };

    img.src = URL.createObjectURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const removeBackground = async (file) => {
    try {
      setIsRemovingBg(true);
      setError(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('image_file', file);

      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
          'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Convert arraybuffer to blob
      const blob = new Blob([response.data], { type: 'image/png' });
      const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
      
      onLogoChange(newFile);
      setUploadProgress(100);
    } catch (err) {
      setError('Failed to remove background. Please try again.');
      console.error('Background removal error:', err);
    } finally {
      setIsRemovingBg(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">School Logo</span>
        <span className="label-text-alt text-xs text-base-content/70">
          Upload a logo for your school
        </span>
      </label>
      <div 
        className={`flex flex-col items-center space-y-4 p-6 border-2 border-dashed rounded-lg transition-colors duration-200 ${
          isDragging ? 'border-primary bg-primary/10' : 'border-base-300'
        } ${error ? 'border-error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {logo && (
          <div className="absolute top-34 right-16 tooltip tooltip-left" data-tip="Remove background from logo">
            <button
              onClick={() => removeBackground(logo)}
              disabled={isRemovingBg || isCheckingImage}
              className="btn btn-circle btn-sm btn-secondary hover:btn-primary transition-colors duration-200"
            >
              {isRemovingBg ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FaImage className="h-4 w-4" />
              )}
            </button>
          </div>
        )}

        <div className="relative group">
          <div className="avatar">
            <div className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="School Logo Preview" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-school.png';
                  }}
                />
              ) : (
                <div className="bg-base-300 w-full h-full flex items-center justify-center">
                  <span className="text-4xl">🏫</span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-2 right-2 tooltip tooltip-left" data-tip="Upload new logo">
            <label className="btn btn-circle btn-sm btn-primary hover:btn-secondary transition-colors duration-200 cursor-pointer">
              {isCheckingImage ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FaCamera className="h-4 w-4" />
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        {(isRemovingBg || isCheckingImage) && (
          <div className="w-full max-w-xs">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-base-content">
                {isRemovingBg ? 'Removing background...' : 'Checking image...'}
              </span>
              {isRemovingBg && (
                <span className="text-sm font-medium text-base-content">{uploadProgress}%</span>
              )}
            </div>
            {isRemovingBg && (
              <div className="w-full bg-base-200 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-sm text-base-content/70">
            {logo ? (
              <>
                <span className="font-medium">Logo uploaded!</span> Drag and drop a new one or click the camera icon to change
              </>
            ) : (
              'Drag and drop your logo here, or click the camera icon to upload'
            )}
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-base-content/70">
              Supported formats: JPG, PNG, GIF • Max size: 5MB
            </p>
            <p className="text-xs text-base-content/70">
              For best results: Use images with clear subjects and good contrast
            </p>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-2">
          <div className="alert alert-error py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload; 