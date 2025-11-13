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
