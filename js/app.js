// Données des cours PDF (à adapter avec vos fichiers)
const coursesData = {
    "1AC": {
        "maths": [
            { 
                title: "Les nombres entiers et décimaux", 
                description: "Introduction aux nombres entiers et décimaux avec exercices pratiques",
                file: "pdf/1AC/maths/nombres_entiers.pdf",
                thumbnail: "img/thumbnails/maths1.jpg",
                duration: "45 min",
                pages: 12,
                size: "2.4 MB"
            },
            { 
                title: "Opérations de base", 
                description: "Addition, soustraction, multiplication et division",
                file: "pdf/1AC/maths/operations.pdf",
                thumbnail: "img/thumbnails/maths2.jpg",
                duration: "1h",
                pages: 15,
                size: "3.1 MB"
            }
        ],
        "physics": [
            { 
                title: "Introduction à la physique", 
                description: "Découverte des concepts fondamentaux de la physique",
                file: "pdf/1AC/physique/introduction.pdf",
                thumbnail: "img/thumbnails/physique1.jpg",
                duration: "40 min",
                pages: 10,
                size: "1.8 MB"
            }
        ]
    },
    "2AC": {
        "maths": [
            { 
                title: "Calcul algébrique", 
                description: "Expressions algébriques et résolution d'équations",
                file: "pdf/2AC/maths/algebre.pdf",
                thumbnail: "img/thumbnails/maths3.jpg",
                duration: "1h",
                pages: 18,
                size: "3.5 MB"
            }
        ],
        "physics": [
            { 
                title: "Mouvement et vitesse", 
                description: "Cinématique de base et calcul de vitesse",
                file: "pdf/2AC/physique/mouvement.pdf",
                thumbnail: "img/thumbnails/physique2.jpg",
                duration: "1h",
                pages: 14,
                size: "2.9 MB"
            }
        ]
    },
    "3AC": {
        "maths": [
            { 
                title: "Fonctions linéaires", 
                description: "Étude des fonctions linéaires et affines",
                file: "pdf/3AC/maths/fonctions.pdf",
                thumbnail: "img/thumbnails/maths4.jpg",
                duration: "1h10",
                pages: 20,
                size: "4.2 MB"
            }
        ],
        "physics": [
            { 
                title: "Optique géométrique", 
                description: "Lois de la réflexion et réfraction de la lumière",
                file: "pdf/3AC/physique/optique.pdf",
                thumbnail: "img/thumbnails/physique3.jpg",
                duration: "1h15",
                pages: 16,
                size: "3.7 MB"
            }
        ]
    }
};

// Variables d'état
let currentLevel = null;
let currentSubject = null;
const pdfModal = document.getElementById('pdfModal');
const pdfViewer = document.getElementById('pdfViewer');
const pdfModalTitle = document.getElementById('pdfModalTitle');

// Initialisation des formes géométriques de fond
function initBackgroundShapes() {
    const container = document.getElementById('backgroundShapes');
    const shapes = ['circle', 'triangle'];
    const types = ['math-shape', 'physics-shape'];
    
    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        const colorType = types[Math.floor(Math.random() * types.length)];
        
        shape.className = `shape ${shapeType} ${colorType}`;
        
        // Position et taille aléatoires
        const size = Math.random() * 50 + 20;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        if (shapeType === 'circle') {
            shape.style.width = `${size}px`;
            shape.style.height = `${size}px`;
        } else if (shapeType === 'triangle') {
            shape.style.borderLeftWidth = `${size/2}px`;
            shape.style.borderRightWidth = `${size/2}px`;
            shape.style.borderBottomWidth = `${size}px`;
        }
        
        shape.style.left = `${left}%`;
        shape.style.top = `${top}%`;
        
        // Animation fluide
        let x = left;
        let y = top;
        let dx = (Math.random() - 0.5) * 0.05;
        let dy = (Math.random() - 0.5) * 0.05;
        
        setInterval(() => {
            x += dx;
            y += dy;
            
            // Rebond sur les bords
            if (x > 95 || x < -5) dx *= -1;
            if (y > 95 || y < -5) dy *= -1;
            
            shape.style.left = `${x}%`;
            shape.style.top = `${y}%`;
        }, 100);
        
        container.appendChild(shape);
    }
}

// Gestion de la navigation
function setupNavigation() {
    // Sélection de niveau
    document.querySelectorAll('.level-card').forEach(card => {
        card.addEventListener('click', function() {
            currentLevel = this.getAttribute('data-level');
            document.getElementById('selectedLevelText').textContent = this.querySelector('.level-header').textContent;
            
            // Masquer la section des niveaux, afficher celle des matières
            document.getElementById('levelsSection').classList.remove('active');
            document.getElementById('subjectsSection').classList.add('active');
            
            // Mettre à jour la navigation
            document.querySelector('[data-tab="levels"]').classList.remove('active');
            document.querySelector('[data-tab="subjects"]').style.display = 'block';
            document.querySelector('[data-tab="subjects"]').classList.add('active');
            
            // Mettre à jour le breadcrumb
            updateBreadcrumb('Niveau: ' + this.querySelector('.level-header').textContent);
        });
    });
    
    // Sélection de matière
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', function() {
            currentSubject = this.getAttribute('data-subject');
            const subjectName = this.querySelector('.subject-header').textContent.trim();
            document.getElementById('selectedSubjectText').textContent = subjectName;
            document.getElementById('selectedLevelText2').textContent = document.getElementById('selectedLevelText').textContent;
            
            // Masquer la section des matières, afficher celle des cours
            document.getElementById('subjectsSection').classList.remove('active');
            document.getElementById('coursesSection').classList.add('active');
            
            // Mettre à jour la navigation
            document.querySelector('[data-tab="subjects"]').classList.remove('active');
            document.querySelector('[data-tab="courses"]').style.display = 'block';
            document.querySelector('[data-tab="courses"]').classList.add('active');
            
            // Charger les cours correspondants
            loadCourses(currentLevel, currentSubject);
            
            // Mettre à jour le breadcrumb
            updateBreadcrumb('Matière: ' + subjectName);
        });
    });
    
    // Navigation par onglets
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Masquer toutes les sections
            document.querySelectorAll('.levels-section, .subjects-section, .courses-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Désactiver tous les onglets
            document.querySelectorAll('.nav-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Activer l'onglet sélectionné
            this.classList.add('active');
            
            // Afficher la section correspondante
            if (tabName === 'levels') {
                document.getElementById('levelsSection').classList.add('active');
                updateBreadcrumb('Sélectionnez un niveau');
            } else if (tabName === 'subjects') {
                document.getElementById('subjectsSection').classList.add('active');
                updateBreadcrumb('Niveau: ' + document.getElementById('selectedLevelText').textContent);
            } else if (tabName === 'courses') {
                document.getElementById('coursesSection').classList.add('active');
                const subjectName = document.getElementById('selectedSubjectText').textContent;
                updateBreadcrumb('Matière: ' + subjectName);
            }
        });
    });
    
    // Navigation par breadcrumb
    document.querySelector('.breadcrumb-home').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Réinitialiser à l'accueil
        document.getElementById('levelsSection').classList.add('active');
        document.getElementById('subjectsSection').classList.remove('active');
        document.getElementById('coursesSection').classList.remove('active');
        
        document.querySelector('[data-tab="levels"]').classList.add('active');
        document.querySelector('[data-tab="subjects"]').classList.remove('active');
        document.querySelector('[data-tab="courses"]').classList.remove('active');
        document.querySelector('[data-tab="subjects"]').style.display = 'none';
        document.querySelector('[data-tab="courses"]').style.display = 'none';
        
        updateBreadcrumb('Sélectionnez un niveau');
    });
}

// Charger les cours PDF en fonction du niveau et de la matière
function loadCourses(level, subject) {
    const coursesList = document.querySelector('.courses-list');
    coursesList.innerHTML = '';
    
    const courses = coursesData[level][subject];
    
    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = `course-item ${subject}-course`;
        courseItem.innerHTML = `
            <div class="course-thumbnail">
                <img src="${course.thumbnail}" alt="${course.title}">
                <div class="pdf-icon"><i class="fas fa-file-pdf"></i></div>
            </div>
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span><i class="far fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-file-alt"></i> ${course.pages} pages</span>
                    <span><i class="fas fa-database"></i> ${course.size}</span>
                </div>
                <div class="course-actions">
                    <a href="${course.file}" class="download-btn" download>
                        <i class="fas fa-download"></i> Télécharger
                    </a>
                    <button class="preview-btn" data-pdf="${course.file}" data-title="${course.title}">
                        <i class="fas fa-eye"></i> Prévisualiser
                    </button>
                </div>
            </div>
        `;
        
        coursesList.appendChild(courseItem);
    });
}

// Mettre à jour le breadcrumb
function updateBreadcrumb(current) {
    document.querySelector('.breadcrumb-current').textContent = current;
}

// Gestion de la prévisualisation PDF
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('preview-btn') || e.target.closest('.preview-btn')) {
        const btn = e.target.classList.contains('preview-btn') ? e.target : e.target.closest('.preview-btn');
        const pdfUrl = btn.getAttribute('data-pdf');
        const pdfTitle = btn.getAttribute('data-title');
        showPdfModal(pdfUrl, pdfTitle);
    }
    
    if (e.target.classList.contains('close-modal') || e.target === pdfModal) {
        hidePdfModal();
    }
});

function showPdfModal(pdfUrl, title) {
    pdfModalTitle.textContent = title;
    pdfViewer.src = pdfUrl + '#toolbar=0&navpanes=0';
    pdfModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function hidePdfModal() {
    pdfModal.style.display = 'none';
    pdfViewer.src = 'about:blank';
    document.body.style.overflow = '';
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initBackgroundShapes();
    setupNavigation();
});












// Suivi des téléchargements
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    gtag('event', 'download', {
      'file_name': this.href.split('/').pop(),
      'subject': currentSubject
    });
  });
});