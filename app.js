/* =============================================
   app.js — Solar System Portfolio
   All JS: Starfield, Mouse Parallax,
   Scroll effects, Modal, Contact form
   ============================================= */

// ─── Project Data ───────────────────────────────────
const projects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    desc: "A full-stack e-commerce platform with cart management, Stripe payment integration, real-time inventory, and an admin dashboard. Built for scale with a CDN-cached frontend.",
    tags: ["Next.js", "Node.js", "MongoDB", "Stripe", "Redis"],
    icon: "🛒",
    color: "radial-gradient(circle at 35% 35%, #f87c4a, #c23b22 60%, #7a1c08 100%)",
    shadow: "rgba(248, 124, 74, 0.6)",
    liveUrl: "https://nextjs.org/showcase",
    ghUrl: "https://github.com/vercel/commerce"
  },
  {
    id: 2,
    name: "AI Chatbot",
    desc: "An intelligent conversational agent powered by OpenAI GPT-4, with memory, function calling, and a beautiful animated chat interface. Deployed via Docker + FastAPI backend.",
    tags: ["React", "OpenAI", "FastAPI", "Docker", "WebSocket"],
    icon: "🤖",
    color: "radial-gradient(circle at 35% 35%, #70c1ff, #2563eb 55%, #1e3a8a 100%)",
    shadow: "rgba(112, 193, 255, 0.6)",
    liveUrl: "https://chat.openai.com",
    ghUrl: "https://github.com/openai/openai-python"
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    desc: "Real-time analytics platform with interactive D3.js visualizations, multi-source data ingestion, role-based access control, and scheduled PDF report generation.",
    tags: ["D3.js", "PostgreSQL", "GraphQL", "Docker", "AWS"],
    icon: "📊",
    color: "radial-gradient(circle at 35% 35%, #c4b5fd, #7c3aed 55%, #4c1d95 100%)",
    shadow: "rgba(167, 139, 250, 0.6)",
    liveUrl: "https://grafana.com/demos",
    ghUrl: "https://github.com/tiangolo/fastapi"
  },
  {
    id: 4,
    name: "Social Media App",
    desc: "Cross-platform mobile app built with React Native featuring live feeds, stories, real-time chat, push notifications, and a highly optimised content discovery algorithm.",
    tags: ["React Native", "Firebase", "Redux", "Expo", "TypeScript"],
    icon: "💬",
    color: "radial-gradient(circle at 35% 35%, #6ee7b7, #059669 55%, #064e3b 100%)",
    shadow: "rgba(110, 231, 183, 0.6)",
    liveUrl: "https://expo.dev",
    ghUrl: "https://github.com/facebook/react-native"
  },
  {
    id: 5,
    name: "ML Pipeline",
    desc: "End-to-end machine learning pipeline for image classification with automated data preprocessing, model training orchestration via Kubernetes, and MLflow experiment tracking.",
    tags: ["Python", "TensorFlow", "Kubernetes", "MLflow", "GCP"],
    icon: "🧠",
    color: "radial-gradient(circle at 35% 35%, #fde68a, #f59e0b 50%, #92400e 100%)",
    shadow: "rgba(251, 191, 36, 0.6)",
    liveUrl: "https://www.tensorflow.org/tutorials",
    ghUrl: "https://github.com/tensorflow/tensorflow"
  }
];

// ─── Starfield Canvas ───────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');

  let stars = [];
  let shootingStars = [];
  let W, H, animFrame;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.floor((W * H) / 3200);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        a: Math.random(),
        da: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        // Colour: mostly white, some blue/gold tints
        hue: Math.random() < 0.15 ? Math.random() * 30 + 190 : Math.random() < 0.08 ? 45 : 0,
        sat: Math.random() < 0.23 ? 80 : 0,
      });
    }
  }

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * W * 0.8,
      y: Math.random() * H * 0.4,
      len: Math.random() * 120 + 80,
      speed: Math.random() * 6 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      alpha: 1,
      life: 0,
      maxLife: Math.random() * 40 + 30
    });
  }

  function drawStarfield() {
    ctx.clearRect(0, 0, W, H);

    // Gradient background
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
    bg.addColorStop(0, '#07053f');
    bg.addColorStop(0.5, '#03010a');
    bg.addColorStop(1, '#000008');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    for (const s of stars) {
      s.a += s.da;
      if (s.a > 1) { s.a = 1; s.da *= -1; }
      if (s.a < 0.1) { s.a = 0.1; s.da *= -1; }

      ctx.save();
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.sat > 0
        ? `hsl(${s.hue}, ${s.sat}%, 90%)`
        : '#fff';
      ctx.fill();

      // Glow for larger stars
      if (s.r > 1.1) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.sat > 0 ? `hsl(${s.hue}, ${s.sat}%, 90%)` : '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    }

    // Shooting stars
    shootingStars = shootingStars.filter(ss => {
      ss.life++;
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha = 1 - ss.life / ss.maxLife;
      if (ss.alpha <= 0) return false;

      const grad = ctx.createLinearGradient(
        ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      grad.addColorStop(0, `rgba(255,255,255,${ss.alpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len
      );
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      return true;
    });

    animFrame = requestAnimationFrame(drawStarfield);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStarfield();

  // Spawn shooting stars periodically
  setInterval(() => {
    if (Math.random() < 0.6) spawnShootingStar();
  }, 3500);
})();


// ─── Navbar Scroll ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ─── Solar System 3D Mouse Parallax ─────────────────
(function initParallax() {
  const scene = document.getElementById('solar-scene');
  if (!scene) return;

  let targetRX = -10, targetRY = 0;
  let currentRX = -10, currentRY = 0;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    // Small tilt: ±12 degrees
    targetRY = ((e.clientX - cx) / cx) * 12;
    targetRX = -10 + ((e.clientY - cy) / cy) * -6;
  });

  // Smooth lerp
  function lerp(a, b, t) { return a + (b - a) * t; }

  function updateParallax() {
    currentRX = lerp(currentRX, targetRX, 0.04);
    currentRY = lerp(currentRY, targetRY, 0.04);
    scene.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
    requestAnimationFrame(updateParallax);
  }
  updateParallax();
})();


// ─── Planet Click → Modal ────────────────────────────
const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalTags = document.getElementById('modal-tags');
const modalLiveLink = document.getElementById('modal-live-link');
const modalGhLink = document.getElementById('modal-gh-link');
const modalPlanetPreview = document.getElementById('modal-planet-preview');

function openModal(project) {
  modalTitle.textContent = project.name;
  modalDesc.textContent = project.desc;
  modalTags.innerHTML = project.tags.map(t => `<span>${t}</span>`).join('');
  modalLiveLink.href = project.liveUrl;
  modalGhLink.href = project.ghUrl;
  modalPlanetPreview.textContent = project.icon;
  modalPlanetPreview.style.background = project.color;
  modalPlanetPreview.style.boxShadow = `0 0 40px ${project.shadow}`;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Attach click handlers to planets (intercept to show modal first)
projects.forEach(p => {
  const el = document.getElementById(`planet-${p.id}`);
  if (!el) return;
  el.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent direct navigation
    openModal(p);
  });
});

// Also attach to legend items
const legendItems = document.querySelectorAll('.solar-legend li');
legendItems.forEach((li, idx) => {
  li.addEventListener('click', () => {
    const p = projects[idx];
    if (p) openModal(p);
  });
});

// Modal links actually navigate
modalLiveLink.addEventListener('click', () => { closeModal(); });
modalGhLink.addEventListener('click', () => { closeModal(); });


// ─── Sun click → About section ──────────────────────
const sun = document.getElementById('sun');
sun && sun.addEventListener('click', () => {
  document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
});


// ─── Contact Form ────────────────────────────────────
const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form && form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('contact-submit-btn');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate async send
  setTimeout(() => {
    formSuccess.classList.add('visible');
    form.reset();
    btn.textContent = 'Send Message ✦';
    btn.disabled = false;
    btn.style.opacity = '1';
    setTimeout(() => formSuccess.classList.remove('visible'), 5000);
  }, 1400);
});


// ─── Scroll Reveal ───────────────────────────────────
(function initReveal() {
  const revealTargets = [
    document.querySelector('.section-header'),
    document.querySelector('.solar-legend'),
    document.querySelector('.about-content'),
    document.querySelector('.contact-inner'),
  ].filter(Boolean);

  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => io.observe(el));
})();


// ─── Staggered planet entrance ───────────────────────
(function animatePlanetsIn() {
  const orbits = document.querySelectorAll('.planet-orbit');
  orbits.forEach((o, i) => {
    o.style.opacity = '0';
    o.style.transition = 'opacity 0.6s ease';
    setTimeout(() => {
      o.style.opacity = '1';
    }, 600 + i * 200);
  });
})();


// ─── Dynamic nebula gradient on scroll ───────────────
(function initNebula() {
  const body = document.body;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        // Shift the accent glow position subtly
        const hue = Math.round(260 + progress * 80);
        body.style.setProperty('--accent-purple', `hsl(${hue}, 70%, 60%)`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


// ─── Speed toggle on hover ───────────────────────────
// When user hovers over solar scene, slow orbits slightly
(function initHoverPause() {
  const scene = document.getElementById('solar-scene');
  if (!scene) return;

  scene.addEventListener('mouseenter', () => {
    document.querySelectorAll('.planet-orbit').forEach(o => {
      o.style.animationPlayState = 'paused';
    });
    document.querySelectorAll('.planet-container').forEach(o =>  {
      o.style.animationPlayState = 'paused';
    });
  });

  scene.addEventListener('mouseleave', () => {
    document.querySelectorAll('.planet-orbit').forEach(o => {
      o.style.animationPlayState = 'running';
    });
    document.querySelectorAll('.planet-container').forEach(o => {
      o.style.animationPlayState = 'running';
    });
  });
})();


// ─── Tooltip on planet hover (accessibility) ─────────
(function initTooltips() {
  projects.forEach(p => {
    const el = document.getElementById(`planet-${p.id}`);
    if (!el) return;
    el.setAttribute('title', p.name);
    el.setAttribute('aria-label', `${p.name}: ${p.tags.join(', ')}. Click to see details.`);
  });
})();

console.log('%c✦ Dev Universe Portfolio', 'font-size:18px;color:#f6c90e;font-weight:bold;');
console.log('%cBuilt with ❤️ and way too much CSS.', 'font-size:12px;color:#8b8bb0;');
