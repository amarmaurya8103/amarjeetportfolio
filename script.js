/* 
   Amarjeet Maurya - Portfolio Interactivity Engine (SK Theme)
*/

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initScrollNavbar();
  initMobileNav();
  initScrollProgressBar();
  initScrollAnimations();
  initCardTilt();
  initProjectsCarousel();
  initProjectFilters();
  initSkillFilters();
  initProjectModals();
  initCopyButtons();
  initContactForm();
  initTwinkleStars();
});

/* Scroll Navbar Morphing */
function initScrollNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
}

/* Mobile Hamburger Navigation Menu Engine */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('mobile-open');
    toggleBtn.classList.toggle('active', isOpen);
    document.body.classList.toggle('nav-menu-open', isOpen);
  });

  // Close when clicking any nav link or drawer download button
  navLinks.querySelectorAll('.nav-link, .btn-drawer-download').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggleBtn.classList.remove('active');
      document.body.classList.remove('nav-menu-open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
      toggleBtn.classList.remove('active');
      document.body.classList.remove('nav-menu-open');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      navLinks.classList.remove('mobile-open');
      toggleBtn.classList.remove('active');
      document.body.classList.remove('nav-menu-open');
    }
  });
}

/* Projects Expanding Flex Accordion Engine (All 3 visible, 1 takes 50%, 2 take 25%, auto-animates) */
let projectCarouselTimer = null;
let currentProjectIndex = 0;

function initProjectsCarousel() {
  const cards = document.querySelectorAll('.split-projects-stage .split-project-card');
  const dots = document.querySelectorAll('#project-carousel-dots .carousel-dot');
  const prevBtn = document.getElementById('project-prev-btn');
  const nextBtn = document.getElementById('project-next-btn');

  if (!cards.length) return;

  function showSlide(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active-card');
      } else {
        card.classList.remove('active-card');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentProjectIndex = index;
  }

  // Show first slide initially (Card 01 takes 50%, other two take 25% each)
  showSlide(0);

  function nextSlide() {
    let next = (currentProjectIndex + 1) % cards.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentProjectIndex - 1 + cards.length) % cards.length;
    showSlide(prev);
  }

  function startAutoCycle() {
    stopAutoCycle();
    projectCarouselTimer = setInterval(nextSlide, 4500); // Transitions every 4.5 seconds
  }

  function stopAutoCycle() {
    if (projectCarouselTimer) {
      clearInterval(projectCarouselTimer);
      projectCarouselTimer = null;
    }
  }

  // Direct Card Click: Clicking any card expands it to 50%
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-inspect-modal')) return;
      showSlide(i);
      startAutoCycle();
    });
  });

  // Next / Prev button listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoCycle();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoCycle();
    });
  }

  // Dot click listeners
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index, 10);
      showSlide(idx);
      startAutoCycle();
    });
  });

  // Pause on hover, resume on mouseleave
  const stage = document.querySelector('.split-projects-stage');
  if (stage) {
    stage.addEventListener('mouseenter', stopAutoCycle);
    stage.addEventListener('mouseleave', startAutoCycle);
  }

  // Start auto play
  startAutoCycle();
}

/* Project Filter Chips */
function initProjectFilters() {
  const chips = document.querySelectorAll('#projects .project-pill-btn, #projects .filter-chip');
  const cards = document.querySelectorAll('.split-project-card');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;

      if (filter === 'all') {
        // Reset to first slide & resume
        const dots = document.querySelectorAll('#project-carousel-dots .carousel-dot');
        cards.forEach((c, i) => c.classList.toggle('active-card', i === 0));
        dots.forEach((d, i) => d.classList.toggle('active', i === 0));
        currentProjectIndex = 0;
      } else {
        // Match specific category
        cards.forEach((card, i) => {
          if (card.dataset.category === filter) {
            const dots = document.querySelectorAll('#project-carousel-dots .carousel-dot');
            cards.forEach(c => c.classList.remove('active-card'));
            card.classList.add('active-card');
            dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
            currentProjectIndex = i;
          }
        });
      }
    });
  });
}

/* Skill Filter Chips */
function initSkillFilters() {
  const chips = document.querySelectorAll('.skills-filter-chips .filter-chip');
  if (!chips.length) return;
  const cards = document.querySelectorAll('.skill-card-showcase');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.skillFilter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.skillCat === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          card.style.display = 'none';
        }
      });
    });
  });
}

/* Project Modal Inspector */
const projectData = {
  gokart: {
    title: 'Design & Manufacturing of a Single-Seat Go-Kart',
    date: '15 Sep 2025 - 15 Oct 2025',
    mentor: 'Prof. Bhoopendra Singh',
    teamSize: 20,
    skills: ['Fabrication', 'Welding', 'Steering Mechanics', 'Disc Braking', 'Power Transmission', 'Assembly'],
    description: `
      Designed and fabricated a high-performance, cost-effective single-seat go-kart adhering to rigorous mechanical safety standards.
      <br><br>
      <strong>Key Engineering Accomplishments:</strong><br>
      • <strong>Chassis Frame:</strong> High-strength tubular steel spaceframe engineered for high torsional rigidity.<br>
      • <strong>Steering System:</strong> Ackermann steering geometry calculated for quick turning response.<br>
      • <strong>Braking & Assembly:</strong> Hydraulic disc brake assembly tested for reliable deceleration.<br>
      • <strong>Manufacturing:</strong> Executed TIG/MIG welding, tube bending jigs, and component static load verification.
    `
  },
  peltier: {
    title: 'Ecofriendly Refrigerator based on Thermoelectric Effect',
    date: '13 Oct 2024 - 17 Oct 2024',
    mentor: 'Chandra Kumar Pardhi',
    teamSize: 5,
    skills: ['Thermoelectric Peltier Effect', 'Heat Sink Design', 'Green Refrigeration', 'Experimental Prototyping'],
    description: `
      Engineered a solid-state green refrigeration system utilizing Peltier thermoelectric modules (TEC1-12706) without CFC refrigerants.
      <br><br>
      <strong>Key Engineering Accomplishments:</strong><br>
      • <strong>Thermal Transfer:</strong> Multi-stage copper cold block and extruded aluminum heatsink cooling fins.<br>
      • <strong>Eco Performance:</strong> Achieved steady-state internal chamber cooling to 4°C at ambient 28°C.<br>
      • <strong>Green Tech:</strong> Zero noise pollution, maintenance-free solid-state thermal management suitable for medical supply transport.
    `
  },
  hvac: {
    title: 'HVAC Airflow & Chiller Plant System Design (CRISP Training)',
    date: '20 Aug 2025 - 02 Sep 2025',
    mentor: 'CRISP Industrial Experts',
    teamSize: 'Industrial Training',
    skills: ['HVAC Installation', 'Duct Airflow Design', 'Chiller Maintenance', 'Heat Load Calculation'],
    description: `
      Comprehensive practical workshop at Centre for Research and Industrial Staff Performance (CRISP), Bhopal.
      <br><br>
      • Conducted building heat load calculations (BTU/hr & Tons of Refrigeration).<br>
      • Designed duct layout networks for optimal velocity pressure distribution.<br>
      • Practical training on centrifugal & screw chiller plants and psychrometric analysis.
    `
  },
  hydraulics: {
    title: 'Industrial Hydraulic Circuit & Valves Control System (CRISP)',
    date: '09 Sep 2024 - 21 Sep 2024',
    mentor: 'CRISP Fluid Power Division',
    teamSize: 'Industrial Training',
    skills: ['Hydraulic Circuit Design', 'Pumps & Valves', 'Safety Procedures', 'Control Systems'],
    description: `
      Advanced hands-on program in industrial hydraulic component design and maintenance.
      <br><br>
      • Formulated hydraulic circuit diagrams using directional control valves and pressure relief valves.<br>
      • Diagnosed hydraulic pump pressure troubleshooting up to 250 Bar and cylinder seal replacements.
    `
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalBox = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');

  if (!modalBackdrop) return;

  document.querySelectorAll('.btn-inspect-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.dataset.project;
      const data = projectData[key];
      if (!data) return;

      modalBox.innerHTML = `
        <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--text-primary); font-weight: 800;">${data.title}</h2>
        <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--primary-coral); font-weight: 600; margin-bottom: 1.25rem;">
          <span>📅 ${data.date}</span>
          <span>👤 Mentor: ${data.mentor}</span>
          <span>👥 Team: ${data.teamSize}</span>
        </div>
        
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem;">KEY SKILLS & TOOLS</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${data.skills.map(s => `<span class="tag-pill">${s}</span>`).join('')}
          </div>
        </div>

        <div style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7;">
          ${data.description}
        </div>
      `;

      modalBackdrop.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
  });
}

/* Copy Buttons */
function initCopyButtons() {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      });
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="lucide-check-circle" style="color: var(--accent-emerald);"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* Real Email Contact Form Handler (FormSubmit AJAX API) */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusBox = document.getElementById('contact-form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const phoneInput = document.getElementById('sender-phone');
    const subjectInput = document.getElementById('sender-subject');
    const msgInput = document.getElementById('sender-msg');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact Inquiry';
    const message = msgInput ? msgInput.value.trim() : '';

    if (!name || !email || !message) {
      if (statusBox) {
        statusBox.style.display = 'flex';
        statusBox.className = 'contact-feedback-banner feedback-error';
        statusBox.innerHTML = `<span>Please fill in your name, email, and message before sending.</span>`;
      }
      return;
    }

    // Set Loading State
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-anim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      <span>Routing Message to Inbox...</span>
    `;

    if (statusBox) {
      statusBox.style.display = 'flex';
      statusBox.className = 'contact-feedback-banner feedback-loading';
      statusBox.innerHTML = `
        <svg class="spin-anim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <span>Securely sending your message to <strong>amarmaurya8103@gmail.com</strong>...</span>
      `;
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/amarmaurya8103@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone || 'Not provided',
          subject: subject,
          message: message,
          _subject: `⚡ Portfolio Contact: ${name} (${subject})`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true || result.message)) {
        // Success state
        submitBtn.innerHTML = `
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Message Delivered!</span>
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10B981 100%)';

        if (statusBox) {
          statusBox.className = 'contact-feedback-banner feedback-success';
          statusBox.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
              <strong>Message Sent Successfully!</strong><br>
              Your email has reached Amarjeet's inbox (amarmaurya8103@gmail.com). You will receive a response shortly.
            </div>
          `;
        }

        showToast('✓ Message delivered to Amarjeet (amarmaurya8103@gmail.com)!');
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 6000);
      } else {
        throw new Error(result.message || 'Form submission failed');
      }
    } catch (err) {
      console.warn('FormSubmit AJAX fallback:', err);
      const mailtoUrl = `mailto:amarmaurya8103@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;

      if (statusBox) {
        statusBox.className = 'contact-feedback-banner feedback-error';
        statusBox.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            Message could not send automatically. 
            <a href="${mailtoUrl}" style="color: #DC2626; font-weight: 800; text-decoration: underline; margin-left: 4px;">
              Click here to send directly via your Mail app
            </a>
          </div>
        `;
      }
    }
  });
}

/* Interactive Twinkle Stars Shimmer Engine */
function initTwinkleStars() {
  const hero = document.getElementById('hero');
  const layer = document.getElementById('twinkle-stars-layer');
  if (!hero || !layer) return;

  // Gentle parallax drift on mousemove
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const stars = layer.querySelectorAll('.sparkle-star');
    stars.forEach((star, idx) => {
      const factor = (idx % 3 + 1) * 10;
      star.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    const stars = layer.querySelectorAll('.sparkle-star');
    stars.forEach((star) => {
      star.style.transform = '';
    });
  });

  // Dynamic ambient stardust spawn
  function spawnShootingGlow() {
    if (document.hidden) return;
    const glow = document.createElement('div');
    glow.className = 'stardust-dot';
    glow.style.top = `${12 + Math.random() * 70}%`;
    glow.style.left = `${6 + Math.random() * 88}%`;
    glow.style.width = `${3 + Math.random() * 3}px`;
    glow.style.height = glow.style.width;
    glow.style.animation = 'stardustBlink 2.2s ease-in-out forwards';
    layer.appendChild(glow);

    setTimeout(() => glow.remove(), 2300);
  }

  setInterval(spawnShootingGlow, 2600);
}

/* ==========================================================================
   Smooth Scroll Reading Progress Bar
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  function updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   Universal Scroll Reveal Engine & Active Nav Tracking
   ========================================================================== */
function initScrollAnimations() {
  // Elements with slide up reveal
  const fadeUpSelectors = [
    '.about-top-bar',
    '.about-hero-headline',
    '.about-intro-lead',
    '.stat-box',
    '.about-quote-box',
    '.about-feature-card',
    '.skill-card-showcase',
    '.soft-metric-card',
    '.projects-cockpit-header',
    '.split-projects-stage',
    '.exp-header-strip',
    '.exp-lead-showcase',
    '.exp-pillar-card',
    '.edu-section-header',
    '.edu-timeline-item',
    '.cert-tile',
    '.contact-header-strip',
    '.contact-channel-tile',
    '.portfolio-footer'
  ];

  fadeUpSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (!el.classList.contains('scroll-reveal-item') &&
          !el.classList.contains('scroll-reveal-left') &&
          !el.classList.contains('scroll-reveal-right') &&
          !el.classList.contains('scroll-reveal-scale')) {
        el.classList.add('scroll-reveal-item');
      }
    });
  });

  // Assign side reveals for dynamic balance
  document.querySelectorAll('.contact-hub-glass-card').forEach(el => {
    el.classList.add('scroll-reveal-left');
  });
  document.querySelectorAll('.contact-form-glass-card').forEach(el => {
    el.classList.add('scroll-reveal-right');
  });
  document.querySelectorAll('.exp-lead-showcase').forEach(el => {
    el.classList.add('scroll-reveal-scale');
  });

  // Stagger children inside grids and lists
  const staggeredGroups = [
    { container: '.stats-summary-grid', items: '.stat-box' },
    { container: '.about-features-bento', items: '.about-feature-card' },
    { container: '.exp-bento-grid', items: '.exp-pillar-card' },
    { container: '.certs-bento-grid', items: '.cert-tile' },
    { container: '.contact-channels-strip', items: '.contact-channel-tile' },
    { container: '.about-skills-stage', items: '.skill-card-showcase' }
  ];

  staggeredGroups.forEach(({ container, items }) => {
    document.querySelectorAll(container).forEach(parent => {
      const childItems = parent.querySelectorAll(items);
      childItems.forEach((item, idx) => {
        item.classList.add(`stagger-${(idx % 6) + 1}`);
      });
    });
  });

  // Intersection Observer for performance
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll(
    '.scroll-reveal-item, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
  );

  targets.forEach(target => {
    // If element is already visible at load (e.g. hero stats), reveal instantly
    const rect = target.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      target.classList.add('revealed');
    } else {
      revealObserver.observe(target);
    }
  });

  // Active Navbar link tracker
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();
}

/* ==========================================================================
   Smooth 3D Card Hover Perspective Physics
   ========================================================================== */
function initCardTilt() {
  const cards = document.querySelectorAll('.about-feature-card, .exp-pillar-card, .cert-tile');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

