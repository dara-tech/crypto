import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

// Initialize i18next
const initI18n = () => {
  return i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      supportedLngs: ['en', 'km'],
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      ns: ['translation'],
      defaultNS: 'translation',
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: true,
        wait: true
      }
    });
};

// Initialize i18n and export the promise
export const i18nInitPromise = initI18n();

// Log when language changes
i18n.on('languageChanged', (lng) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Language changed to:', lng);
  }
});

export default i18n;
