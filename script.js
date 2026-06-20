const startButton = document.getElementById('startButton');
const tributeAudio = document.getElementById('tributeAudio');
const slides = Array.from(document.querySelectorAll('[data-slide-index]'));
const slideIndicators = document.getElementById('slideIndicators');
const memoryCards = document.querySelectorAll('.memory-card');
const typewriterText = document.getElementById('typewriterText');
const whatsappButton = document.getElementById('whatsappButton');
const copyLinkButton = document.getElementById('copyLinkButton');
const copyStatus = document.getElementById('copyStatus');
const finalSection = document.getElementById('final');
const confettiContainer = document.getElementById('confettiContainer');

let slideIndex = 0;
let slideTimer = null;
const typewriterMessage = `Dear Dad,\n\nThank you for every sacrifice,\nevery lesson,\nevery smile.\n\nYou are my greatest inspiration.\n\nLove You Forever ❤️`;
let typewriterIndex = 0;

function updateSlideshow() {
  slides.forEach((slide, index) => {
    const active = index === slideIndex;
    slide.classList.toggle('opacity-100', active);
    slide.classList.toggle('opacity-0', !active);
    slide.style.zIndex = active ? '20' : '10';
    if (slideIndicators.children[index]) {
      slideIndicators.children[index].classList.toggle('bg-white', active);
      slideIndicators.children[index].classList.toggle('bg-white/30', !active);
    }
  });
}

function resetSlideTimer() {
  if (slideTimer) {
    clearInterval(slideTimer);
  }
  slideTimer = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    updateSlideshow();
  }, 3000);
}

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'h-3 w-3 rounded-full transition-colors duration-300 bg-white/30 focus:outline-none';
  dot.addEventListener('click', () => {
    slideIndex = index;
    updateSlideshow();
    resetSlideTimer();
  });
  slideIndicators.appendChild(dot);
});

updateSlideshow();
resetSlideTimer();

startButton.addEventListener('click', () => {
  document.getElementById('slideshow').scrollIntoView({ behavior: 'smooth' });
  tributeAudio.play().catch(() => {
    console.warn('Audio play blocked until user interacts.');
  });
});

const memoryObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.3 }
);

memoryCards.forEach(card => memoryObserver.observe(card));

const letterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typewriterText.dataset.started) {
        typewriterText.dataset.started = 'true';
        const interval = setInterval(() => {
          typewriterText.textContent += typewriterMessage[typewriterIndex] || '';
          typewriterIndex += 1;
          if (typewriterIndex >= typewriterMessage.length) {
            clearInterval(interval);
          }
        }, 55);
      }
    });
  },
  { threshold: 0.25 }
);

letterObserver.observe(document.getElementById('letter'));

function createConfettiPiece() {
  const piece = document.createElement('span');
  piece.className = 'confetti-piece';
  const size = Math.random() * 10 + 6;
  piece.style.width = `${size}px`;
  piece.style.height = `${size * 0.55}px`;
  piece.style.left = `${Math.random() * 100}%`;
  piece.style.top = `${-Math.random() * 20 - 5}%`;
  piece.style.background = ['#f87171', '#60a5fa', '#facc15', '#a78bfa', '#fda4af'][Math.floor(Math.random() * 5)];
  piece.style.animationDuration = `${Math.random() * 1.5 + 2.8}s`;
  piece.style.animationDelay = `${Math.random() * 0.5}s`;
  piece.style.transform = `rotate(${Math.random() * 360}deg)`;
  confettiContainer.appendChild(piece);
  setTimeout(() => piece.remove(), 5200);
}

const confettiObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !finalSection.dataset.confetti) {
        finalSection.dataset.confetti = 'true';
        for (let i = 0; i < 40; i += 1) {
          setTimeout(createConfettiPiece, i * 80);
        }
      }
    });
  },
  { threshold: 0.35 }
);

confettiObserver.observe(finalSection);

whatsappButton.addEventListener('click', () => {
  const message = encodeURIComponent("Happy Father's Day! Open this tribute page and celebrate every memory.");
  const url = `https://wa.me/?text=${message}%0A${encodeURIComponent(window.location.href)}`;
  window.open(url, '_blank');
});

copyLinkButton.addEventListener('click', async () => {
  const link = window.location.href;
  try {
    await navigator.clipboard.writeText(link);
    copyStatus.textContent = 'Link copied to clipboard. Share it with love.';
    copyStatus.style.opacity = '1';
    setTimeout(() => {
      copyStatus.style.opacity = '0';
    }, 3200);
  } catch (error) {
    copyStatus.textContent = 'Unable to copy link. Please copy it manually.';
    copyStatus.style.opacity = '1';
  }
});
