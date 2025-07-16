// Modern Portfolio JavaScript - Enhanced Features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all features
    initializeNavigation();
    initializeDarkMode();
    initializeAnimations();
    initializeSkillsAnimation();
    initializeContactForm();
    initializeBackToTop();
    initializeTypingEffect();
    initializeParallax();
    preloadImages();
    
    console.log('Portfolio initialized successfully');
}

// Enhanced Navigation with smooth scrolling and active state management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', throttle(() => {
        updateActiveNavLinkOnScroll();
    }, 100));
    
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    function updateActiveNavLinkOnScroll() {
        let current = '';
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
}

// Enhanced Dark Mode with system preference detection
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const toggleIcon = darkModeToggle.querySelector('.toggle-icon');
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize theme
    if (savedTheme) {
        if (savedTheme === 'dark-mode') {
            enableDarkMode();
        }
    } else if (systemPrefersDark) {
        enableDarkMode();
    }
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
    
    function enableDarkMode() {
        body.classList.add('dark-mode');
        toggleIcon.classList.remove('fa-moon');
        toggleIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark-mode');
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        toggleIcon.classList.remove('fa-sun');
        toggleIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light-mode');
    }
}

// Enhanced animations with Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
                
                if (entry.target.classList.contains('achievement-item')) {
                    animateAchievement(entry.target);
                }
                
                if (entry.target.classList.contains('passion-card')) {
                    animatePassionCard(entry.target);
                }
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.project-card, .passion-card, .achievement-item, .resume-section, .timeline-item, .contact-method'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    function animateProjectCard(card) {
        const delay = Math.random() * 300;
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, delay);
    }
    
    function animateAchievement(achievement) {
        const icon = achievement.querySelector('.achievement-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'pulse 1s ease-in-out';
            }, 200);
        }
    }
    
    function animatePassionCard(card) {
        const image = card.querySelector('.passion-image img');
        if (image) {
            setTimeout(() => {
                image.style.transform = 'scale(1.05)';
            }, 300);
        }
    }
}

// Enhanced skills animation with staggered timing
function initializeSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('#resume');
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
    
    function animateSkills() {
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const skillLevel = bar.getAttribute('data-skill');
                bar.style.width = skillLevel + '%';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1.1)';
                    setTimeout(() => {
                        bar.style.transform = 'scaleY(1)';
                    }, 200);
                }, 800);
            }, index * 150);
        });
    }
}

// Enhanced contact form with better validation and UX
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        subject: document.getElementById('subject'),
        message: document.getElementById('message')
    };
    
    const errorElements = {
        name: document.getElementById('name-error'),
        email: document.getElementById('email-error'),
        subject: document.getElementById('subject-error'),
        message: document.getElementById('message-error')
    };
    
    // Real-time validation
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => clearError(fieldName));
        }
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    function validateField(fieldName) {
        const field = formFields[fieldName];
        const errorElement = errorElements[fieldName];
        const value = field.value.trim();
        
        let isValid = true;
        let errorMessage = '';
        
        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Subject is required';
                    isValid = false;
                } else if (value.length < 5) {
                    errorMessage = 'Subject must be at least 5 characters';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }
        
        if (errorElement) {
            errorElement.textContent = errorMessage;
            field.classList.toggle('error', !isValid);
        }
        
        return isValid;
    }
    
    function clearError(fieldName) {
        const errorElement = errorElements[fieldName];
        const field = formFields[fieldName];
        
        if (errorElement && errorElement.textContent) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }
    
    function validateForm() {
        let isValid = true;
        
        Object.keys(formFields).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function submitForm() {
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form submission logic)
        setTimeout(() => {
            showSuccessMessage();
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    function showSuccessMessage() {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Thank you! Your message has been sent successfully. I'll get back to you soon.</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 5000);
    }
}

// Enhanced back to top button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }, 100));
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Typing effect for hero section
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titles = [
        'Full-Stack Developer & Tech Innovator',
        'Problem Solver & Code Craftsman',
        'Esports Champion & Team Leader',
        'Creative Thinker & Tech Enthusiast'
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            heroTitle.textContent = currentTitle.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            heroTitle.textContent = currentTitle.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before starting new title
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start typing effect after a delay
    setTimeout(typeEffect, 1000);
}

// Subtle parallax effect for hero section
function initializeParallax() {
    const heroSection = document.getElementById('hero');
    const floatingTech = document.querySelectorAll('.tech-icon');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for floating tech icons
        floatingTech.forEach((icon, index) => {
            const speed = 0.5 + (index * 0.1);
            icon.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    }, 16)); // ~60fps
}

// Resume download functionality
function downloadResume() {
    // Create a comprehensive resume content
    const resumeContent = generateResumeContent();
    
    // For now, show a professional message
    showResumeModal();
    
    // In a real implementation, you would:
    // 1. Generate a PDF using a library like jsPDF
    // 2. Or link to a pre-generated PDF file
    // 3. Or send the user to a resume builder service
}

function generateResumeContent() {
    return {
        personalInfo: {
            name: "Anthony J. Colon Dominguez",
            title: "Full-Stack Developer & Tech Innovator",
            email: "anthonyjomar441@gmail.com",
            linkedin: "https://www.linkedin.com/in/anthonyjomarq/",
            github: "https://github.com/anthonyjomarq"
        },
        summary: "Dynamic full-stack developer with a Computer Science degree and hands-on experience in modern web technologies. Proven track record in building scalable applications, with expertise spanning from machine learning models to responsive web interfaces.",
        experience: [
            {
                title: "Implementations Specialist I",
                company: "Dynamics Payments",
                location: "San Juan, PR",
                period: "Nov 2024 - Present",
                responsibilities: [
                    "Deploy and configure POS systems for merchant clients",
                    "Provide technical training and ongoing support to merchants",
                    "Troubleshoot complex technical issues and system integrations"
                ]
            },
            {
                title: "Esports Lab Assistant / IT Support",
                company: "University of St. Thomas",
                location: "Houston, TX",
                period: "Jan 2023 - Dec 2023",
                responsibilities: [
                    "Managed hardware/software troubleshooting for high-performance gaming systems",
                    "Analyzed usage data and performance metrics to optimize system efficiency",
                    "Provided technical support and maintained gaming laboratory infrastructure"
                ]
            }
        ],
        education: {
            degree: "Bachelor of Science in Computer Science",
            school: "University of St. Thomas",
            location: "Houston, TX",
            graduation: "May 2024",
            highlights: [
                "Esports Scholarship Recipient",
                "Team Captain & Tournament Winner",
                "Focus on Software Engineering & Data Science"
            ]
        },
        skills: {
            frontend: ["HTML/CSS", "JavaScript", "React.js"],
            backend: ["Node.js", "Python", "Express.js"],
            tools: ["SQL/PostgreSQL", "Git/GitHub", "Java"]
        },
        achievements: [
            "Featured in Houston Chronicle for esports achievements",
            "Multiple tournament victories including HUEFest 2023",
            "Elected team captain and scholarship recipient"
        ]
    };
}

function showResumeModal() {
    const modal = document.createElement('div');
    modal.className = 'resume-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-file-download"></i> Resume Download</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="resume-preview">
                    <div class="resume-info">
                        <h4>Anthony J. Colon Dominguez</h4>
                        <p>Full-Stack Developer & Tech Innovator</p>
                        <div class="contact-info">
                            <p><i class="fas fa-envelope"></i> anthonyjomar441@gmail.com</p>
                            <p><i class="fab fa-linkedin"></i> linkedin.com/in/anthonyjomarq</p>
                            <p><i class="fab fa-github"></i> github.com/anthonyjomarq</p>
                        </div>
                    </div>
                </div>
                <div class="download-options">
                    <p>Choose your preferred format:</p>
                    <div class="format-buttons">
                        <button class="btn btn-primary" onclick="simulateDownload('pdf')">
                            <i class="fas fa-file-pdf"></i> Download PDF
                        </button>
                        <button class="btn btn-outline" onclick="simulateDownload('docx')">
                            <i class="fas fa-file-word"></i> Download DOCX
                        </button>
                    </div>
                </div>
                <div class="modal-note">
                    <p><i class="fas fa-info-circle"></i> Resume will be generated with the most up-to-date information from this portfolio.</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function simulateDownload(format) {
    const notification = document.createElement('div');
    notification.className = 'notification info';
    notification.innerHTML = `
        <i class="fas fa-download"></i>
        <span>Resume download will be available soon! For now, please contact me directly for my latest resume.</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
    
    // Close modal
    document.querySelector('.resume-modal .modal-close').click();
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Enhanced image preloading with lazy loading
function preloadImages() {
    const images = [
        './assets/images/Anthony profile.jpeg',
        './assets/images/accidentmodel.jpg',
        './assets/images/swifttiger.png',
        './assets/images/route-optimizer.png',
        './assets/images/mediareview.png',
        './assets/images/gymanthony.jpg',
        './assets/images/Tiger.jpeg',
        './assets/images/winninganthony.jpg'
    ];
    
    const imageCache = [];
    
    images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
            console.log(`Image ${index + 1}/${images.length} loaded: ${src}`);
        };
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
        };
        img.src = src;
        imageCache.push(img);
    });
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.resume-modal');
        if (modal) {
            modal.querySelector('.modal-close').click();
        }
        
        // Remove focus from active element
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
    
    // Space or Enter on buttons
    if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('btn')) {
        e.preventDefault();
        e.target.click();
    }
});

// Add dynamic notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #1f2937;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 10000;
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification.success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
    }
    
    .notification.error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }
    
    .notification.info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        color: white;
    }
    
    .notification i {
        font-size: 1.25rem;
        flex-shrink: 0;
    }
    
    .resume-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 1rem;
    }
    
    .resume-modal.show {
        opacity: 1;
        visibility: visible;
    }
    
    .modal-content {
        background: var(--bg-primary);
        border-radius: 1rem;
        max-width: 500px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.9) translateY(20px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .resume-modal.show .modal-content {
        transform: scale(1) translateY(0);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .modal-header h3 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0;
        color: var(--text-primary);
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        transition: color 0.2s;
    }
    
    .modal-close:hover {
        color: var(--text-primary);
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .resume-preview {
        background: var(--bg-secondary);
        padding: 1.5rem;
        border-radius: 0.75rem;
        margin-bottom: 1.5rem;
    }
    
    .resume-info h4 {
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .resume-info p {
        margin-bottom: 1rem;
        color: var(--text-secondary);
    }
    
    .contact-info p {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }
    
    .contact-info i {
        color: var(--primary);
        width: 1rem;
    }
    
    .download-options p {
        margin-bottom: 1rem;
        color: var(--text-primary);
        font-weight: 500;
    }
    
    .format-buttons {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .modal-note {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid var(--primary);
    }
    
    .modal-note p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .modal-note i {
        color: var(--primary);
    }
    
    body.dark-mode .notification {
        background: var(--dark-bg-secondary);
        color: var(--dark-text-primary);
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
        
        .format-buttons {
            flex-direction: column;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}