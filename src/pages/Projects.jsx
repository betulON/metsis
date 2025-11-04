import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();

  return (
    <div className="projects-page">
      <div className="container">
        <h1>{t('projects.title')}</h1>
        <p>Projeler sayfası içeriği yakında eklenecektir.</p>
      </div>
    </div>
  );
};

export default Projects;
