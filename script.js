document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Custom Cursor Effect
       ========================================================================== */
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    // Only enable custom cursor if it's a device that supports hover/pointer (e.g., desktop)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Follower has a slight delay for smooth trailing effect
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Add hover class on interactive elements
        const interactables = document.querySelectorAll('a, button, select, input, textarea, [role="button"], .gallery-item-inner');
        interactables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                follower.classList.add('hovered');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('hovered');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    } else {
        // Remove cursor elements entirely on mobile
        if (cursor) cursor.remove();
        if (follower) follower.remove();
    }


    /* ==========================================================================
       2. Sticky Header & Active Nav Tracking
       ========================================================================== */
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer to highlight current menu link based on scroll section
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is in middle of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* ==========================================================================
       3. Mobile Navigation Burger Menu
       ========================================================================== */
    const burger = document.querySelector('.burger-menu');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (burger && overlay) {
        const toggleMenu = () => {
            burger.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        };

        burger.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Close menu when clicking link
                burger.classList.remove('open');
                overlay.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }


    /* ==========================================================================
       4. Gallery Filtering System
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length && galleryGrid) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Highlight active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Fade out grid first
                galleryGrid.classList.add('fade-out');

                setTimeout(() => {
                    galleryItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        
                        if (filterValue === 'all' || itemCategory === filterValue) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    // Fade grid back in
                    galleryGrid.classList.remove('fade-out');
                }, 300);
            });
        });
    }


    /* ==========================================================================
       5. Gallery Lightbox Modal
       ========================================================================== */
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxTitle = document.querySelector('.lightbox-title');
    const lightboxCategory = document.querySelector('.lightbox-category');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentGalleryIndex = 0;
    let visibleItemsArray = [];

    if (lightbox) {
        // Collect visible items in current active filter
        const updateVisibleItems = () => {
            visibleItemsArray = Array.from(galleryItems).filter(item => item.style.display !== 'none');
        };

        // Open Lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                updateVisibleItems();
                currentGalleryIndex = visibleItemsArray.indexOf(item);
                showLightboxItem(item);
                lightbox.classList.add('open');
                document.body.classList.add('no-scroll');
            });
        });

        // Render current item in Lightbox
        const showLightboxItem = (item) => {
            const imgElement = item.querySelector('.gallery-img');
            const titleElement = item.querySelector('h3');
            const categoryElement = item.querySelector('span');

            lightboxImg.src = imgElement.src;
            lightboxImg.alt = imgElement.alt;
            lightboxTitle.textContent = titleElement.textContent;
            lightboxCategory.textContent = categoryElement.textContent;
        };

        // Close Lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            // Close if clicking overlay itself, not the content/buttons
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Navigation (Prev/Next)
        const navigateLightbox = (direction) => {
            updateVisibleItems();
            if (visibleItemsArray.length <= 1) return;

            if (direction === 'next') {
                currentGalleryIndex = (currentGalleryIndex + 1) % visibleItemsArray.length;
            } else {
                currentGalleryIndex = (currentGalleryIndex - 1 + visibleItemsArray.length) % visibleItemsArray.length;
            }
            showLightboxItem(visibleItemsArray[currentGalleryIndex]);
        };

        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));

        // Keyboard Controls
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox('next');
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
        });
    }


    /* ==========================================================================
       6. Scroll Reveal Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Reveal slightly before entering viewport
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       7. Interactive Steps Scrolling Accent
       ========================================================================== */
    const processSteps = document.querySelectorAll('.process-step');
    const processObserverOptions = {
        root: null,
        rootMargin: '0px 0px -40% 0px',
        threshold: 0.2
    };

    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-step');
            }
        });
    }, processObserverOptions);

    processSteps.forEach(step => {
        processObserver.observe(step);
    });


    /* ==========================================================================
       8. Contact Form Simulation (with Success Toast)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm && formSuccess) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Získání elementů tlačítka
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            const submitIcon = submitBtn.querySelector('i');

            // Aktivace načítacího stavu
            submitBtn.style.pointerEvents = 'none';
            submitText.textContent = 'Odesílám...';
            submitIcon.className = 'fa-solid fa-spinner fa-spin';

            const formData = new FormData(contactForm);

            // Odeslání formuláře přes bezplatné AJAX rozhraní FormSubmit.co
            fetch('https://formsubmit.co/ajax/tattoo.by.janii@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success === 'true' || data.success === true) {
                    // Zobrazení potvrzení o úspěchu
                    formSuccess.classList.add('show');
                    
                    // Reset polí formuláře
                    contactForm.reset();
                } else {
                    alert('Došlo k chybě při odesílání formuláře. Zkuste to prosím znovu nebo mě kontaktujte přímo.');
                }
            })
            .catch(error => {
                console.error('Chyba při odesílání:', error);
                alert('Chyba spojení. Zkontrolujte prosím připojení k internetu.');
            })
            .finally(() => {
                // Po 7 sekundách schováme potvrzení a reaktivujeme tlačítko
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                    submitBtn.style.pointerEvents = 'auto';
                    submitText.textContent = 'Odeslat poptávku';
                    submitIcon.className = 'fa-solid fa-paper-plane';
                }, 7000);
            });
        });
    }


    /* ==========================================================================
       9. Studio Map Initialization (Leaflet Dark styled)
       ========================================================================== */
    const mapContainer = document.getElementById('studio-map');

    if (mapContainer) {
        // Approximate coordinates for Umělecká 12, Praha 7 (Latitude: 50.10188, Longitude: 14.42880)
        const coords = [50.10188, 14.42880];
        
        // Initialize Map
        const map = L.map('studio-map', {
            center: coords,
            zoom: 15,
            scrollWheelZoom: false // Disable zoom on scroll for UX
        });

        // Load CartoDB Dark Matter tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors &copy; <a href=\"https://carto.com/attributions\">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Customize marker icon
        const customMarkerIcon = L.divIcon({
            html: '<div class="map-custom-marker"><i class="fa-solid fa-location-dot"></i></div>',
            className: 'custom-leaflet-marker',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        // Add Marker
        const marker = L.marker(coords, { icon: customMarkerIcon }).addTo(map);
        
        // Add Tooltip/Popup
        marker.bindPopup(`
            <div class="map-popup-content" style="color: #121212; font-family: 'Plus Jakarta Sans', sans-serif;">
                <strong style="font-family: 'Cinzel', serif; font-size: 0.95rem; color: #0a0a0a;">Jana Tattoo & Art</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.8rem; color: #555;">Umělecká 452/12, Praha 7</p>
            </div>
        `).openPopup();

        // Style the custom marker via CSS
        const style = document.createElement('style');
        style.textContent = `
            .map-custom-marker {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;
                background-color: #0a0a0a;
                border: 2px solid #c5a880;
                border-radius: 50%;
                color: #c5a880;
                font-size: 1.1rem;
                box-shadow: 0 0 10px rgba(197, 168, 128, 0.4);
                transition: all 0.3s ease;
            }
            .map-custom-marker:hover {
                transform: scale(1.1);
                background-color: #c5a880;
                color: #0a0a0a;
                box-shadow: 0 0 15px rgba(197, 168, 128, 0.7);
            }
            .leaflet-popup-content-wrapper {
                background: #ffffff !important;
                border-radius: 0 !important;
                border: 1px solid #c5a880;
            }
            .leaflet-popup-tip {
                background: #ffffff !important;
                border: 1px solid #c5a880;
            }
        `;
        document.head.appendChild(style);
    }
});
