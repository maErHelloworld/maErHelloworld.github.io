// Declaração global para evitar avisos de TypeScript com o ScrollReveal
declare const ScrollReveal: any;

document.addEventListener('DOMContentLoaded', () => {

  // 1. Toggle do Menu Mobile
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // 2. Carrossel de Competências
  const track = document.getElementById('skills-track');
  const prevBtn = document.getElementById('skills-prev');
  const nextBtn = document.getElementById('skills-next');

  if (track && prevBtn && nextBtn) {
    const cardWidth = 320; // Deslocamento aproximado por cartão

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  // 3. Animações de ScrollReveal
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'bottom',
      distance: '30px',
      duration: 800,
      delay: 150,
      reset: false
    });

    sr.reveal('.hero-text, .section-title', { delay: 100 });
    sr.reveal('.hero-card, .profile-card-badge', { delay: 200, origin: 'right' });
    sr.reveal('.skill-card-box', { interval: 150 });
    sr.reveal('.portfolio-card, .pm-feature-card, .photo-feature-card', { interval: 200 });
    sr.reveal('.timeline-node', { interval: 150, origin: 'left' });
    sr.reveal('.cv-download-card', { origin: 'right' });
  }

  // 4. Lógica do Modo Bilingue (PT / EN)
  const langToggleBtn = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  
  let currentLang: string = localStorage.getItem('site_lang') || 'pt';

  function applyLanguage(lang: string): void {
    const elementsToTranslate = document.querySelectorAll('[data-pt][data-en]');
    
    elementsToTranslate.forEach((el) => {
      const translatedText = el.getAttribute(`data-${lang}`);
      if (translatedText) {
        el.textContent = translatedText;
      }
    });

    if (langLabel) {
      langLabel.textContent = lang === 'pt' ? 'EN' : 'PT';
    }

    localStorage.setItem('site_lang', lang);
  }

  // Aplicar idioma ao carregar a página
  applyLanguage(currentLang);

  // Alternar idioma ao clicar no botão
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      applyLanguage(currentLang);
    });
  }

});