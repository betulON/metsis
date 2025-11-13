// Load and display projects from CMS
async function loadProjects() {
    try {
        // Fetch all project files from the content/projects directory
        const response = await fetch('https://api.github.com/repos/betulON/metsis/contents/content/projects');
        
        if (!response.ok) {
            console.log('Using static content - CMS projects not available yet');
            return;
        }
        
        const files = await response.json();
        const projectPromises = files
            .filter(file => file.name.endsWith('.json'))
            .map(file => fetch(file.download_url).then(res => res.json()));
        
        const projects = await Promise.all(projectPromises);
        
        // Sort by order field
        projects.sort((a, b) => (a.order || 0) - (b.order || 0));
        
        // Separate by status
        const ongoingProjects = projects.filter(p => p.status === 'ongoing');
        const completedProjects = projects.filter(p => p.status === 'completed');
        
        // Render projects
        if (ongoingProjects.length > 0) {
            renderProjects(ongoingProjects, 'ongoing');
        }
        if (completedProjects.length > 0) {
            renderProjects(completedProjects, 'completed');
        }
        
    } catch (error) {
        console.log('Error loading CMS projects:', error);
        console.log('Using static content instead');
    }
}

function renderProjects(projects, status) {
    const section = document.querySelector(`#${status} .project-grid`);
    if (!section) return;
    
    // Clear existing content
    section.innerHTML = '';
    
    const statusLabelTr = status === 'ongoing' ? 'Devam Ediyor' : 'Tamamlandı';
    const statusLabelEn = status === 'ongoing' ? 'In Progress' : 'Completed';
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-cms', JSON.stringify(project));
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title_tr}">
                <span class="status-tag ${status}" data-tr="${statusLabelTr}" data-en="${statusLabelEn}">${statusLabelTr}</span>
            </div>
            <div class="project-info">
                <h3 data-tr="${project.title_tr}" data-en="${project.title_en}">${project.title_tr}</h3>
                <p data-tr="${project.description_tr}" data-en="${project.description_en}">${project.description_tr}</p>
            </div>
        `;
        
        section.appendChild(card);
    });
}

// Initialize projects on page load
if (document.querySelector('.projects-page')) {
    document.addEventListener('DOMContentLoaded', async function() {
        await loadProjects();
        // Re-apply language after loading projects
        if (typeof switchLanguage !== 'undefined') {
            const currentLang = localStorage.getItem('language') || 'tr';
            if (currentLang === 'en') {
                setTimeout(() => switchToEnglish(), 100);
            }
        }
    });
}
