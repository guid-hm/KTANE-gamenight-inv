// ============================================================
// EDIT ME BEFORE SENDING THE INVITE
// ============================================================
const GOOGLE_MEET_URL = "https://meet.google.com/jhd-jswu-ktx";
// ============================================================

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bombStage = document.getElementById('bomb-stage');
  const bombTrigger = document.getElementById('bomb-trigger');
  const explosionFlash = document.getElementById('explosion-flash');
  const shockwave = document.getElementById('shockwave');
  const particleField = document.getElementById('particle-field');
  const invitationHeadline = document.getElementById('invitation-headline');
  const skipLink = document.getElementById('skip-link');
  const rsvpBtn = document.getElementById('rsvp-btn');
  const meetLinkText = document.getElementById('meet-link-text');

  meetLinkText.textContent = GOOGLE_MEET_URL;

  let detonated = false;

  // ---- armed state (hover / focus) ----
  function arm() { bombTrigger.classList.add('armed'); }
  function disarm() { bombTrigger.classList.remove('armed'); }

  bombTrigger.addEventListener('mouseenter', arm);
  bombTrigger.addEventListener('mouseleave', disarm);
  bombTrigger.addEventListener('focus', arm);
  bombTrigger.addEventListener('blur', disarm);

  // ---- particle burst helper ----
  function spawnParticles(container, originX, originY, count, maxDist) {
    if (reduceMotion) return;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const angle = Math.random() * Math.PI * 2;
      const dist = maxDist * (0.4 + Math.random() * 0.6);
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;
      const size = 4 + Math.random() * 6;
      const hue = 20 + Math.random() * 40;
      const delay = Math.random() * 120;

      particle.style.setProperty('--tx', tx + 'px');
      particle.style.setProperty('--ty', ty + 'px');
      particle.style.setProperty('--size', size + 'px');
      particle.style.setProperty('--hue', hue);
      particle.style.setProperty('--delay', delay + 'ms');
      particle.style.left = originX + 'px';
      particle.style.top = originY + 'px';

      container.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }
  }

  // ---- main bomb detonation ----
  function detonate() {
    if (detonated) return;
    detonated = true;

    const rect = bombTrigger.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    document.documentElement.style.setProperty('--origin-x', originX + 'px');
    document.documentElement.style.setProperty('--origin-y', originY + 'px');

    bombTrigger.classList.add('exploding');

    const runEffects = () => {
      if (!reduceMotion) {
        explosionFlash.classList.add('flash-active');
        shockwave.classList.add('shockwave-active');
        spawnParticles(particleField, originX, originY, 28, 260);
        document.body.classList.add('shake');
        document.body.addEventListener('animationend', function onShakeEnd(e) {
          if (e.animationName === 'shake') {
            document.body.classList.remove('shake');
            document.body.removeEventListener('animationend', onShakeEnd);
          }
        });
      }
    };

    if (window.requestAnimationFrame) {
      requestAnimationFrame(runEffects);
    } else {
      runEffects();
    }

    setTimeout(revealInvitation, reduceMotion ? 80 : 700);
  }

  function revealInvitation() {
    bombStage.classList.add('dismiss');

    const finish = () => {
      bombStage.style.display = 'none';
      document.body.classList.remove('locked');
      invitationHeadline.focus();
    };

    if (reduceMotion) {
      finish();
    } else {
      bombStage.addEventListener('transitionend', finish, { once: true });
    }
  }

  bombTrigger.addEventListener('click', detonate);

  skipLink.addEventListener('click', function (e) {
    e.preventDefault();
    detonate();
  });

  // ---- RSVP mini explosion ----
  function triggerMiniExplosion(button) {
    const rect = button.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    button.classList.add('detonate-pulse');
    spawnParticles(particleField, originX, originY, 12, 90);

    button.addEventListener('animationend', function onEnd() {
      button.classList.remove('detonate-pulse');
      button.removeEventListener('animationend', onEnd);
    }, { once: true });
  }

  rsvpBtn.addEventListener('click', function () {
    triggerMiniExplosion(rsvpBtn);
    setTimeout(function () {
      window.open(GOOGLE_MEET_URL, '_blank', 'noopener');
    }, reduceMotion ? 0 : 350);
  });
})();
