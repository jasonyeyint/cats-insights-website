document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Dropdown Handling
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');

        // Desktop: hover to show/hide
        dropdown.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768 && menu) {
                menu.style.display = 'block';
            }
        });
        dropdown.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768 && menu) {
                menu.style.display = 'none';
            }
        });

        // Mobile: click to toggle
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && menu) {
                e.preventDefault();
                const isOpen = menu.style.display === 'block';
                menu.style.display = isOpen ? 'none' : 'block';
                menu.style.position = 'static';
                menu.style.transform = 'none';
                menu.style.boxShadow = 'none';
                menu.style.borderRadius = '0';
                menu.style.paddingLeft = '15px';
                dropdown.classList.toggle('open');
            }
        });
    });

    // Scroll Fade-In Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});
