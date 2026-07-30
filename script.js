// ==========================================================================
// Sergeniy Bond — Interactive Script & FX Engine
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Canvas Background Animation
    initParticleCanvas();

    // 2. Set Current Year in Footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 3. Interactive Skill Tabs Filtering
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetCategory = btn.getAttribute('data-tab');

            skillCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (targetCategory === 'all' || category === targetCategory) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    });

    // 4. Reels Video Auto-Play on Scroll (Intersection Observer)
    initReelsFeed();

    // 5. Interactive Terminal Console
    initTerminal();
});

/* --- Canvas Particle FX --- */
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(width < 768 ? 35 : 70, 80);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(127, 0, 255, ',
            alpha: Math.random() * 0.5 + 0.2
        });
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${0.15 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw particles & update
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Mouse repulsion
            if (mouse.x !== null) {
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 100) {
                    p.x += (mdx / mdist) * 1.5;
                    p.y += (mdy / mdist) * 1.5;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
            ctx.fill();
        });

        requestAnimationFrame(render);
    }

    render();
}

/* --- Reels Feed Logic --- */
function initReelsFeed() {
    const videos = document.querySelectorAll('.reel-video');
    if (videos.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(err => {
                    console.log('Autoplay prevented until user gesture:', err);
                });
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.6 });

    videos.forEach(video => {
        observer.observe(video);

        // Click to toggle play / pause
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });
    });

    // Mute / Unmute & Like button toggles
    document.querySelectorAll('.reel-card').forEach(card => {
        const video = card.querySelector('.reel-video');
        const muteBtn = card.querySelector('.btn-mute');
        const likeBtn = card.querySelector('.btn-like');

        if (muteBtn && video) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted 
                    ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
                    : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
            });
        }

        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                likeBtn.classList.toggle('liked');
            });
        }
    });
}

/* --- Terminal Simulator --- */
function initTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const consoleContainer = document.getElementById('interactiveConsole');

    if (terminalInput && consoleContainer) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = terminalInput.value.trim().toLowerCase();
                if (!inputVal) return;

                appendConsoleLine(`sergeniy.bond$&nbsp;<span class="text-accent">${escapeHtml(terminalInput.value)}</span>`);
                terminalInput.value = '';

                processCommand(inputVal);
                consoleContainer.scrollTop = consoleContainer.scrollHeight;
            }
        });
    }

    function appendConsoleLine(htmlContent) {
        const line = document.createElement('div');
        line.className = 'console-line';
        line.innerHTML = htmlContent;
        consoleContainer.appendChild(line);
    }

    function escapeHtml(text) {
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function processCommand(cmd) {
        switch (cmd) {
            case 'help':
                appendConsoleLine(`
                    <div style="color: #94a3b8; margin-top: 4px;">
                        Доступные команды:<br>
                        - <span class="text-accent">reels</span> : Переход на страницу Top 10 Reels<br>
                        - <span class="text-accent">about</span> : Резюме и информация обо мне<br>
                        - <span class="text-accent">skills</span> : Ключевой технический стек<br>
                        - <span class="text-accent">cat</span> : Информация про кота 🐾<br>
                        - <span class="text-accent">clear</span> : Очистить консоль
                    </div>
                `);
                break;
            case 'reels':
                window.location.href = '/reels';
                break;
            case 'about':
                window.location.href = '/about';
                break;
            case 'skills':
                appendConsoleLine('<div class="text-accent">Stack: K8s, Docker, Airflow, Python, Java, Go, Terraform, Nginx, PostgreSQL, MinIO</div>');
                break;
            case 'cat':
                appendConsoleLine('<div class="text-success">это мой кот!! 🐱 (Смотри фото на главной странице)</div>');
                break;
            case 'clear':
                consoleContainer.innerHTML = '';
                break;
            default:
                appendConsoleLine(`<div style="color: #ff5f56;">Команда не найдена: '${escapeHtml(cmd)}'. Введите 'help'.</div>`);
                break;
        }
    }
}
