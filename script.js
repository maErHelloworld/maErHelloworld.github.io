var eventsInfo = {
  gicof: {
    title: "GICOF 2026",
    description: "Cobertura fotográfica oficial e destaques da Final.",
    prefix: "gicof",
    maxPhotos: 20
  },
  festadojapao: {
    title: "Festa do Japão 2025",
    description: "Registo da cultura japonesa, atuações em palco e cosplayers.",
    description: "Registo de Palco",
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

function checkImageExistence(srcWithoutExt) {
  var extensions = ['.jpg', '.png', '.JPG', '.PNG'];

  return new Promise(function(resolve) {
    var index = 0;

    function tryNext() {
      if (index >= extensions.length) {
        resolve(null);
        return;
      }

      var fullSrc = srcWithoutExt + extensions[index];
      var img = new Image();

      img.onload = function() { resolve(fullSrc); };
      img.onerror = function() {
        index++;
        tryNext();
      };
      img.src = fullSrc;
    }

    tryNext();
  });
}

async function loadImagesByPrefix(prefix, maxCheck) {
  if (!maxCheck) maxCheck = 20;
  var checks = [];

  for (var i = 1; i <= maxCheck; i++) {
    var basePath = 'assets/eventos/' + prefix + i;
    checks.push(checkImageExistence(basePath));
  }

  var results = await Promise.all(checks);
  var foundImages = results.filter(function(src) { return src !== null; });

  return foundImages.sort(function(a, b) {
    var matchA = a.match(/(\d+)\.(jpg|png)$/i);
    var matchB = b.match(/(\d+)\.(jpg|png)$/i);
    var numA = matchA ? parseInt(matchA[1]) : 0;
    var numB = matchB ? parseInt(matchB[1]) : 0;
    return numA - numB;
  });
}

// Abrir Modal do Evento e criar as fotos com clique de ampliação
async function openEventGallery(eventId) {
  var data = eventsInfo[eventId];
  if (!data) return;

  var titleEl = document.getElementById("modal-title");
  var descEl = document.getElementById("modal-desc");
  var gridEl = document.getElementById("modal-images-grid");
  var modalEl = document.getElementById("gallery-modal");

  if (titleEl) titleEl.innerText = data.title;
  if (descEl) descEl.innerText = data.description;

  if (gridEl) {
    gridEl.innerHTML = "<p style='color: #94a3b8;'>A carregar fotografias...</p>";
  }

  if (modalEl) modalEl.classList.add("active");
  document.body.style.overflow = "hidden";

  var images = await loadImagesByPrefix(data.prefix, data.maxPhotos);

  if (gridEl) {
    gridEl.innerHTML = "";
    if (images.length === 0) {
      gridEl.innerHTML = "<p style='color: #94a3b8;'>Sem fotografias disponíveis de momento.</p>";
      return;
    }

    images.forEach(function(imgUrl) {
      var img = document.createElement("img");
      img.src = imgUrl;
      img.alt = data.title;
      img.loading = "lazy";
      // Clique para ampliar foto
      img.onclick = function() { openLightbox(imgUrl); };
      gridEl.appendChild(img);
    });
  }
}

// Funções para a Lightbox / Ampliação
function closeGalleryModal() {
  var modalEl = document.getElementById("gallery-modal");
  if (modalEl) {
    modalEl.classList.remove("active");
  }
  document.body.style.overflow = "auto";
}

function openLightbox(imgSrc) {
  var lightbox = document.getElementById("lightbox-modal");
  var lightboxImg = document.getElementById("lightbox-img");
  if (lightbox && lightboxImg) {
    lightboxImg.src = imgSrc;
    lightbox.classList.add("active");
  }
}

function closeLightbox() {
  var lightbox = document.getElementById("lightbox-modal");
  if (lightbox) {
    lightbox.classList.remove("active");
  }
}

// Garantir associação de eventos ao carregar o DOM
document.addEventListener('DOMContentLoaded', function() {
  var closeBtn = document.getElementById('btn-close-gallery-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeGalleryModal();
    });
  }
});

// Exposição global de segurança
window.closeGalleryModal = closeGalleryModal;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

document.addEventListener('DOMContentLoaded', function() {
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  var track = document.getElementById('skills-track');
  var prevBtn = document.getElementById('skills-prev');
  var nextBtn = document.getElementById('skills-next');

  if (track && prevBtn && nextBtn) {
    var cardWidth = 320;
    nextBtn.addEventListener('click', function() {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', function() {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (typeof ScrollReveal !== 'undefined') {
    var sr = ScrollReveal({
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

  var langToggleBtn = document.getElementById('lang-toggle');
  var langLabel = document.getElementById('lang-label');
  var currentLang = localStorage.getItem('site_lang') || 'pt';

  function applyLanguage(lang) {
    var elementsToTranslate = document.querySelectorAll('[data-pt][data-en]');
    elementsToTranslate.forEach(function(el) {
      var translatedText = el.getAttribute('data-' + lang);
      if (translatedText) el.textContent = translatedText;
    });

    if (langLabel) langLabel.textContent = lang === 'pt' ? 'EN' : 'PT';
    localStorage.setItem('site_lang', lang);
  }

  applyLanguage(currentLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', function() {
      currentLang = currentLang === 'pt' ? 'en' : 'pt';
      applyLanguage(currentLang);
    });
  }
});
