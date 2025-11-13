// Load and display projects from CMS
async function loadProjects() {
    try {
        // Try GitHub API first (most reliable for getting all files)
        await loadProjectsFromGitHub();
    } catch (error) {
        console.log('GitHub API failed, trying direct fetch...');
        
        // Fallback: Try direct fetch methods
        try {
            // Method 1: Try index.json
            const indexResponse = await fetch('/content/projects/index.json');
            if (indexResponse.ok) {
                const index = await indexResponse.json();
                const projectPromises = index.projects.map(filename => 
                    fetch(`/content/projects/${filename}`).then(res => res.json())
                );
                const projects = await Promise.all(projectPromises);
                console.log(`Loaded ${projects.length} projects from index`);
                renderProjectsData(projects);
                return;
            }
        } catch (e) {
            console.log('No index.json, trying numbered files...');
        }
        
        // Method 2: Try numbered files
        const projectFiles = [];
        for (let i = 1; i <= 20; i++) {
            try {
                const response = await fetch(`/content/projects/project-${i}.json`);
                if (response.ok) {
                    const project = await response.json();
                    projectFiles.push(project);
                }
            } catch (e) {
                // File doesn't exist, skip
            }
        }
        
        if (projectFiles.length > 0) {
            console.log(`Loaded ${projectFiles.length} projects directly`);
            renderProjectsData(projectFiles);
        } else {
            console.log('No projects found, using static content');
        }
    }
}

async function loadProjectsFromGitHub() {
    const response = await fetch('https://api.github.com/repos/betulON/metsis/contents/content/projects');
    
    if (!response.ok) {
        throw new Error('Cannot fetch from GitHub');
    }
    
    const files = await response.json();
    
    // Filter for .json files and ignore index.json
    const projectFiles = files.filter(file => 
        file.name.endsWith('.json') && file.name !== 'index.json'
    );
    
    // Also check for .md files (in case CMS created markdown files)
    const mdFiles = files.filter(file => file.name.endsWith('.md'));
    
    if (projectFiles.length === 0 && mdFiles.length === 0) {
        throw new Error('No project files found');
    }
    
    // Load JSON files
    const jsonPromises = projectFiles.map(async file => {
        const data = await fetch(file.download_url).then(res => res.json());
        // Handle both single object and array of objects
        return Array.isArray(data) ? data : [data];
    });
    
    // Load MD files (Decap CMS uses frontmatter in markdown)
    const mdPromises = mdFiles.map(async file => {
        const text = await fetch(file.download_url).then(res => res.text());
        const parsed = parseFrontmatter(text);
        return parsed ? [parsed] : [];
    });
    
    const allPromises = [...jsonPromises, ...mdPromises];
    const projectArrays = await Promise.all(allPromises);
    
    // Flatten the arrays (in case some files contain multiple projects)
    const projects = projectArrays.flat().filter(p => p !== null);
    
    console.log(`Loaded ${projects.length} projects from GitHub`);
    renderProjectsData(projects);
}

// Parse YAML frontmatter from markdown files
function parseFrontmatter(text) {
    const match = text.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!match) return null;
    
    const frontmatter = match[1];
    const data = {};
    
    // Simple YAML parser for our use case
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Convert number strings to numbers
            if (!isNaN(value) && value !== '') {
                value = Number(value);
            }
            
            data[key] = value;
        }
    });
    
    return data;
}

function renderProjectsData(projects) {
    // Sort by order field
    projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Render all projects in single section
    renderProjects(projects);
}

function renderProjects(projects) {
    const section = document.querySelector('#projects .project-grid');
    if (!section) {
        console.log('Project grid not found');
        return;
    }
    
    // Clear existing content
    section.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'tr';
    
    console.log('Rendering projects:', projects); // Debug log
    
    projects.forEach((project, index) => {
        console.log(`Project ${index}:`, project); // Debug each project
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-cms', JSON.stringify(project));
        
        // Build project details HTML
        let detailsHTML = '';
        
        if (project.location_tr || project.location_en) {
            const locationLabel = currentLang === 'tr' ? 'Lokasyon' : 'Location';
            const locationValue = currentLang === 'tr' ? (project.location_tr || project.location_en) : (project.location_en || project.location_tr);
            detailsHTML += `
                <div class="project-detail">
                    <strong data-tr="Lokasyon:" data-en="Location:">${locationLabel}:</strong>
                    <span data-tr="${project.location_tr || ''}" data-en="${project.location_en || ''}">${locationValue}</span>
                </div>
            `;
        }
        
        if (project.customer) {
            const customerLabel = currentLang === 'tr' ? 'Müşteri' : 'Customer';
            detailsHTML += `
                <div class="project-detail">
                    <strong data-tr="Müşteri:" data-en="Customer:">${customerLabel}:</strong>
                    <span>${project.customer}</span>
                </div>
            `;
        }
        
        if (project.start_date) {
            const startLabel = currentLang === 'tr' ? 'Başlangıç Tarihi' : 'Start Date';
            detailsHTML += `
                <div class="project-detail">
                    <strong data-tr="Başlangıç Tarihi:" data-en="Start Date:">${startLabel}:</strong>
                    <span>${project.start_date}</span>
                </div>
            `;
        }
        
        if (project.completion_date) {
            const completionLabel = currentLang === 'tr' ? 'Tamamlanma Tarihi' : 'Completion Date';
            detailsHTML += `
                <div class="project-detail">
                    <strong data-tr="Tamamlanma Tarihi:" data-en="Completion Date:">${completionLabel}:</strong>
                    <span>${project.completion_date}</span>
                </div>
            `;
        }
        
        if (project.description_tr || project.description_en) {
            const description = currentLang === 'tr' ? (project.description_tr || project.description_en) : (project.description_en || project.description_tr);
            detailsHTML += `
                <div class="project-detail">
                    <p data-tr="${project.description_tr || ''}" data-en="${project.description_en || ''}">${description}</p>
                </div>
            `;
        }
        
        console.log(`Project ${index} details HTML:`, detailsHTML); // Debug HTML
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title_tr}">
                <div class="project-title" data-tr="${project.title_tr}" data-en="${project.title_en}">${currentLang === 'tr' ? project.title_tr : project.title_en}</div>
            </div>
            <div class="project-info">
                ${detailsHTML}
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
