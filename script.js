// ==========================================================================
// Sergeniy Bond — Interactive Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Set Current Year in Footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Interactive Skill Tabs Filtering
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

    // Interactive Terminal Console
    const terminalInput = document.getElementById('terminalInput');
    const consoleContainer = document.getElementById('interactiveConsole');

    if (terminalInput && consoleContainer) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = terminalInput.value.trim().toLowerCase();
                if (!inputVal) return;

                // Echo Command
                appendConsoleLine(`sergeniy.bond$&nbsp;<span class="text-accent">${escapeHtml(terminalInput.value)}</span>`);
                terminalInput.value = '';

                // Handle Commands
                processCommand(inputVal);

                // Auto Scroll Bottom
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
                        - <span class="text-accent">skills</span> : Показать ключевой технический стек<br>
                        - <span class="text-accent">contacts</span> : Список вариантов связи<br>
                        - <span class="text-accent">domain</span> : Информацию о домене sergeniy.bond<br>
                        - <span class="text-accent">ping</span> : Проверить статус инфраструктуры<br>
                        - <span class="text-accent">clear</span> : Очистить экран консоли
                    </div>
                `);
                break;
            case 'skills':
                appendConsoleLine('<div class="text-accent">Stack: K8s, Docker, Terraform, Ansible, Go, Python, GitHub Actions, NGINX</div>');
                break;
            case 'contacts':
                appendConsoleLine('<div>Telegram: @sergeniy_bond | Email: contact@sergeniy.bond | Web: sergeniy.bond</div>');
                break;
            case 'domain':
                appendConsoleLine('<div class="text-success">Domain: sergeniy.bond (DNS: GitHub Pages | SSL: Let\'s Encrypt Active)</div>');
                break;
            case 'ping':
                appendConsoleLine('<div class="text-success">64 bytes from sergeniy.bond: icmp_seq=1 ttl=58 time=14.2 ms (0% packet loss)</div>');
                break;
            case 'clear':
                consoleContainer.innerHTML = '';
                break;
            default:
                appendConsoleLine(`<div style="color: #ff5f56;">Команда не найдена: '${escapeHtml(cmd)}'. Введите 'help' для справки.</div>`);
                break;
        }
    }
});
