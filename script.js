function goTo(panel) {
    const track = document.getElementById('master-track');
    track.classList.add('wrapper-transition'); 
    track.classList.remove('show-main', 'show-illust', 'show-photog');
    
    if (panel === 'illust') {
        track.classList.add('show-illust');
    } else if (panel === 'photog') {
        track.classList.add('show-photog');
    } else {
        track.classList.remove('wrapper-transition'); 
        track.classList.add('show-main');
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') goTo('main');
});

document.addEventListener('DOMContentLoaded', () => {
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