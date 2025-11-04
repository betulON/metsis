import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <div className="container">
        <h1>{t('header.contact')}</h1>
        <p>{t('contact.comingSoon')}</p>
      </div>
    </div>
  );
};

export default Contact;
