import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>METSIS</h3>
          <p>{t('footer.rights')}</p>
        </div>
        <div className="footer-section">
          <h4>{t('footer.address')}</h4>
          <p>İstanbul, Türkiye</p>
        </div>
        <div className="footer-section">
          <h4>{t('footer.phone')}</h4>
          <p>+90 XXX XXX XX XX</p>
        </div>
        <div className="footer-section">
          <h4>{t('footer.email')}</h4>
          <p>info@metsis.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
