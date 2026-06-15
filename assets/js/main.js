/* ============================================================
   WISDOM HIGH SCHOOL - Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  /* ── Dark Mode ── */
  const darkToggle = document.getElementById('darkToggle');
  const body = document.body;
  if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    if (darkToggle) darkToggle.textContent = '☀️';
  }
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      darkToggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  /* ── Sticky Header ── */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) scrollBtn.classList.toggle('show', window.scrollY > 300);
  });

  /* ── Mobile Menu ── */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = mobileBtn.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  /* ── Hero Slider ── */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function startSlider() {
    slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  if (slides.length > 0) {
    slides[0].classList.add('active');
    if (dots[0]) dots[0].classList.add('active');
    startSlider();
    dots.forEach((dot, i) => dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(i);
      startSlider();
    }));
    const prev = document.getElementById('heroPrev');
    const next = document.getElementById('heroNext');
    if (prev) prev.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide - 1); startSlider(); });
    if (next) next.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide + 1); startSlider(); });
  }

  /* ── Particles ── */
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 10 + 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;
      particlesContainer.appendChild(p);
    }
  }

  /* ── Counter Animation ── */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target')) || 0;
    const duration = 2000;
    const step = (target / duration) * 16;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, 16);
  }

  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;
  function checkCounters() {
    if (countersStarted) return;
    const statsEl = document.getElementById('stats');
    if (!statsEl) return;
    const rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      counters.forEach(c => animateCounter(c));
    }
  }
  window.addEventListener('scroll', checkCounters);
  checkCounters();

  /* ── AOS (Animate on Scroll) ── */
  function checkAOS() {
    document.querySelectorAll('[data-aos]').forEach(el => {
      const rect = el.getBoundingClientRect();
      const delay = el.getAttribute('data-aos-delay') || 0;
      if (rect.top < window.innerHeight - 80) {
        setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
      }
    });
  }
  window.addEventListener('scroll', checkAOS);
  window.addEventListener('resize', checkAOS);
  checkAOS();

  /* ── Chatbot ── */
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.querySelector('.chat-input');
  const chatSend = document.querySelector('.chat-send');
  const chatMessages = document.querySelector('.chat-messages');

  const botResponses = {
    'admission': 'Admissions for 2026-27 are open! Please visit our Admissions page or call +91 98765 43210.',
    'fee': 'Fee structure varies by class. Please contact our office or visit the Admissions page.',
    'transport': 'We provide transport facilities covering Brahmanakotkur, Kurnool, and surrounding areas.',
    'hello': 'Hello! Welcome to Wisdom High School. How can I help you today?',
    'hi': 'Hi there! Welcome to Wisdom High School. What can I assist you with?',
    'contact': 'You can reach us at +91 98765 43210 or email info@wisdomhighschool.in',
    'timing': 'School timings are 8:30 AM to 4:00 PM (Monday to Saturday)',
    'default': 'Thank you for your message! Please call +91 98765 43210 or visit our Contact page for more information.'
  };

  function addChatMsg(text, sender) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.classList.add('chat-msg', sender);
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open') && chatMessages.children.length === 0) {
        addChatMsg('👋 Hello! I\'m Wisdom Bot. How can I help you?', 'bot');
      }
    });
  }

  function sendChatMessage() {
    if (!chatInput || !chatInput.value.trim()) return;
    const msg = chatInput.value.trim();
    addChatMsg(msg, 'user');
    chatInput.value = '';
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let response = botResponses.default;
      for (const [key, val] of Object.entries(botResponses)) {
        if (lower.includes(key)) { response = val; break; }
      }
      addChatMsg(response, 'bot');
    }, 800);
  }

  if (chatSend) chatSend.addEventListener('click', sendChatMessage);
  if (chatInput) {
    chatInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  /* ── Scroll to Top ── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Gallery Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-cat') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* ── Testimonials Slider ── */
  const testimonialsWrap = document.querySelector('.testimonials-wrap');
  const track = document.querySelector('.testimonials-track');
  if (track) {
    let tSlide = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    const visibleCards = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;

    function updateTestimonials() {
      const cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 0;
      track.style.transform = `translateX(-${tSlide * cardWidth}px)`;
    }

    setInterval(() => {
      tSlide = (tSlide + 1) % Math.max(1, cards.length - visibleCards + 1);
      updateTestimonials();
    }, 4000);
  }

  /* ── FAQ ── */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').classList.remove('open');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  /* ── Curriculum Tabs ── */
  document.querySelectorAll('.curr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.curr-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.curr-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.getAttribute('data-tab'));
      if (target) target.classList.add('active');
    });
  });

  /* ── Form Submit ── */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const original = btn.textContent;
        btn.textContent = '✓ Sent Successfully!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }
    });
  });

  /* ── Active Nav Link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

});