const root = document.documentElement;

// Theme toggle (the initial theme is applied by the inline script in <head>)
const themeToggle = document.getElementById('theme-toggle');

function syncThemeToggle() {
    const isLight = root.dataset.theme === 'light';
    themeToggle.innerHTML = `<i class="fa-solid ${isLight ? 'fa-sun' : 'fa-moon'}" aria-hidden="true"></i>`;
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

themeToggle.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = theme;
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // Storage unavailable (e.g. private mode) – the theme still applies for this visit
    }
    syncThemeToggle();
});

syncThemeToggle();

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

function setMenuOpen(open) {
    navLinks.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuToggle.innerHTML = `<i class="fa-solid ${open ? 'fa-xmark' : 'fa-bars'}" aria-hidden="true"></i>`;
}

menuToggle.addEventListener('click', () => setMenuOpen(!navLinks.classList.contains('open')));

navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenuOpen(false);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

// Highlight the nav link for the section currently in view
const sections = [...document.querySelectorAll('main section[id]')];
const sectionLinks = [...navLinks.querySelectorAll('a')];

function updateActiveLink() {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = sections[0];
    for (const section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) current = section;
    }
    if (atBottom) current = sections[sections.length - 1];

    sectionLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${current.id}`) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
