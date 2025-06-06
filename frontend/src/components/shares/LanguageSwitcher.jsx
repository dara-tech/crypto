import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { FaGlobeAmericas, FaCheck } from 'react-icons/fa';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const currentLang = i18n.language || 'en';

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: 'en', name: t('english'), flag: '🇺🇸' },
    { code: 'km', name: t('khmer'), flag: '🇰🇭' }
  ];

  return (
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="btn btn-ghost btn-sm rounded-btn flex items-center gap-2 hover:bg-base-200 transition-all"
      >
        <FaGlobeAmericas className="w-4 h-4" />
        <span className="font-medium">{currentLang.toUpperCase()}</span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-lg w-52 mt-2 border border-base-300"
      >
        {languages.map((lang) => (
          <li key={lang.code}>
            <button 
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center justify-between py-2 px-4 hover:bg-base-200 rounded-md transition-colors ${
                currentLang === lang.code ? 'bg-base-200 font-medium' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLang === lang.code && <FaCheck className="text-primary" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
