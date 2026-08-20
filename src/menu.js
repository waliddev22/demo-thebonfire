// menu
const thumbnailList = document.getElementById('thumbnail-list');
const thumbnails = Array.from(document.querySelectorAll('.thumbnail-item'));
const mainSlides = Array.from(document.querySelectorAll('.main-slide'));
const navBtns = document.querySelectorAll('.nav-btn');
const playPauseBtn = document.getElementById('btn-play-pause');

const TIME_PER_SLIDE = 5000;
let slideInterval, isPlaying = false, introActive = true;
let isDragging = false, hasDragged = false, startY, scrollTop;

const playIcon = `<svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
const pauseIcon = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
playPauseBtn.innerHTML = playIcon;

// Drag to scroll
thumbnailList.addEventListener('mousedown', (e) => {
    isDragging = true; hasDragged = false;
    startY = e.pageY - thumbnailList.offsetTop;
    scrollTop = thumbnailList.scrollTop;
});
thumbnailList.addEventListener('mouseleave', () => isDragging = false);
thumbnailList.addEventListener('mouseup', () => isDragging = false);
thumbnailList.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walk = ((e.pageY - thumbnailList.offsetTop) - startY) * 2;
    if (Math.abs(walk) > 5) hasDragged = true;
    thumbnailList.scrollTop = scrollTop - walk;
});

function getVisibleThumbnails() { return thumbnails.filter(t => !t.classList.contains('hidden')); }

// Timer automatically disables if 1 or fewer items exist in active tab
function resetTimer() {
    clearInterval(slideInterval);
    const visibleCount = getVisibleThumbnails().length;
    if (isPlaying && !introActive && visibleCount > 1) {
        slideInterval = setInterval(nextSlide, TIME_PER_SLIDE);
    }
}

function updateProgressAnimationState() {
    const visibleCount = getVisibleThumbnails().length;
    document.querySelectorAll('.progress-indicator').forEach(p => {
        p.classList.toggle('paused-animation', introActive || !isPlaying || visibleCount <= 1);
    });
}

function activateSlide(targetIndex) {
    const visibleCount = getVisibleThumbnails().length;

    thumbnails.forEach(thumb => {
        const isMatch = thumb.dataset.index === targetIndex;
        const progress = thumb.querySelector('.progress-indicator');

        thumb.classList.toggle('is-active', isMatch);
        thumb.classList.toggle('bg-white', !isMatch);
        thumb.classList.toggle('hover:bg-gray-50', !isMatch);
        thumb.querySelector('.thumb-img').classList.toggle('scale-110', isMatch);

        progress.classList.remove('progress-bar');
        if (isMatch) {
            // Only run progress bar animation if tab has more than 1 item
            if (visibleCount > 1) {
                void progress.offsetWidth;
                progress.classList.add('progress-bar');
            }
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    mainSlides.forEach(slide => {
        const isMatch = slide.dataset.index === targetIndex;
        slide.classList.toggle('hidden', !isMatch);
        slide.classList.toggle('flex', isMatch);
        if (isMatch) {
            slide.classList.remove('fade-in');
            void slide.offsetWidth;
            slide.classList.add('fade-in');
        }
    });

    updateProgressAnimationState();
    if (!introActive) resetTimer();
}

function navigateSlide(direction) {
    if (introActive) return;
    const visible = getVisibleThumbnails();
    if (visible.length <= 1) return; // Disable slide cycling for single item categories

    const currentIndex = visible.findIndex(t => t.classList.contains('is-active'));
    const targetIndex = (currentIndex + direction + visible.length) % visible.length;
    activateSlide(visible[targetIndex].dataset.index);
}

const nextSlide = () => navigateSlide(1);
const prevSlide = () => navigateSlide(-1);

function filterCategory(category) {
    navBtns.forEach(btn => {
        const isMatch = btn.dataset.filter === category;
        btn.className = `nav-btn w-full text-center px-4 py-4 uppercase tracking-widest text-sm font-bold transition-all duration-200 ${isMatch ? 'text-gray-900 bg-gray-100'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`;
    });

    let firstVisibleIndex = null;
    thumbnails.forEach(thumb => {
        const isMatch = category === 'all' || thumb.dataset.category === category;
        thumb.classList.toggle('hidden', !isMatch);
        thumb.classList.toggle('flex', isMatch);
        if (isMatch && firstVisibleIndex === null) firstVisibleIndex = thumb.dataset.index;
    });

    if (firstVisibleIndex !== null) activateSlide(firstVisibleIndex);
}

// Event Listeners
thumbnails.forEach(t => t.addEventListener('click', () => {
    if (hasDragged) return;

    if (introActive) {
        // If intro is playing, end the intro and start the slideshow
        endIntroSequence(true);
    } else {
        // If intro is already gone, clicking pauses the slideshow
        isPlaying = false;
        playPauseBtn.innerHTML = playIcon;
    }

    activateSlide(t.dataset.index);
}));

navBtns.forEach(btn => btn.addEventListener('click', () => {
    if (introActive) endIntroSequence(true);
    filterCategory(btn.dataset.filter);
}));

playPauseBtn.addEventListener('click', () => {
    if (introActive) {
        endIntroSequence();
        return;
    }
    if (getVisibleThumbnails().length <= 1) return;

    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying ? pauseIcon : playIcon;
    updateProgressAnimationState();
    resetTimer();
});

document.getElementById('btn-next').addEventListener('click', nextSlide);
document.getElementById('btn-prev').addEventListener('click', prevSlide);

// Initialization & Video
filterCategory('all');
const introOverlay = document.getElementById('intro-overlay');
const introVideo = document.getElementById('intro-video');

function endIntroSequence(skipActivation = false) {
    if (!introActive) return;
    introActive = false;
    introOverlay.style.opacity = '0';
    setTimeout(() => introOverlay.classList.add('hidden'), 500);
    isPlaying = true;
    playPauseBtn.innerHTML = pauseIcon;

    // Only auto-activate the first slide if not triggered by a specific click event
    if (skipActivation !== true) {
        const first = getVisibleThumbnails()[0];
        if (first) activateSlide(first.dataset.index);
    }
}

if (introVideo) {
    introVideo.addEventListener('timeupdate', () => { if (introVideo.currentTime >= 10) { introVideo.pause(); endIntroSequence(); } });
    introVideo.addEventListener('ended', () => endIntroSequence());
    introVideo.addEventListener('error', () => endIntroSequence());
    setTimeout(() => { if (introVideo.readyState === 0) endIntroSequence(); }, 3000);
} else {
    endIntroSequence();
}

// Active-link highlighting (replaces Blade's request()->is(...))
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.path === currentPath) {
        link.classList.add(
            'border', 'border-[#3F2A1D]', 'hover:border-[#a75624]',
            'relative', 'bg-transparent', 'overflow-hidden'
        );
        link.style.clipPath =
            'polygon(0 5px,5px 5px,5px 0,calc(100% - 5px) 0,calc(100% - 5px) 5px,100% 5px,100% calc(100% - 5px),calc(100% - 5px) calc(100% - 5px),calc(100% - 5px) 100%,5px 100%,5px calc(100% - 5px),0 calc(100% - 5px))';
    }
});