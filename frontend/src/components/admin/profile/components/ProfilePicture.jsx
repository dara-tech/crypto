import React from 'react';

const ProfilePicture = ({ 
  imagePreview, 
  handleFileChange
}) => {
  return (
    <div className="">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="avatar">
            <div className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              ) : (
                <div className="bg-base-300 w-full h-full flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
          </div>

          <label className="absolute bottom-2 right-2 btn btn-circle btn-sm btn-primary hover:btn-secondary transition-colors duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <p className="text-xs text-base-content/70">
          Click the camera icon to update your profile picture
        </p>
        <p className="text-xs text-error">
          Maximum file size: 5MB
        </p>
      </div>
    </div>
  );
};

export default ProfilePicture;
