import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button 
      className="language-switcher"
      onClick={toggleLanguage}
      aria-label="Switch language"
    >
      {i18n.language === 'tr' ? 'EN' : 'TR'}
    </button>
  );
};

export default LanguageSwitcher;
