import { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaCamera, FaImage, FaSpinner, FaTimes, FaExpand } from 'react-icons/fa';

// A dedicated component for the preview modal
const PreviewModal = ({ src, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="relative p-4 bg-white rounded-lg shadow-xl max-w-lg w-full">
      <img src={src} alt="Logo Preview" className="rounded-md w-full h-auto" />
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-ghost bg-white"
      >
        <FaTimes />
      </button>
    </div>
  </div>
);

// A skeleton loader for a better initial UI impression
const LogoSkeleton = () => (
  <div className="flex flex-col items-center space-y-4 p-6">
    <div className="avatar">
      <div className="w-48 h-48 rounded-full bg-base-300 animate-pulse"></div>
    </div>
    <div className="h-4 bg-base-300 rounded w-3/4 animate-pulse"></div>
    <div className="h-3 bg-base-300 rounded w-1/2 animate-pulse"></div>
  </div>
);

const LogoUpload = ({ logo, logoPreview, onLogoChange, error, setError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCheckingImage, setIsCheckingImage] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isLoading = isRemovingBg || isCheckingImage;

  const handleFileChange = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  }, []);

  const validateAndSetFile = useCallback((file) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setError('File size is too large. Please upload an image under 5MB.');
      return;
    }
    checkImageSuitability(file);
  }, [setError]);

  const checkImageSuitability = useCallback((file) => {
    setIsCheckingImage(true);
    const img = new Image();
    img.onload = () => {
      if (img.width < 100 || img.height < 100) {
        setError('Image is too small. A minimum of 100x100 pixels is required.');
        setIsCheckingImage(false);
        return;
      }
      onLogoChange(file);
      setIsCheckingImage(false);
    };
    img.onerror = () => {
      setError('The selected file could not be loaded. It may be corrupted.');
      setIsCheckingImage(false);
    };
    img.src = URL.createObjectURL(file);
  }, [onLogoChange, setError]);

  const handleDragEvents = useCallback((e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  }, []);

  const handleDrop = useCallback((e) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, validateAndSetFile]);

  const removeBackground = useCallback(async () => {
    if (!logo) return;
    setIsRemovingBg(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image_file', logo);
    formData.append('size', 'auto');

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: { 'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy' }, // Replace with your API key
        responseType: 'arraybuffer',
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      const blob = new Blob([response.data], { type: 'image/png' });
      const newFile = new File([blob], logo.name.replace(/\.[^/.]+$/, '.png'), { type: 'image/png' });
      onLogoChange(newFile);
    } catch (err) {
      setError('Background removal failed. This can happen with low-contrast images.');
      console.error('Background removal error:', err);
    } finally {
      setIsRemovingBg(false);
    }
  }, [logo, onLogoChange, setError]);

  const statusMessage = useMemo(() => {
    if (isRemovingBg) return `Removing background... ${uploadProgress}%`;
    if (isCheckingImage) return 'Analyzing image...';
    if (logo) return 'Logo uploaded successfully!';
    return 'Drag & drop, or click the camera to upload.';
  }, [isRemovingBg, isCheckingImage, logo, uploadProgress]);

  if (!onLogoChange) return <LogoSkeleton />;

  return (
    <>
      {isPreviewOpen && logoPreview && <PreviewModal src={logoPreview} onClose={() => setIsPreviewOpen(false)} />}
      <div className="form-control w-full max-w-md mx-auto">
        <div
          className={`relative p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-base-300'
          } ${error ? 'border-error' : ''}`}
          onDragEnter={(e) => handleDragEvents(e, true)}
          onDragOver={(e) => handleDragEvents(e, true)}
          onDragLeave={(e) => handleDragEvents(e, false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="avatar">
                <div className="w-48 h-48 rounded-full ring-4 ring-primary/20 ring-offset-base-100 ring-offset-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="object-cover w-full h-full" />
                  ) : (
                    <div className="bg-base-200 w-full h-full flex items-center justify-center text-5xl text-base-content/30">
                      <FaImage />
                    </div>
                  )}
                </div>
              </div>

              <label className="absolute bottom-2 right-2 btn btn-circle btn-primary shadow-lg cursor-pointer transition-transform transform group-hover:scale-110">
                {isLoading ? <FaSpinner className="h-5 w-5 animate-spin" /> : <FaCamera className="h-5 w-5" />}
                <input type="file" className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileChange} disabled={isLoading} />
              </label>

              {/* {logoPreview && (
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="absolute top-2 right-2 btn btn-circle btn-ghost btn-sm bg-white/70 backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100"
                  data-tip="Enlarge Preview"
                >
                  <FaExpand />
                </button>
              )} */}
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-base-content">
                Company Logo
              </p>
              <p className="text-sm text-base-content/70 px-4">
                {statusMessage}
              </p>
            </div>

            {logo && (
              <button onClick={removeBackground} disabled={isRemovingBg} className="btn btn-secondary btn-sm group">
                {isRemovingBg ? <FaSpinner className="animate-spin mr-2" /> : <FaImage className="mr-2" />}
                Remove Background
              </button>
            )}

            {isRemovingBg && (
              <progress className="progress progress-primary w-56" value={uploadProgress} max="100"></progress>
            )}
            
            <div className="text-xs text-base-content/50 pt-2">
              JPG, PNG, GIF formats supported • Max 5MB
            </div>
          </div>
        </div>
        {error && (
          <div role="alert" className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default LogoUpload;