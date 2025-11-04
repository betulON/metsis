# Metsis Construction Company Website

A modern, responsive website for Metsis Construction Company featuring bilingual support (Turkish/English), animated logo section, and an interactive project showcase.

## 🚀 Features

- **Bilingual Support**: Turkish (default) and English with instant language switching
- **Animated Logo Section**: Logo animation that transitions into a project slider
- **Project Showcase**: Interactive slider with project images and detail pages
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean, minimal design with smooth animations
- **React + Vite**: Fast development and optimized production builds

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **i18next** - Internationalization
- **Swiper.js** - Touch slider for projects
- **CSS3** - Styling with custom properties and animations

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🌐 Available Pages

- **Home (`/`)** - Landing page with hero section, logo animation, and project slider
- **Projects (`/projects`)** - Projects listing page
- **Project Detail (`/project/:id`)** - Individual project details
- **About (`/about`)** - Company information
- **Contact (`/contact`)** - Contact information

## 🎨 Project Structure

```
src/
├── components/         # Reusable components
│   ├── Header.jsx     # Main navigation header
│   ├── Footer.jsx     # Site footer
│   ├── LanguageSwitcher.jsx  # Language toggle button
│   ├── VideoSection.jsx      # Logo animation container
│   └── ProjectSlider.jsx     # Swiper-based project carousel
├── pages/             # Page components
│   ├── Home.jsx       # Homepage
│   ├── Projects.jsx   # Projects listing
│   ├── ProjectDetail.jsx  # Project detail page
│   ├── About.jsx      # About page
│   └── Contact.jsx    # Contact page
├── locales/           # Translation files
│   ├── tr.json        # Turkish translations
│   └── en.json        # English translations
├── i18n.js            # i18next configuration
├── App.jsx            # Main app component with routing
├── App.css            # Main styles
├── index.css          # Global styles
└── main.jsx           # App entry point
```

## 🌍 Language Support

The website supports two languages:
- **Turkish (TR)** - Default language
- **English (EN)** - Secondary language

Language can be switched instantly using the button in the header. All text content updates without page reload.

## 🎯 Key Features Explained

### Logo Animation → Slider Transition
- Homepage displays an animated logo for 3 seconds
- Automatically transitions to an interactive project slider
- Smooth fade-in animation for better UX

### Project Slider
- Auto-playing carousel with 5-second intervals
- Navigation arrows and pagination dots
- Each slide has an "İNCELE" (VIEW) button linking to project details
- Touch-enabled for mobile devices

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 480px
- Stacked navigation on mobile
- Optimized image sizes and layouts

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #2c3e50;
  --secondary-color: #34495e;
  --accent-color: #e74c3c;
}
```

### Translations
Add or modify translations in:
- `src/locales/tr.json` - Turkish
- `src/locales/en.json` - English

### Projects
Edit project data in `src/components/ProjectSlider.jsx` and `src/pages/ProjectDetail.jsx`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

© 2024 Metsis Construction. All rights reserved.
