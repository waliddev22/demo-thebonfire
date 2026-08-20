const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

base: '/demo-thebonfire/'

document.addEventListener("DOMContentLoaded", () => {
    /* DOM ELEMENTS */
    const header = $("#site-header");
    const logo = $("#logo");

    const mobileMenu = $("#mobile-menu");
    const menuToggle = $("#mobile-menu-toggle");
    const bottomMenuToggle = $("#mobile-bottom-menu");

    let lastScrollY = window.scrollY;
    let ticking = false;

    /* MOBILE MENU POSITION */
    function updateMobileMenuPosition() {
        if (window.innerWidth >= 768 || !mobileMenu || !header) return;
        const headerBottom = header.getBoundingClientRect().bottom;
        mobileMenu.style.top = `${Math.max(headerBottom, 0)}px`;
    }

    /* MOBILE MENU TOGGLE */
    function openMobileMenu() {
        updateMobileMenuPosition();
        mobileMenu.classList.remove("hidden");
        menuToggle?.setAttribute("aria-expanded", "true");
        requestAnimationFrame(updateMobileMenuPosition);
    }

    function closeMobileMenu() {
        mobileMenu?.classList.add("hidden");
        menuToggle?.setAttribute("aria-expanded", "false");
    }

    function toggleMobileMenu() {
        if (mobileMenu.classList.contains("hidden")) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }

    menuToggle?.addEventListener("click", toggleMobileMenu);
    bottomMenuToggle?.addEventListener("click", toggleMobileMenu);

    $$(".mobile-nav-link").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* SCROLL HANDLER */
    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (window.innerWidth >= 768) {
            if (currentScrollY > 80) {
                logo?.classList.remove("md:w-60");
                logo?.classList.add("md:w-44");
            } else {
                logo?.classList.remove("md:w-44");
                logo?.classList.add("md:w-60");
            }
        }

        if (header) {
            header.classList.toggle("shadow-md", currentScrollY > 10);
            header.classList.toggle("is-scrolled", currentScrollY > 24);
        }

        if (window.innerWidth < 768 && !mobileMenu.classList.contains("hidden")) {
            updateMobileMenuPosition();
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            closeMobileMenu();
            if (mobileMenu) mobileMenu.style.top = "";
        } else if (!mobileMenu.classList.contains("hidden")) {
            updateMobileMenuPosition();
        }
    });

    handleScroll();
});

/* ANNOUNCEMENT BAR */
(function () {
    const bar = document.getElementById('announcement-bar');
    const closeBtn = document.getElementById('announcement-close');
    if (!bar || !closeBtn) return;

    closeBtn.addEventListener('click', () => {
        bar.style.maxHeight = bar.offsetHeight + 'px';
        bar.offsetHeight; // force reflow
        bar.style.maxHeight = '0px';
        bar.style.opacity = '0';
        bar.style.paddingTop = '0px';
        bar.style.paddingBottom = '0px';

        bar.addEventListener('transitionend', () => {
            bar.style.display = 'none';
        }, { once: true });
    });
})();

/* EVENT POPUP */
(function () {
    const overlay = document.getElementById('event-popup-overlay');
    const card = document.getElementById('event-popup-card');
    const closeBtn = document.getElementById('event-popup-close');
    const dismissBtn = document.getElementById('event-popup-dismiss');
    if (!overlay || !card) return;

    const openPopup = () => {
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        card.classList.remove('opacity-0', 'translate-y-3');
        document.body.style.overflow = 'hidden';
    };

    const closePopup = () => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        card.classList.add('opacity-0', 'translate-y-3');
        document.body.style.overflow = '';
    };

    window.addEventListener('load', () => setTimeout(openPopup, 500));

    closeBtn?.addEventListener('click', closePopup);
    dismissBtn?.addEventListener('click', closePopup);
    overlay?.addEventListener('click', e => {
        if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closePopup();
    });
})();

/* HERO VIDEO */
const playerWrap = $('#playerWrap');
const video = $('#video');
const thumbnail = $('#thumbnail');
const playPauseBtn = $('#playPauseBtn');
const playIcon = $('#playIcon');
const pauseIcon = $('#pauseIcon');

const updateVideoUI = () => {
    if (!video || !thumbnail) return;
    thumbnail.classList.toggle('opacity-0', !video.paused);

    if (playPauseBtn) {
        playIcon?.classList.toggle('hidden', !video.paused);
        pauseIcon?.classList.toggle('hidden', video.paused);
        playPauseBtn.classList.toggle('opacity-100', video.paused);
        playPauseBtn.classList.toggle('opacity-30', !video.paused);
        playPauseBtn.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
    }
};

const toggleVideo = () => {
    if (!video) return;
    video.paused ? video.play().catch(() => { }) : video.pause();
};

playerWrap?.addEventListener('click', toggleVideo);
playerWrap?.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleVideo();
    }
});

video?.addEventListener('play', updateVideoUI);
video?.addEventListener('pause', updateVideoUI);
video?.addEventListener('ended', updateVideoUI);

if (video) {
    video.muted = true;
    updateVideoUI();
}

/* REVIEWS SLIDER (Untouched functionality) */
const REVIEWS = [
    { name: 'Jordan M.', initials: 'JM', rating: 5, time: '2 weeks ago', text: "Found out after we sat down that they don't take tips and honestly it changed how the whole meal felt. Food was great too — the burger's massive." },
    { name: 'Priya S.', initials: 'PS', rating: 5, time: '1 month ago', text: 'Finally a spot that takes allergies seriously without making a big deal of it. Server walked me through every dish I asked about.' },
    { name: 'Cole D.', initials: 'CD', rating: 4, time: '1 month ago', text: 'Trivia night was a blast, place was packed and the staff clearly love working there. Will be back for Brooklyn 99 night.' },
    { name: 'Amara T.', initials: 'AT', rating: 5, time: '2 months ago', text: "Ordered a mocktail expecting an afterthought and it was genuinely one of the best drinks I've had all year." },
    { name: 'Liam F.', initials: 'LF', rating: 5, time: '3 months ago', text: 'The tip-free model had me curious enough to try it, the comfort food had me coming back the next week.' },
    { name: 'Nadia K.', initials: 'NK', rating: 4, time: '3 months ago', text: 'Cozy spot, friendly staff, and gluten-free options that actually taste like the real thing.' },
];

const starsSVG = rating => Array.from({ length: 5 }, (_, i) =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" ${i < Math.round(rating) ? '' : 'fill-opacity=".25"'}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1L12 2Z"/></svg>`
).join('');

const track = $('#reviews-track');
const prevBtn = $('#reviews-prev');
const nextBtn = $('#reviews-next');

if (track) {
    track.innerHTML = REVIEWS.map(r => `
    <article class="review-card shrink-0 w-[300px] sm:w-[380px] md:w-[420px] rounded-2xl p-6" style="background:var(--panel-a);border:1px solid rgba(36,29,22,.06);">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0 ember-gradient">${r.initials}</div>
        <div class="min-w-0"><p class="text-sm font-semibold truncate">${r.name}</p><p class="text-xs" style="color:var(--ink-soft);">${r.time}</p></div>
        <span class="ml-auto text-xs font-semibold" style="color:#5f6368;">Google</span>
      </div>
      <div class="flex gap-0.5 mb-3" style="color:var(--ember-2);">${starsSVG(r.rating)}</div>
      <p class="text-[14px] leading-relaxed" style="color:var(--ink-soft);">${r.text}</p>
    </article>`).join('');
}

const cardStep = () => {
    const card = $('.review-card', track);
    return card ? card.getBoundingClientRect().width + 20 : 340;
};

const updateReviewControls = () => {
    if (!track) return;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 2);
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll;
};

prevBtn?.addEventListener('click', () => {
    const step = cardStep();
    const target = Math.round(track.scrollLeft / step) * step - step;
    track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
});

nextBtn?.addEventListener('click', () => {
    const step = cardStep();
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.round(track.scrollLeft / step) * step + step;
    track.scrollTo({ left: Math.min(maxScroll, target), behavior: 'smooth' });
});

let dragging = false, dragged = false, startX = 0, startScroll = 0;
track?.addEventListener('pointerdown', e => {
    dragging = true; dragged = false; startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging'); track.setPointerCapture(e.pointerId);
});

track?.addEventListener('pointermove', e => {
    if (!dragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 4) dragged = true;
    track.scrollLeft = startScroll - delta;
});

const endDrag = () => {
    if (!dragging) return;
    dragging = false; track.classList.remove('is-dragging');
};

track?.addEventListener('pointerup', endDrag);
track?.addEventListener('pointercancel', endDrag);
track?.addEventListener('pointerleave', endDrag);
track?.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
track?.addEventListener('scroll', updateReviewControls, { passive: true });
window.addEventListener('resize', updateReviewControls);
updateReviewControls();

/* FAQ ACCORDION */
$$('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-summary');
    const wrap = item.querySelector('.faq-answer-wrap');

    summary?.addEventListener('click', e => {
        e.preventDefault();

        if (item.hasAttribute('open')) {
            wrap.style.height = wrap.scrollHeight + 'px';
            wrap.offsetHeight; // force reflow
            wrap.style.height = '0px';

            wrap.addEventListener('transitionend', () => {
                item.removeAttribute('open');
            }, { once: true });
        } else {
            item.setAttribute('open', '');
            const target = wrap.scrollHeight;
            wrap.style.height = '0px';
            wrap.offsetHeight; // force reflow
            wrap.style.height = target + 'px';

            wrap.addEventListener('transitionend', () => {
                wrap.style.height = 'auto';
            }, { once: true });
        }
    });
});

/* IN-PAGE SMOOTH SCROLL */
document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.pushState(null, '', id);
});

/* SCROLL REVEAL OBSERVER */
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* FOOTER YEAR */
const yearEl = $('#footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();