// about-loader.js — loads About page sections from /content/about/activities.json
async function loadAboutSections() {
  try {
    const resp = await fetch('/content/about/activities.json');
    if (!resp.ok) {
      console.log('No about content found:', resp.status);
      return;
    }

    const data = await resp.json();
    // Accept either { sections: [...] } or single object -> convert to sections array
    const sections = Array.isArray(data.sections)
      ? data.sections
      : (Array.isArray(data) ? data : (data.sections ? data.sections : [data]));

    renderAboutSections(sections);
  } catch (e) {
    console.error('Error loading about sections', e);
  }
}

function renderAboutSections(sections) {
  const container = document.querySelector('#about-sections');
  if (!container) return;
  container.innerHTML = '';

  const currentLang = localStorage.getItem('language') || 'tr';

  sections.forEach((sec, idx) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'about-section content-section';

    const title = document.createElement('h2');
    title.innerText = currentLang === 'tr' ? (sec.title_tr || sec.title_en || '') : (sec.title_en || sec.title_tr || '');
    title.setAttribute('data-tr', sec.title_tr || '');
    title.setAttribute('data-en', sec.title_en || '');

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'about-content';
    const raw = currentLang === 'tr' ? (sec.content_tr || sec.content_en || '') : (sec.content_en || sec.content_tr || '');

    // Simple paragraph splitting for markdown/plain text
    const paragraphs = raw.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    paragraphs.forEach(p => {
      const pEl = document.createElement('p');
      pEl.innerText = p;
      pEl.setAttribute('data-tr', sec.content_tr || '');
      pEl.setAttribute('data-en', sec.content_en || '');
      contentWrapper.appendChild(pEl);
    });

    sectionEl.appendChild(title);
    sectionEl.appendChild(contentWrapper);
    container.appendChild(sectionEl);
  });
}

// Initialize on DOMContentLoaded if on about page
if (document.querySelector('.about-page')) {
  document.addEventListener('DOMContentLoaded', function() {
    loadAboutSections();
  });
}
// Load and display about sections from CMS
async function loadAboutSections() {
    try {
        // Try GitHub API first
        await loadAboutFromGitHub();
    } catch (error) {
        console.log('GitHub API failed, trying direct fetch...');
        
        // Fallback: Try numbered files or specific files
        try {
            const sectionFiles = [
                'biz-kimiz.json',
                'faaliyet-alanlari.json'
            ];
            
            const sections = [];
            for (const filename of sectionFiles) {
                try {
                    const response = await fetch(`/content/about/${filename}`);
                    if (response.ok) {
                        const data = await response.json();
                        sections.push(data);
                    }
                } catch (e) {
                    console.log(`Could not load ${filename}`);
                }
            }
            
            if (sections.length > 0) {
                console.log(`Loaded ${sections.length} about sections`);
                renderAboutSections(sections);
            }
        } catch (e) {
            console.log('Could not load about sections:', e);
        }
    }
}

async function loadAboutFromGitHub() {
    const response = await fetch('https://api.github.com/repos/betulON/metsis/contents/content/about');
    
    if (!response.ok) {
        throw new Error('Cannot fetch from GitHub');
    }
    
    const files = await response.json();
    
    // Filter for .json files and ignore activities.json (old file)
    const sectionFiles = files.filter(file => 
        file.name.endsWith('.json') && file.name !== 'activities.json'
    );
    
    if (sectionFiles.length === 0) {
        throw new Error('No section files found');
    }
    
    // Load all section files
    const promises = sectionFiles.map(async file => {
        const data = await fetch(file.download_url).then(res => res.json());
        return data;
    });
    
    const sections = await Promise.all(promises);
    
    console.log(`Loaded ${sections.length} about sections from GitHub`);
    renderAboutSections(sections);
}

function renderAboutSections(sections) {
    const container = document.querySelector('#about-sections-container');
    if (!container) {
        console.log('About sections container not found');
        return;
    }
    
    // Sort by order field
    sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Clear existing content
    container.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'tr';
    
    sections.forEach((section, index) => {
        const sectionElement = document.createElement('section');
        sectionElement.id = `section-${index}`;
        sectionElement.className = index % 2 === 0 ? 'content-section' : 'content-section bg-light';
        
        const title = currentLang === 'tr' ? section.title_tr : section.title_en;
        const content = currentLang === 'tr' ? section.content_tr : section.content_en;
        
        // Convert markdown line breaks and lists to HTML
        const htmlContent = content
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n- /g, '<li>')
            .replace(/\n/g, '<br>');
        
        sectionElement.innerHTML = `
            <div class="container">
                <h2 data-tr="${section.title_tr}" data-en="${section.title_en}">${title}</h2>
                <p data-tr="${section.content_tr}" data-en="${section.content_en}">${htmlContent}</p>
            </div>
        `;
        
        container.appendChild(sectionElement);
    });
}

// Initialize about sections on page load
if (document.querySelector('.about-page')) {
    document.addEventListener('DOMContentLoaded', async function() {
        await loadAboutSections();
        // Re-apply language after loading sections
        if (typeof switchLanguage !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'tr';
            if (currentLang === 'en') {
                setTimeout(() => switchToEnglish(), 100);
            }
        }
    });
}
