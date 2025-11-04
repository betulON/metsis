import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <div className="projects-page">
      <div className="container">
        <h1>{t('projects.title')}</h1>
        <p>{t('projects.comingSoon')}</p>
      </div>
    </div>
  );
};

export default Projects;
