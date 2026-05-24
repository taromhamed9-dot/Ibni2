/* ═══════════════════════════════════════
   IBNI — script.js
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── BACKGROUND PARTICLES ───────────── */
  const particleContainer = document.getElementById('bgParticles');
  if (particleContainer) {
    const colors = ['#3498DB', '#2ECC71', '#F39C12', '#8B5CF6', '#E74C3C', '#F97316'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.className = 'bg-particle';
      const size = 20 + Math.random() * 80;
      const color = colors[i % colors.length];
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color};
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation-delay: ${(Math.random() * 10).toFixed(1)}s;
        animation-duration: ${(10 + Math.random() * 15).toFixed(1)}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ── NAVBAR SCROLL ──────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* ── HAMBURGER MENU ─────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ── SCROLL REVEAL ──────────────────── */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const siblings = entry.target.parentElement.querySelectorAll('.reveal');
          const idx = Array.from(siblings).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('revealed'), idx * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  }

  /* ── REGISTRATION WIZARD (step-by-step) ── */
  const wizard = document.getElementById('regWizard');
  if (wizard) {
    let currentStep = 1;
    const totalSteps = 6;
    const cards = wizard.querySelectorAll('.step-card');
    const progressBar = document.getElementById('progressBar');
    const indicators = document.querySelectorAll('.step-ind');

    const formData = {
      childName: '',
      age: null,
      interests: [],
      superpowers: [],
      parentName: '',
      phone: '',
      wilaya: ''
    };

    function showStep(num) {
      currentStep = num;
      cards.forEach(c => c.classList.remove('active-step'));
      const target = wizard.querySelector(`[data-step="${num}"]`);
      if (target) {
        target.classList.add('active-step');
        if (num === 6) fireConfetti(target);
      }
      if (progressBar) progressBar.style.width = ((num / totalSteps) * 100) + '%';
      indicators.forEach(ind => {
        const s = parseInt(ind.dataset.s);
        ind.classList.remove('active', 'done');
        if (s === num) ind.classList.add('active');
        else if (s < num) ind.classList.add('done');
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function saveState() {
      const nameInput = document.getElementById('childName');
      if (nameInput) formData.childName = nameInput.value;
      const pName = document.getElementById('regParentName');
      const pPhone = document.getElementById('regPhone');
      const pWilaya = document.getElementById('regWilaya');
      if (pName) formData.parentName = pName.value;
      if (pPhone) formData.phone = pPhone.value;
      if (pWilaya) formData.wilaya = pWilaya.value;
    }

    function restoreState() {
      const nameInput = document.getElementById('childName');
      if (nameInput && formData.childName) nameInput.value = formData.childName;
      document.querySelectorAll('.age-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.age) === formData.age);
      });
      document.querySelectorAll('#interestsGrid .selection-card').forEach(card => {
        card.classList.toggle('selected', formData.interests.includes(card.dataset.value));
      });
      document.querySelectorAll('#superpowersGrid .selection-card').forEach(card => {
        card.classList.toggle('selected', formData.superpowers.includes(card.dataset.value));
      });
      const pName = document.getElementById('regParentName');
      const pPhone = document.getElementById('regPhone');
      const pWilaya = document.getElementById('regWilaya');
      if (pName && formData.parentName) pName.value = formData.parentName;
      if (pPhone && formData.phone) pPhone.value = formData.phone;
      if (pWilaya && formData.wilaya) pWilaya.value = formData.wilaya;
    }

    function validateStep(num) {
      if (num === 2) {
        const nameInput = document.getElementById('childName');
        let valid = true;
        if (!nameInput.value.trim()) {
          nameInput.classList.add('error');
          valid = false;
          setTimeout(() => nameInput.classList.remove('error'), 600);
        }
        if (formData.age === null) {
          document.querySelectorAll('.age-btn').forEach(b => {
            b.style.borderColor = '#E74C3C';
            setTimeout(() => b.style.borderColor = '', 600);
          });
          valid = false;
        }
        return valid;
      }
      if (num === 5) {
        let valid = true;
        const pName = document.getElementById('regParentName');
        const pPhone = document.getElementById('regPhone');
        const pWilaya = document.getElementById('regWilaya');
        [pName, pPhone, pWilaya].forEach(el => {
          if (!el.value.trim()) {
            el.classList.add('error');
            valid = false;
            setTimeout(() => el.classList.remove('error'), 600);
          }
        });
        if (pPhone.value && !/^0[5-7][0-9]{8}$/.test(pPhone.value)) {
          pPhone.classList.add('error');
          valid = false;
          setTimeout(() => pPhone.classList.remove('error'), 600);
        }
        return valid;
      }
      return true;
    }

    wizard.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('[data-next]');
      const prevBtn = e.target.closest('[data-prev]');
      if (nextBtn) {
        saveState();
        const cs = parseInt(nextBtn.closest('.step-card').dataset.step);
        if (!validateStep(cs)) return;
        showStep(parseInt(nextBtn.dataset.next));
        restoreState();
      }
      if (prevBtn) {
        saveState();
        showStep(parseInt(prevBtn.dataset.prev));
        restoreState();
      }
    });

    /* Age picker */
    const agePicker = document.getElementById('agePicker');
    if (agePicker) {
      agePicker.addEventListener('click', (e) => {
        const btn = e.target.closest('.age-btn');
        if (!btn) return;
        agePicker.querySelectorAll('.age-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        formData.age = parseInt(btn.dataset.age);
      });
    }

    /* Interest cards */
    const interestsGrid = document.getElementById('interestsGrid');
    if (interestsGrid) {
      interestsGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.selection-card');
        if (!card) return;
        card.classList.toggle('selected');
        const val = card.dataset.value;
        if (formData.interests.includes(val)) {
          formData.interests = formData.interests.filter(v => v !== val);
        } else {
          formData.interests.push(val);
        }
      });
    }

    /* Superpower cards */
    const superpowersGrid = document.getElementById('superpowersGrid');
    if (superpowersGrid) {
      superpowersGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.selection-card');
        if (!card) return;
        card.classList.toggle('selected');
        const val = card.dataset.value;
        if (formData.superpowers.includes(val)) {
          formData.superpowers = formData.superpowers.filter(v => v !== val);
        } else {
          formData.superpowers.push(val);
        }
      });
    }
  }

  /* ── CONFETTI ───────────────────────── */
  function fireConfetti(card) {
    const container = card.querySelector('#confettiContainer') || card.querySelector('.confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#F39C12', '#2ECC71', '#3498DB', '#E74C3C', '#8B5CF6', '#F97316', '#22C55E'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const color = colors[i % colors.length];
      const isCircle = i % 3 === 0;
      const size = isCircle ? 10 : 7;
      piece.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${isCircle ? size : size * 1.5}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        animation-delay: ${(Math.random() * 2.5).toFixed(2)}s;
        animation-duration: ${(2 + Math.random() * 2).toFixed(2)}s;
      `;
      container.appendChild(piece);
    }
  }

  /* ── CTA FORM (index page) ──────────── */
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('parentName');
      const phone = document.getElementById('parentPhone');
      let valid = true;
      if (!name.value.trim()) {
        name.classList.add('error');
        valid = false;
        setTimeout(() => name.classList.remove('error'), 600);
      }
      if (phone.value && !/^0[5-7][0-9]{8}$/.test(phone.value)) {
        phone.classList.add('error');
        valid = false;
        setTimeout(() => phone.classList.remove('error'), 600);
      }
      if (valid) {
        alert('تم التسجيل بنجاح! سنتواصل معك قريباً');
        ctaForm.reset();
      }
    });
  }

});
