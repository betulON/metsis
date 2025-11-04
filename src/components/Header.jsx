import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <h1 className="logo-text">METSIS</h1>
          </Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li><Link to="/">{t('header.home')}</Link></li>
            <li><Link to="/projects">{t('header.projects')}</Link></li>
            <li><Link to="/about">{t('header.about')}</Link></li>
            <li><Link to="/contact">{t('header.contact')}</Link></li>
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
