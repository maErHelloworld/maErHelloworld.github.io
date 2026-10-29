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
  // Interface para definir a estrutura dos dados de cada evento
interface EventData {
  title: string;
  description: string;
  images: string[];
}

// Mapeamento de eventos
const eventsData: Record<string, EventData> = {
  gicof: {
    title: "GICOF 2026",
    description: "Cobertura fotográfica oficial e destaques do festival.",
    images: [
      "assets/eventos/gicof-1.jpg",
      "assets/eventos/gicof-2.jpg"
    ]
  },
  festadojapao: {
    title: "Festa do Japão 2025",
    description: "Registo da cultura japonesa, atuações em palco e cosplayers.",
    images: [
      "assets/eventos/japao-1.jpg",
      "assets/eventos/japao-2.jpg"
    ]
  },
  batizados: {
    title: "Batizados",
    description: "Fotografia documental da cerimónia e momentos de convívio.",
    images: [
      "assets/eventos/batizado-1.jpg"
    ]
  },
  despedida: {
    title: "Despedida de Solteiro",
    description: "Cobertura de celebrações privadas, momentos espontâneos e convívio.",
    images: [
      "assets/eventos/despedida-1.jpg"
    ]
  }
};

// Abrir Modal
function openEventGallery(eventId: string): void {
  const data = eventsData[eventId];
  if (!data) return;

  const titleEl = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-desc");
  const gridEl = document.getElementById("modal-images-grid");
  const modalEl = document.getElementById("gallery-modal");

  if (titleEl) titleEl.innerText = data.title;
  if (descEl) descEl.innerText = data.description;

  if (gridEl) {
    gridEl.innerHTML = "";
    data.images.forEach((imgUrl: string) => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = data.title;
      img.loading = "lazy";
      gridEl.appendChild(img);
    });
  }

  if (modalEl) {
    modalEl.classList.add("active");
  }
  document.body.style.overflow = "hidden";
}

// Fechar Modal
function closeGalleryModal(): void {
  const modalEl = document.getElementById("gallery-modal");
  if (modalEl) {
    modalEl.classList.remove("active");
  }
  document.body.style.overflow = "auto";
}

// Filtrar Categorias
function filterEvents(category: string, btnElement?: HTMLElement): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  
  if (btnElement) {
    btnElement.classList.add("active");
  }

  const cards = document.querySelectorAll<HTMLElement>(".event-card");
  cards.forEach(card => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Garantir que as funções ficam acessíveis no escopo global (window) se compilares como módulo
(window as any).openEventGallery = openEventGallery;
(window as any).closeGalleryModal = closeGalleryModal;
(window as any).filterEvents = filterEvents;

});
