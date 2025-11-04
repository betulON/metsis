import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <div className="container">
        <h1>{t('header.about')}</h1>
        <p>{t('about.comingSoon')}</p>
      </div>
    </div>
  );
};

export default About;
