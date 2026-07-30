// ==========================================================================
// serg — Interactive Script & Steam 3D Card Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Steam Trading Cards 3D Tilt Effect
    initSteam3DCards();

    // 2. Optimized Reels Lazy Video Player
    initOptimizedReels();

    // 3. Set Current Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

/* --- Steam 3D Card Tilt Engine --- */
function initSteam3DCards() {
    const cards = document.querySelectorAll('.steam-card');

    cards.forEach(card => {
        const glare = card.querySelector('.steam-card-glare');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse position inside card
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (-15 deg to +15 deg)
            const rotateX = ((y - centerY) / centerY) * -14;
            const rotateY = ((x - centerX) / centerX) * 14;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`;

            // Move holographic glare
            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(0, 242, 254, 0.25) 40%, transparent 80%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (glare) {
                glare.style.background = '';
            }
        });
    });
}

/* --- Optimized Reels Video Controller (Lazy loading + Memory Save for Mobile) --- */
function initOptimizedReels() {
    const reelCards = document.querySelectorAll('.reel-card');
    if (reelCards.length === 0) return;

    // IntersectionObserver with rootMargin to lazy load video src ~200px before coming into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const card = entry.target;
            const video = card.querySelector('.reel-video');
            const dataSrc = video.getAttribute('data-src');

            if (entry.isIntersecting) {
                // Attach src if not loaded yet
                if (dataSrc && !video.src) {
                    video.src = dataSrc;
                    video.load();
                }
                
                // Play video when visible
                video.play().catch(err => {
                    // Touch requirement on mobile
                    console.log('Autoplay muted requirement:', err);
                });
            } else {
                // Pause video when out of viewport to free mobile GPU/CPU
                if (video.src) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '150px 0px 150px 0px'
    });

    reelCards.forEach(card => {
        observer.observe(card);

        const video = card.querySelector('.reel-video');
        const muteBtn = card.querySelector('.btn-mute');
        const likeBtn = card.querySelector('.btn-like');

        if (video) {
            // Tap to play/pause
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }

        if (muteBtn && video) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted
                    ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
                    : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
            });
        }

        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                likeBtn.classList.toggle('liked');
            });
        }
    });
}
