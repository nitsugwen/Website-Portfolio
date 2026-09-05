/* ==========================================================================
   STATE MANAGEMENT & VARIABLES
   ========================================================================== */
let currentGalleryImages = [];
let currentImageIndex = 0;


/* ==========================================================================
   PANEL NAVIGATION SYSTEM
   ========================================================================== */
function goTo(panel) {
    const columns = document.querySelectorAll('.column');
    
    // Deactivate all active columns
    columns.forEach(col => {
        col.classList.remove('is-active');
    });

    // Activate selected panel
    if (panel === 'illust') {
        document.querySelector('.column-illust').classList.add('is-active');
    } else if (panel === 'photog') {
        document.querySelector('.column-photog').classList.add('is-active');
    } else {
        document.querySelector('.main-scroll').classList.add('is-active');
    }
}


/* ==========================================================================
   LIGHTBOX SYSTEM & CONTROLS
   ========================================================================== */
function openLightbox(imgElement) {
    const lightbox = document.getElementById('image-lightbox');
    const activeColumn = imgElement.closest('.column');
    
    if (activeColumn) {
        currentGalleryImages = Array.from(activeColumn.querySelectorAll('.pin-image'));
        currentImageIndex = currentGalleryImages.indexOf(imgElement);
    }

    updateLightboxContent();
    lightbox.classList.add('is-open');
}


function updateLightboxContent() {
    if (currentGalleryImages.length === 0) return;

    const imgElement = currentGalleryImages[currentImageIndex];
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    lightboxImg.src = imgElement.src;

    // Grab title text from card container
    const card = imgElement.closest('.pin-card');
    if (card) {
        const title = card.querySelector('.pin-desc b')?.innerText || '';
        lightboxCaption.innerText = title;
    }
}


function navigateLightbox(direction, event) {
    if (event) event.stopPropagation();
    if (currentGalleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex + direction + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxContent();
}


function closeLightbox(event) {
    const lightbox = document.getElementById('image-lightbox');
    
    if (!event || event.target.id === 'image-lightbox' || event.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('is-open');
    }
}


/* ==========================================================================
   DOM CONTENT LOADED & INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    goTo('main');
    document.querySelectorAll('.pin-image').forEach(img => {
        img.addEventListener('click', () => openLightbox(img));
    });

    const scrollContainer = document.querySelector('.main-scroll');
    const target = document.querySelector('.selection-section');

    const observerOptions = {
        root: scrollContainer,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    if (target) observer.observe(target);
});

function scrollToTop() {
    const mainScroll = document.querySelector('.main-scroll');
    if (mainScroll) {
        mainScroll.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

/* ==========================================================================
   KEYBOARD NAVIGATION HANDLERS
   ========================================================================== */
document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('image-lightbox');
    const isLightboxOpen = lightbox && lightbox.classList.contains('is-open');

    if (isLightboxOpen) {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            navigateLightbox(1);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            navigateLightbox(-1);
        } else if (event.key === 'Escape') {
            closeLightbox();
        }
    } else if (event.key === 'Escape') {
        goTo('main');
    }
});