const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ELEMENTS
       ========================================================= */
    const header = document.getElementById("site-header");
    const topBar = document.getElementById("top-bar");
    const logo = document.getElementById("logo");

    const mobileMenu = document.getElementById("mobile-menu");
    const menuToggle = document.getElementById("mobile-menu-toggle");
    const bottomMenuToggle = document.getElementById("mobile-bottom-menu");

    const languageToggle = document.getElementById("language-toggle");
    const languageMenu = document.getElementById("language-menu");
    const languageArrow = document.getElementById("language-arrow");
    const currentLanguage = document.getElementById("current-language");
    const languageOptions = document.querySelectorAll(".language-option");

    let lastScrollY = window.scrollY;
    let ticking = false;


    /* =========================================================
       LANGUAGE DROPDOWN
       ========================================================= */
    function closeLanguageMenu() {
        languageMenu.classList.add("hidden");
        languageToggle.setAttribute("aria-expanded", "false");
        languageArrow.classList.remove("rotate-180");
    }


    languageToggle.addEventListener("click", (event) => {
        event.stopPropagation();

        const isOpen = !languageMenu.classList.contains("hidden");

        if (isOpen) {
            closeLanguageMenu();
        } else {
            languageMenu.classList.remove("hidden");
            languageToggle.setAttribute("aria-expanded", "true");
            languageArrow.classList.add("rotate-180");
        }
    });


    languageOptions.forEach(option => {
        option.addEventListener("click", () => {
            currentLanguage.textContent = option.dataset.language;
            closeLanguageMenu();

            /*
             * Add actual language switching here if needed.
             *
             * Example:
             * window.location.href = "/fr";
             */
        });
    });


    document.addEventListener("click", (event) => {
        if (!languageToggle.parentElement.contains(event.target)) {
            closeLanguageMenu();
        }
    });


    /* =========================================================
       MOBILE MENU POSITION
       ========================================================= */
    function updateMobileMenuPosition() {
        if (window.innerWidth >= 768) return;

        const headerBottom = header.getBoundingClientRect().bottom;

        mobileMenu.style.top = `${Math.max(headerBottom, 0)}px`;
    }


    /* =========================================================
       MOBILE MENU
       ========================================================= */
    function openMobileMenu() {
        updateMobileMenuPosition();

        mobileMenu.classList.remove("hidden");
        menuToggle.setAttribute("aria-expanded", "true");

        requestAnimationFrame(() => {
            updateMobileMenuPosition();
        });
    }


    function closeMobileMenu() {
        mobileMenu.classList.add("hidden");
        menuToggle.setAttribute("aria-expanded", "false");
    }


    function toggleMobileMenu() {
        if (mobileMenu.classList.contains("hidden")) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }


    menuToggle.addEventListener("click", toggleMobileMenu);
    bottomMenuToggle.addEventListener("click", toggleMobileMenu);


    /* Close mobile menu after navigation */
    document.querySelectorAll(".mobile-nav-link").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });


    /* =========================================================
       SCROLL HANDLER
       ========================================================= */
    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (window.innerWidth >= 768) {

            /* Show desktop top bar only at the top */
            if (currentScrollY <= 5) {

                topBar.classList.remove(
                    "max-h-0",
                    "py-0",
                    "opacity-0",
                    "border-transparent"
                );

                topBar.classList.add(
                    "max-h-20",
                    "py-2",
                    "opacity-100"
                );

            }

            /* Hide top bar when scrolling down */
            else if (
                currentScrollY > lastScrollY &&
                currentScrollY > 30
            ) {

                topBar.classList.remove(
                    "max-h-20",
                    "py-2",
                    "opacity-100"
                );

                topBar.classList.add(
                    "max-h-0",
                    "py-0",
                    "opacity-0",
                    "border-transparent"
                );

            }


            /* Desktop logo smoothly resizes */
            if (currentScrollY > 80) {

                logo.classList.remove("md:w-60");
                logo.classList.add("md:w-44");

            } else {

                logo.classList.remove("md:w-44");
                logo.classList.add("md:w-60");

            }

        }


        /* Header shadow */
        if (currentScrollY > 10) {
            header.classList.add("shadow-md");
        } else {
            header.classList.remove("shadow-md");
        }


        /* Keep open mobile menu below sticky header */
        if (
            window.innerWidth < 768 &&
            !mobileMenu.classList.contains("hidden")
        ) {
            updateMobileMenuPosition();
        }


        lastScrollY = currentScrollY;
        ticking = false;
    }


    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
            });

            ticking = true;
        }
    }, {
        passive: true
    });


    /* =========================================================
       RESIZE HANDLING
       ========================================================= */
    window.addEventListener("resize", () => {

        if (window.innerWidth >= 768) {

            closeMobileMenu();
            mobileMenu.style.top = "";

        } else if (!mobileMenu.classList.contains("hidden")) {

            updateMobileMenuPosition();

        }

    });


    /* =========================================================
       INITIAL STATE
       ========================================================= */
    handleScroll();

});

// Dark mode toggle: flips html.dark, persists choice, syncs button state.
// Dark mode toggle: flips html.dark, persists choice, syncs button state and logo.
(function () {
    const toggle = document.getElementById('dark-mode-toggle');
    const logo = document.getElementById('logo');
    if (!toggle) return;

    const root = document.documentElement;

    const syncTheme = () => {
        const isDark = root.classList.contains('dark');

        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');

        if (logo) {
            logo.src = isDark
                ? '/src/assets/logo/logo-dark.svg'
                : '/src/assets/logo/logo-light.svg';
        }
    };

    syncTheme();

    toggle.addEventListener('click', () => {
        root.classList.toggle('dark');

        try {
            localStorage.setItem(
                'theme',
                root.classList.contains('dark') ? 'dark' : 'light'
            );
        } catch (e) {
            // localStorage unavailable — theme just won't persist
        }

        syncTheme();
    });
})();

// Sticky nav: compact once the page has moved away from the top.
const siteNav = $('.site-nav');
const updateNav = () => siteNav?.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Announcement bar: dismissible, reappears on every page refresh.
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


// Event popup: shows automatically on every page load/refresh.
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


// Hero video: clicking anywhere in the video panel toggles playback.
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
        playIcon.classList.toggle('hidden', !video.paused);
        pauseIcon.classList.toggle('hidden', video.paused);
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

video.muted = true;
// video?.play().catch(() => { });      // autoplay
updateVideoUI();

// reviwes slider
// Free drag: no snap on release, native momentum only.
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
          <article class="review-card rounded-2xl p-6" style="background:var(--panel-a);border:1px solid rgba(36,29,22,.06);">
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
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
};

// Arrow buttons: the only place snapping happens.
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

// Free drag: no snap on release, native scroll position and momentum only.
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
    // Intentionally no snapping here — dragging leaves the track wherever released.
};
track?.addEventListener('pointerup', endDrag);
track?.addEventListener('pointercancel', endDrag);
track?.addEventListener('pointerleave', endDrag);
track?.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
track?.addEventListener('scroll', updateReviewControls, { passive: true });
window.addEventListener('resize', updateReviewControls);
updateReviewControls();

// faq
document.querySelectorAll('.faq-item').forEach(item => {
    const summary = item.querySelector('.faq-summary');
    const wrap = item.querySelector('.faq-answer-wrap');

    summary.addEventListener('click', e => {
        e.preventDefault();

        if (item.hasAttribute('open')) {
            // Closing: lock in the current pixel height first (in case it's
            // "auto"), force a reflow, then animate down to 0.
            wrap.style.height = wrap.scrollHeight + 'px';
            wrap.offsetHeight; // force reflow so the browser registers the starting height
            wrap.style.height = '0px';

            wrap.addEventListener('transitionend', () => {
                item.removeAttribute('open');
            }, { once: true });

        } else {
            // Opening: reveal content so scrollHeight is measurable, start
            // from 0, then animate to the measured height.
            item.setAttribute('open', '');
            const target = wrap.scrollHeight;
            wrap.style.height = '0px';
            wrap.offsetHeight; // force reflow
            wrap.style.height = target + 'px';

            wrap.addEventListener('transitionend', () => {
                // Let it respond to font-load/resize changes afterward.
                wrap.style.height = 'auto';
            }, { once: true });
        }
    });
});
// faq end

// Smooth in-page navigation, including the About / FAQ links.
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

// Scroll reveal.
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach(el => revealObserver.observe(el));

// footer year
const yearEl = $('#footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();