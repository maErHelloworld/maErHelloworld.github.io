// Declaração global para evitar avisos de TypeScript com o ScrollReveal
declare const ScrollReveal: any;

interface EventInfo {
  title: string;
  description: string;
  prefix: string;
  maxPhotos: number;
}

const eventsInfo: Record<string, EventInfo> = {
  gicof: {
    title: "GICOF 2026",
    description: "Cobertura fotográfica oficial e destaques do festival.",
    prefix: "gicof",
    maxPhotos: 20
  },
  festadojapao: {
    title: "Festa do Japão 2025",
    description: "Registo da cultura japonesa, atuações em palco e cosplayers.",
    prefix: "festjp",
    maxPhotos: 20
  },
  batizados: {
    title: "Batizados",
    description: "Fotografia documental da cerimónia e momentos de convívio.",
    prefix: "batizado",
    maxPhotos: 20
  },
  despedida: {
    title: "Despedida de Solteiro",
    description: "Cobertura de celebrações privadas e momentos espontâneos.",
    prefix: "desp",
    maxPhotos: 20
  }
};

// Tenta carregar a imagem em .jpg primeiro; se falhar, tenta em .png
function checkImageExistence(srcWithoutExt: string): Promise<string | null> {
  const extensions = ['.jpg', '.png', '.JPG', '.PNG'];

  return new Promise((resolve) => {
    let index = 0;

    const tryNext = () => {
      if (index >= extensions.length) {
        resolve(null); // Não encontrou nenhuma versão válida
        return;
      }

      const fullSrc = `${srcWithoutExt}${extensions[index]}`;
      const img = new Image();

      img.onload = () => resolve(fullSrc);
      img.onerror = () => {
        index++;
        tryNext();
      };
      img.src = fullSrc;
    };

    tryNext();
  });
}

// Procura as imagens dinamicamente suportando .jpg e .png
async function loadImagesByPrefix(prefix: string, maxCheck: number = 20): Promise<string[]> {
  const checks: Promise<string | null>[] = [];

  for (let i = 1; i <= maxCheck; i++) {
    const basePath = `assets/eventos/${prefix}${i}`;
    checks.push(checkImageExistence(basePath));
  }

  const results = await Promise.all(checks);
  const foundImages = results.filter((src): src is string => src !== null);

  // Ordena a lista de fotos numericamente (1 a 20)
  return foundImages.sort((a, b) => {
    const numA = parseInt(a.match(/(\d+)\.(jpg|png)$/i)?.[1] || "0");
    const numB = parseInt(b.match(/(\d+)\.(jpg|png)$/i)?.[1] || "0");
    return numA - numB;
  });
}

// Abrir Modal do Evento
async function openEventGallery(eventId: string): Promise<void> {
  const data = eventsInfo[eventId];
  if (!data) return;

  const titleEl = document.getElementById("modal-title");
  const descEl = document.getElementById("modal-desc");
  const gridEl = document.getElementById("modal-images-grid");
  const modalEl = document.getElementById("gallery-modal");

  if (titleEl) titleEl.innerText = data.title;
  if (descEl) descEl.innerText = data.description;

  if (gridEl) {
    gridEl.innerHTML = "<p style='color: #94a3b8;'>A carregar fotografias...</p>";
  }

  if (modalEl) modalEl.classList.add("active");
  document.body.style.overflow = "hidden";

  const images = await loadImagesByPrefix(data.prefix, data.maxPhotos);

  if (gridEl) {
    gridEl.innerHTML = "";
    if (images.length === 0) {
      gridEl.innerHTML = "<p style='color: #94a3b8;'>Sem fotografias disponíveis de momento.</p>";
      return;
    }

    images.forEach((imgUrl) => {
      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = data.title;
      img.loading = "lazy";
      gridEl.appendChild(img);
    });
  }
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

// Exportar para o escopo global do browser
(window as any).openEventGallery = openEventGallery;
(window as any).closeGalleryModal = closeGalleryModal;
(window as any).filterEvents = filterEvents;

// Inicializaciones da página
document.addEventListener('DOMContentLoaded', () => {

  // Menu Mobile
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Carrossel de Competências
  const track = document.getElementById('skills-track');
  const prevBtn = document.getElementById('skills-prev');
  const nextBtn = document.getElementById('skills-next');

  if (track && prevBtn && nextBtn) {
    const cardWidth = 320;

    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  // ScrollReveal
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

  // Modo Bilingue
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

  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      applyLanguage(currentLang);
    });
  }

});
