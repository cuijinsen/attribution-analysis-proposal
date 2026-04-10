// ===== Mermaid Init =====
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2a2d3a',
    primaryTextColor: '#e0e0e6',
    primaryBorderColor: '#6c8cff',
    lineColor: '#6c8cff',
    secondaryColor: '#1a1d27',
    tertiaryColor: '#0f1117',
    fontFamily: '-apple-system, "Segoe UI", "PingFang SC", sans-serif',
    fontSize: '14px',
  },
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
  sequence: {
    useMaxWidth: true,
    actorMargin: 60,
    messageMargin: 40,
    mirrorActors: false,
  },
});

// ===== Scroll Reveal =====
function revealSections() {
  const sections = document.querySelectorAll('.section');
  const windowH = window.innerHeight;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top < windowH - 80) {
      sec.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealSections);
window.addEventListener('load', revealSections);

// ===== Sidebar Active Link =====
function updateActiveLink() {
  const links = document.querySelectorAll('#sidebar a');
  const scrollY = window.scrollY + 120;

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    if (sec.offsetTop <= scrollY) {
      current = sec.id;
    }
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// ===== Smooth scroll for sidebar links =====
document.querySelectorAll('#sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
