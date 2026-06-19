/**
 * =============================================
 *  MENU BURGER 
 * =============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' ? false : true;
            menuToggle.setAttribute('aria-expanded', expanded);
            mainNav.classList.toggle('active');
            document.body.style.overflow = expanded ? 'hidden' : '';
        });

        // Fermer en cliquant sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Fermer en cliquant à l'extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar') && mainNav.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * =============================================
     *  NAVIGATION ACTIVE AU SCROLL
     * =============================================
     */
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    /**
     * =============================================
     *  BOUTON RETOUR EN HAUT
     * =============================================
     */
    const backBtn = document.querySelector('.back-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backBtn?.classList.add('visible');
        } else {
            backBtn?.classList.remove('visible');
        }
    });

    /**
     * =============================================
     *  FORMULAIRES (contact + newsletter)
     * =============================================
     */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validation basique
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            let valid = true;
            if (name.length < 2) {
                showError('name', 'Le nom doit contenir au moins 2 caractères');
                valid = false;
            } else clearError('name');

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Veuillez entrer un email valide');
                valid = false;
            } else clearError('email');

            if (subject.length < 5) {
                showError('subject', 'Le sujet doit contenir au moins 5 caractères');
                valid = false;
            } else clearError('subject');

            if (message.length < 10) {
                showError('message', 'Le message doit contenir au moins 10 caractères');
                valid = false;
            } else clearError('message');

            if (!valid) return;

            // Simulation d'envoi
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                contactForm.reset();
                showToast('Message envoyé avec succès !', 'success');
            }, 1500);
        });
    }

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            if (input.value.trim()) {
                showToast('Merci pour votre inscription !', 'info');
                input.value = '';
            }
        });
    }

    // Fonctions d'erreur
    function showError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + 'Error');
        if (errorEl) {
            errorEl.textContent = message;
            const input = document.getElementById(fieldId);
            if (input) input.style.borderColor = '#ff6b6b';
        }
    }

    function clearError(fieldId) {
        const errorEl = document.getElementById(fieldId + 'Error');
        if (errorEl) {
            errorEl.textContent = '';
            const input = document.getElementById(fieldId);
            if (input) input.style.borderColor = '';
        }
    }

    // Toast
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#00d4ff'
        };
        toast.textContent = message;
        toast.style.borderColor = colors[type] || colors.info;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
    }

    // Année dynamique
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Exposer pour debug
    window.showToast = showToast;
});