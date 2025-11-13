// Load and display projects from CMS
async function loadProjects() {
    try {
        // First, try to fetch the projects directly from the content folder
        // This works when the site is deployed and the CMS has created files
        const response = await fetch('/content/projects/');
        
        // If we can't list the directory, try fetching from GitHub API as fallback
        if (!response.ok) {
            await loadProjectsFromGitHub();
            return;
        }
        
        // Parse the directory listing (this works on most static hosts)
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'))
            .map(a => a.getAttribute('href'))
            .filter(href => href && href.endsWith('.json'));
        
        if (links.length === 0) {
            // No projects found, keep static content
            console.log('No CMS projects found yet, using static content');
            return;
        }
        
        const projectPromises = links.map(link => 
            fetch(`/content/projects/${link}`).then(res => res.json())
        );
        
        const projects = await Promise.all(projectPromises);
        renderProjectsData(projects);
        
    } catch (error) {
        console.log('Error loading CMS projects:', error);
        // Try GitHub API as fallback
        try {
            await loadProjectsFromGitHub();
        } catch (e) {
            console.log('Using static content');
        }
    }
}

async function loadProjectsFromGitHub() {
    const response = await fetch('https://api.github.com/repos/betulON/metsis/contents/content/projects');
    
    if (!response.ok) {
        throw new Error('Cannot fetch from GitHub');
    }
    
    const files = await response.json();
    const projectPromises = files
        .filter(file => file.name.endsWith('.json'))
        .map(file => fetch(file.download_url).then(res => res.json()));
    
    const projects = await Promise.all(projectPromises);
    renderProjectsData(projects);
}

function renderProjectsData(projects) {
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
