// Sticky Navigation Menu
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

// Show/hide sticky navigation and scroll button based on scroll position
window.onscroll = function () {
  if (document.documentElement.scrollTop > 20) {
    nav.classList.add("sticky");
    scrollBtn.style.display = "block";
  } else {
    nav.classList.remove("sticky");
    scrollBtn.style.display = "none";
  }
};

var typed = new Typed('#element', {
  strings: ['AIML ENGINEERING STUDENT', 'DATA ANALYST', 'WEB DEVELOPER','TECH ENTHUSIAST', 'PROBLEM SOLVER', 'LIFELONG LEARNER', 'SELF-MOTIVATED', 'MULTITASKER'],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true
});

function downloadCV() {
    const link = document.createElement('a');
    link.href = 'KesavaSaiVeerendra.pdf';  // Make sure the file is in the same directory
    link.download = 'KesavaSaiVeerendra.pdf';
    link.click();
  };

// Side Navigation Menu
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

// Open side navigation
menuBtn.onclick = function () {
  navBar.classList.add("active");
  menuBtn.style.opacity = "0";
  menuBtn.style.pointerEvents = "none";
  body.style.overflow = "hidden";
  scrollBtn.style.pointerEvents = "none";
};

const hideNavMenu = () => {
  navBar.classList.remove("active");
  menuBtn.style.opacity = "1";
  menuBtn.style.pointerEvents = "auto";
  body.style.overflow = "auto";
  scrollBtn.style.pointerEvents = "auto";
};

// Close side navigation
cancelBtn.onclick = hideNavMenu;

// Close side navigation when a menu link is clicked
let navLinks = document.querySelectorAll(".menu li a");
navLinks.forEach((link) => {
  link.addEventListener("click", hideNavMenu);
});

// ---------------------- About image rotator ----------------------
document.addEventListener('DOMContentLoaded', function () {
  const aboutPhoto = document.getElementById('about-photo');
  if (aboutPhoto) {
    /*
      About rotator images array:
      - Add any image filenames (relative to the site root) into the array below.
      - Example: 'Images/me1.jpg', 'Images/me2.png', etc.
      - Keep the existing two images if you don't have more yet.
    */
    const images = [
      'Images/23MH1A4224 (1).png',
      'Images/MY DR IMG.png'
      // add more filenames here, e.g. 'Images/me3.png'
    ];

    let idx = 0;

    // rotate with fade: every 5 seconds
    setInterval(() => {
      aboutPhoto.classList.add('fading');
      setTimeout(() => {
        idx = (idx + 1) % images.length;
        aboutPhoto.src = images[idx];
        aboutPhoto.classList.remove('fading');
      }, 550);
    }, 5000);
  }

  // ---------------------- Projects carousel ----------------------
  const track = document.querySelector('.projects-carousel .carousel-track');
  const items = document.querySelectorAll('.projects-carousel .carousel-item');
  const prevBtn = document.querySelector('.projects-carousel .prev');
  const nextBtn = document.querySelector('.projects-carousel .next');
  const indicatorsContainer = document.querySelector('.projects-carousel .carousel-indicators');
  const carouselEl = document.querySelector('.projects-carousel');

  // Responsive carousel: compute visibleCount based on container width
  let visibleCount = 3; // default
  let slidePercent = 100 / visibleCount;
  let currentIndex = 0;
  const autoplayInterval = 4000; // ms
  let autoplayId = null;
  let pages = 1;
  const indicators = [];

  function computeVisibleCount() {
    const w = window.innerWidth;
    // tune breakpoints to match CSS breakpoints
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function buildIndicators() {
    if (!indicatorsContainer) return;
    indicatorsContainer.innerHTML = '';
    indicators.length = 0;
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to project ${i + 1}`);
      if (i === currentIndex) btn.classList.add('active');
      btn.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
        restartAutoplay();
      });
      indicatorsContainer.appendChild(btn);
      indicators.push(btn);
    }
  }

  function updateIndicators() {
    if (!indicators.length) return;
    indicators.forEach((b, i) => {
      b.classList.toggle('active', i === currentIndex);
    });
  }

  function recalcLayout() {
    visibleCount = computeVisibleCount();
    slidePercent = 100 / visibleCount;
    pages = Math.max(1, Math.max(0, items.length - visibleCount) + 1);
    // ensure currentIndex within bounds
    if (currentIndex >= pages) currentIndex = pages - 1;
    buildIndicators();
  }

  function updateCarousel() {
    if (!track) return;
    const x = -currentIndex * slidePercent;
    track.style.transform = `translateX(${x}%)`;
    updateIndicators();
  }

  function prevSlide() {
    if (!items.length) return;
    currentIndex = (currentIndex - 1 + pages) % pages;
    updateCarousel();
  }

  function nextSlide() {
    if (!items.length) return;
    currentIndex = (currentIndex + 1) % pages;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoplay(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); restartAutoplay(); }
    else if (e.key === 'ArrowRight') { nextSlide(); restartAutoplay(); }
  });

  // Autoplay controls
  function startAutoplay() {
    if (autoplayId || items.length <= visibleCount) return;
    autoplayId = setInterval(() => { nextSlide(); }, autoplayInterval);
  }

  function stopAutoplay() {
    if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
  }

  function restartAutoplay() { stopAutoplay(); startAutoplay(); }

  // pause autoplay while user hovers the carousel
  if (carouselEl) {
    carouselEl.addEventListener('mouseenter', stopAutoplay);
    carouselEl.addEventListener('mouseleave', startAutoplay);
  }

  // recalc on resize
  window.addEventListener('resize', () => {
    const prevVisible = visibleCount;
    recalcLayout();
    // if visibleCount changed, restart autoplay and update carousel position
    if (visibleCount !== prevVisible) {
      updateCarousel();
      restartAutoplay();
    }
  });

  // initialize
  recalcLayout();
  updateCarousel();
  startAutoplay();

  // ---------------------- Carousel touch / drag support ----------------------
  (function addDragSupport() {
    if (!carouselEl || !track) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let deltaX = 0;
    let containerWidth = carouselEl.clientWidth || window.innerWidth;
    const threshold = 50; // px to trigger slide change

    function onStart(clientX) {
      isDragging = true;
      startX = clientX;
      deltaX = 0;
      containerWidth = carouselEl.clientWidth || window.innerWidth;
      // temporarily disable transition for smooth follow
      track.style.transition = 'none';
      stopAutoplay();
    }

    function onMove(clientX) {
      if (!isDragging) return;
      currentX = clientX;
      deltaX = currentX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const base = -currentIndex * slidePercent;
      track.style.transform = `translateX(${base + deltaPercent}%)`;
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      // restore transition
      track.style.transition = '';
      // decide whether to change slides
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          // swiped left -> next
          nextSlide();
        } else {
          // swiped right -> prev
          prevSlide();
        }
      } else {
        // snap back
        updateCarousel();
      }
      restartAutoplay();
    }

    // Touch events
    carouselEl.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) onStart(e.touches[0].clientX);
    }, { passive: true });

    carouselEl.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length === 1) onMove(e.touches[0].clientX);
    }, { passive: true });

    carouselEl.addEventListener('touchend', (e) => { onEnd(); });

    // Mouse drag for desktop
    carouselEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onStart(e.clientX);
      // listen on document so moving outside still tracks
      const onMouseMove = (ev) => onMove(ev.clientX);
      const onMouseUp = () => {
        onEnd();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    // Resize should update containerWidth
    window.addEventListener('orientationchange', () => { containerWidth = carouselEl.clientWidth || window.innerWidth; });
    window.addEventListener('resize', () => { containerWidth = carouselEl.clientWidth || window.innerWidth; });
  })();

  // ---------------------- Work Experience (timeline) interactivity ----------------------
  const timelineItems = document.querySelectorAll('.experience.timeline .timeline-item');
  // Toggle a timeline item open/closed. Allow multiple open entries.
  function toggleTimelineItem(index) {
    const it = timelineItems[index];
    if (!it) return;
    const wasActive = it.classList.contains('active');
    const card = it.querySelector('.card');
    if (wasActive) {
      it.classList.remove('active');
      if (card) card.style.maxHeight = '0';
    } else {
      it.classList.add('active');
      if (card) card.style.maxHeight = card.scrollHeight + 'px';
    }
  }

  if (timelineItems && timelineItems.length) {
    timelineItems.forEach((it, i) => {
      it.addEventListener('click', () => toggleTimelineItem(i));
      it.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTimelineItem(i);
        }
      });
    });
    // open all items by default so content is visible without clicking
    timelineItems.forEach((it) => {
      it.classList.add('active');
      const card = it.querySelector('.card');
      if (card) card.style.maxHeight = card.scrollHeight + 'px';
    });
  }

    // ---------------------- Contact form: Clear button handler ----------------------
    const contactForm = document.getElementById('contact-form');
    const clearBtn = document.getElementById('clear-contact');
    if (clearBtn && contactForm) {
      clearBtn.addEventListener('click', () => {
        // reset all form fields to their initial values
        contactForm.reset();
        // focus the first input for convenience
        const first = contactForm.querySelector('input, textarea');
        if (first) first.focus();
      });
    }
});

