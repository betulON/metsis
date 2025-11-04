import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProjectSlider = () => {
  const { t } = useTranslation();

  // Mock project data
  const projects = [
    {
      id: 1,
      title: 'Lüks Rezidans Projesi',
      titleEn: 'Luxury Residence Project',
      image: 'https://via.placeholder.com/1200x600/2c3e50/ffffff?text=Proje+1',
    },
    {
      id: 2,
      title: 'Modern Ofis Binası',
      titleEn: 'Modern Office Building',
      image: 'https://via.placeholder.com/1200x600/34495e/ffffff?text=Proje+2',
    },
    {
      id: 3,
      title: 'Alışveriş Merkezi',
      titleEn: 'Shopping Mall',
      image: 'https://via.placeholder.com/1200x600/2c3e50/ffffff?text=Proje+3',
    },
    {
      id: 4,
      title: 'Villa Kompleksi',
      titleEn: 'Villa Complex',
      image: 'https://via.placeholder.com/1200x600/34495e/ffffff?text=Proje+4',
    },
  ];

  return (
    <div className="project-slider">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <div className="slide-content">
              <img src={project.image} alt={project.title} />
              <div className="slide-overlay">
                <h2 className="slide-title">{project.title}</h2>
                <Link to={`/project/${project.id}`} className="slide-button">
                  {t('projects.viewButton')}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProjectSlider;
