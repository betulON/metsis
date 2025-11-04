import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  // Mock project data
  const projects = {
    1: { 
      title: 'Lüks Rezidans Projesi',
      titleEn: 'Luxury Residence Project',
      description: 'Modern mimari ile tasarlanmış lüks rezidans projesi.',
      descriptionEn: 'Luxury residence project designed with modern architecture.',
      location: 'İstanbul',
      year: '2023'
    },
    2: { 
      title: 'Modern Ofis Binası',
      titleEn: 'Modern Office Building',
      description: 'İş hayatının merkezinde konforlu çalışma alanları.',
      descriptionEn: 'Comfortable workspaces in the heart of business life.',
      location: 'Ankara',
      year: '2023'
    },
    3: { 
      title: 'Alışveriş Merkezi',
      titleEn: 'Shopping Mall',
      description: 'Geniş mağaza alanları ile modern alışveriş merkezi.',
      descriptionEn: 'Modern shopping mall with extensive store spaces.',
      location: 'İzmir',
      year: '2024'
    },
    4: { 
      title: 'Villa Kompleksi',
      titleEn: 'Villa Complex',
      description: 'Doğa ile iç içe huzurlu villa yaşamı.',
      descriptionEn: 'Peaceful villa life intertwined with nature.',
      location: 'Bodrum',
      year: '2024'
    }
  };

  const project = projects[id];
  const lang = t('header.home') === 'Ana Sayfa' ? 'tr' : 'en';

  if (!project) {
    return <div className="container"><h1>Proje bulunamadı / Project not found</h1></div>;
  }

  return (
    <div className="project-detail-page">
      <div className="container">
        <h1>{lang === 'tr' ? project.title : project.titleEn}</h1>
        <div className="project-info">
          <p><strong>{t('footer.address')}:</strong> {project.location}</p>
          <p><strong>{lang === 'tr' ? 'Yıl' : 'Year'}:</strong> {project.year}</p>
        </div>
        <div className="project-description">
          <p>{lang === 'tr' ? project.description : project.descriptionEn}</p>
        </div>
        <div className="project-gallery">
          <img src={`https://via.placeholder.com/800x600/2c3e50/ffffff?text=${encodeURIComponent(lang === 'tr' ? project.title : project.titleEn)}`} alt={project.title} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
