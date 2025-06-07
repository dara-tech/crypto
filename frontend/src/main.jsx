import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from './i18n';
import './index.css';
import App from './App.jsx';

const FontLoader = () => {
  useEffect(() => {
    // Add font-loaded class when fonts are loaded
    document.documentElement.classList.add('fonts-loading');
    
    // Check if fonts are already loaded
    if (document.fonts) {
      Promise.all([
        document.fonts.load('1em Inter'),
        document.fonts.load('1em Hanuman')
      ]).then(() => {
        document.documentElement.classList.remove('fonts-loading');
        document.documentElement.classList.add('fonts-loaded');
      });
    } else {
      // Fallback for browsers that don't support FontFaceSet
      document.documentElement.classList.remove('fonts-loading');
      document.documentElement.classList.add('fonts-loaded');
    }
  }, []);

  return null;
};

const startApp = async () => {
  try {
    // Initialize i18n
    await initI18n();
    
    // Render the app
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <FontLoader />
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize the application:', error);
    // Render error boundary or fallback UI
    createRoot(document.getElementById('root')).render(
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Application</h1>
          <p className="text-error">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }
};

// Start the application
startApp().catch(console.error);
