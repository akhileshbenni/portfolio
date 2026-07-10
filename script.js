document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. LIGHT / DARK MODE TOGGLE (iOS 27 STYLE)
    // ==========================================
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================
    // 2. HERO TYPING ANIMATION
    // ==========================================
    const typingSpan = document.getElementById('typing-text');
    const roles = [
        "Full-Stack Developer.",
        "Security Enthusiast.",
        "Computer Science Graduate."
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typingSpan.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // Typing speed
        }

        // Handle text switches
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next role
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingSpan) {
        typeEffect();
    }

    // ==========================================
    // 3. STICKY GLASS HEADER ON SCROLL
    // ==========================================
    const mainHeader = document.getElementById('mainHeader');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. MOBILE HAMBURGER MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ==========================================
    // 5. CUSTOM FLOATING CURSOR TRAIL
    // ==========================================
    const customCursor = document.getElementById('customCursor');
    
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia('(hover: hover)').matches) {
        customCursor.style.opacity = '1';
        
        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for smoother cursor render
            requestAnimationFrame(() => {
                customCursor.style.left = `${e.clientX}px`;
                customCursor.style.top = `${e.clientY}px`;
            });
        });

        // Hover expansions
        const clickables = document.querySelectorAll('a, button, .project-card, .theme-toggle, .sticker-container');
        clickables.forEach(item => {
            item.addEventListener('mouseenter', () => customCursor.classList.add('active'));
            item.addEventListener('mouseleave', () => customCursor.classList.remove('active'));
        });
    }

    // ==========================================
    // 6. STICKER INTERACTIVE PARALLAX TILT
    // ==========================================
    const sticker = document.getElementById('stickerContainer');
    const wrapper = document.getElementById('profileCardWrapper');

    if (wrapper && sticker) {
        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            
            // Calculate coordinates relative to center of wrapper
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Calculate tilt degrees (subtle rotation and translation)
            const rotateX = -(y / rect.height) * 15;
            const rotateY = (x / rect.width) * 15;
            
            // Apply slight tilt to the profile card wrapper itself
            requestAnimationFrame(() => {
                wrapper.querySelector('.profile-card').style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                
                // Displace the floating sticker with a different ratio for parallax
                const stickerX = (x / rect.width) * 25 - 30; // base offset -30px
                const stickerY = (y / rect.height) * 25 - 20; // base offset -20px
                sticker.style.transform = `translate(${stickerX}px, ${stickerY}px) rotate(${rotateY - 10}deg)`;
            });
        });

        wrapper.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                // Reset card transform
                wrapper.querySelector('.profile-card').style.transform = 'rotateX(0deg) rotateY(0deg)';
                // Reset sticker to default floating style
                sticker.style.transform = 'translate(0px, 0px) rotate(-10deg)';
            });
        });
    }

    // ==========================================
    // 7. VANILLA JS CARD TILT EFFECT (PROJECT CARDS)
    // ==========================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse position relative to card boundaries
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Percentage distance from the center
            const xPct = (x - (rect.width / 2)) / (rect.width / 2);
            const yPct = (y - (rect.height / 2)) / (rect.height / 2);
            
            // Calculate tilt degrees
            const tiltX = -yPct * 8; // Max 8 degrees tilt
            const tiltY = xPct * 8;
            
            requestAnimationFrame(() => {
                card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
                
                // Add dynamically changing glare shadow glow based on position
                const shadowX = -xPct * 15;
                const shadowY = -yPct * 15;
                card.style.boxShadow = `${shadowX}px ${shadowY}px 30px rgba(99, 102, 241, 0.15), var(--glass-shadow)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
                card.style.boxShadow = 'var(--glass-shadow)';
            });
        });
    });

    // ==========================================
    // 8. SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it contains a progress bar, animate progress width
                const progressBars = entry.target.querySelectorAll('.progress');
                if (progressBars.length > 0) {
                    progressBars.forEach(bar => {
                        // Triggers transition defined in CSS
                        bar.style.width = bar.parentElement.dataset.width || bar.style.width;
                    });
                }
                
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% of the element is visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
