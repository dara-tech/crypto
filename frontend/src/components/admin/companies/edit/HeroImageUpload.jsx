import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaTrash, FaSpinner, FaMagic } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const HeroImageUpload = ({ currentImage, onImageChange }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('imageUpload.typeError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('imageUpload.sizeError'));
      return;
    }

    processImageFile(file);
  };

  const processImageFile = async (file) => {
    setIsLoading(true);
    setUploadProgress(0);
    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onImageChange(file);
      toast.success(t('imageUpload.uploadSuccess'));
    } catch {
      toast.error(t('imageUpload.uploadError'));
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const removeBackground = async () => {
    if (!previewUrl || isLoading) return;

    setIsLoading(true);
    setUploadProgress(10);

    try {
      const response = await fetch(previewUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('image_file', file);

      const { data } = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          responseType: 'blob',
          headers: { 'X-Api-Key': 'ubuN1CfeN1T5JMyeNoXHWMdy' },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(50 + percent / 2);
          },
        }
      );

      const newUrl = URL.createObjectURL(new Blob([data]));
      setPreviewUrl(newUrl);
      onImageChange(new File([data], 'no-bg.png', { type: 'image/png' }));
      toast.success(t('imageUpload.bgRemoved'));
    } catch (error) {
      console.error(error);
      toast.error(t('imageUpload.bgRemoveError'));
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    onImageChange(null);
  };

  return (
    <div className="space-y-4">
      <div
        className="relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center h-64 cursor-pointer"
        onClick={() => !isLoading && fileInputRef.current?.click()}
        aria-label={t('common.uploadImage')}
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-3xl text-gray-600" aria-busy="true" />
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-width duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full">
            <img
              src={previewUrl}
              alt={t('profile.picture.alt') || 'Uploaded Preview'}
              className="w-full h-full object-contain rounded"
              draggable={false}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex justify-center space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeBackground();
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded flex items-center hover:bg-blue-700 focus:outline-none focus:ring"
                disabled={isLoading}
                aria-label={t('common.removeBg')}
              >
                <FaMagic className="mr-2" /> {t('common.removeBg')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="px-3 py-1 bg-red-600 text-white rounded flex items-center hover:bg-red-700 focus:outline-none focus:ring"
                aria-label={t('common.remove')}
              >
                <FaTrash className="mr-2" /> {t('common.remove')}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-600">
            <FaCamera className="text-5xl mb-2" />
            <p>{t('common.uploadImage')}</p>
            <p className="text-sm mt-1 text-gray-400">{t('common.dragAndDrop')}</p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default HeroImageUpload;
