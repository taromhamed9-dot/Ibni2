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

  /* ── REGISTRATION MODAL ─────────────── */
  const regModal = document.getElementById('regModal');
  const closeBtn = document.getElementById('closeRegModal');
  const closeSuccess = document.getElementById('closeRegSuccess');
  const openBtns = [
    document.getElementById('openRegisterNav'),
    document.getElementById('openRegisterHero'),
    document.getElementById('openRegisterCTA')
  ];

  function openModal() {
    if (regModal) {
      regModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal() {
    if (regModal) {
      regModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openBtns.forEach(btn => { if (btn) btn.addEventListener('click', openModal); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (closeSuccess) closeSuccess.addEventListener('click', closeModal);
  if (regModal) {
    regModal.addEventListener('click', (e) => {
      if (e.target === regModal) closeModal();
    });
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
      const modal = document.querySelector('.reg-modal');
      if (modal) modal.scrollTop = 0;
    }

    function clearErrors() {
      wizard.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      wizard.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
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

    function isValidName(name) {
      const trimmed = name.trim();
      if (trimmed.length < 2) return false;
      if (/^\d+$/.test(trimmed)) return false;
      return true;
    }

    function isValidArabicOrLatinName(name) {
      const trimmed = name.trim();
      if (trimmed.length < 2) return false;
      if (/^\d+$/.test(trimmed)) return false;
      if (/[!@#$%^&*()_+=\[\]{};'"\\|,.<>?\/~`]/.test(trimmed)) return false;
      return true;
    }

    function isValidPhone(phone) {
      const cleaned = phone.replace(/\s/g, '');
      return /^0[457][0-9]{8}$/.test(cleaned);
    }

    function validateStep(num) {
      clearErrors();
      if (num === 2) {
        let valid = true;
        const nameInput = document.getElementById('childName');
        const nameError = document.getElementById('childNameError');
        const ageError = document.getElementById('ageError');

        if (!nameInput.value.trim()) {
          nameInput.classList.add('error');
          if (nameError) nameError.textContent = 'يرجى كتابة اسم الطفل';
          valid = false;
        } else if (!isValidArabicOrLatinName(nameInput.value)) {
          nameInput.classList.add('error');
          if (nameError) nameError.textContent = 'يرجى كتابة اسم صحيح (حرفين على الأقل، بدون رموز)';
          valid = false;
        }

        if (formData.age === null) {
          if (ageError) ageError.textContent = 'يرجى اختيار عمر الطفل';
          document.querySelectorAll('.age-btn').forEach(b => {
            b.style.borderColor = '#E74C3C';
            setTimeout(() => b.style.borderColor = '', 800);
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
        const nameError = document.getElementById('parentNameError');
        const phoneError = document.getElementById('phoneError');
        const wilayaError = document.getElementById('wilayaError');

        if (!pName.value.trim()) {
          pName.classList.add('error');
          if (nameError) nameError.textContent = 'يرجى كتابة اسم ولي الأمر';
          valid = false;
        } else if (!isValidName(pName.value)) {
          pName.classList.add('error');
          if (nameError) nameError.textContent = 'يرجى كتابة اسم صحيح (حرفين على الأقل)';
          valid = false;
        }

        if (!pPhone.value.trim()) {
          pPhone.classList.add('error');
          if (phoneError) phoneError.textContent = 'يرجى كتابة رقم الهاتف';
          valid = false;
        } else if (!isValidPhone(pPhone.value)) {
          pPhone.classList.add('error');
          if (phoneError) phoneError.textContent = 'يجب أن يكون 10 أرقام ويبدأ بـ 07 أو 05 أو 04';
          valid = false;
        }

        if (!pWilaya.value) {
          pWilaya.classList.add('error');
          if (wilayaError) wilayaError.textContent = 'يرجى اختيار الولاية';
          valid = false;
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

});
