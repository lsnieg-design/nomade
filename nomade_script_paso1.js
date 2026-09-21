AOS.init({ duration: 750, once: true, offset: 70 });

const body = document.body;
const navbar = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');
const menuIcon = mobileMenu ? mobileMenu.querySelector('span') : null;

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
}

if (mobileMenu && navList && menuIcon) {
    mobileMenu.addEventListener('click', () => {
        const active = navList.classList.toggle('active');

        menuIcon.textContent = active ? 'close' : 'menu';

        mobileMenu.setAttribute(
            'aria-expanded',
            active ? 'true' : 'false'
        );

        mobileMenu.setAttribute(
            'aria-label',
            active ? 'Cerrar menú' : 'Abrir menú'
        );

        body.classList.toggle('menu-open', active);
    });
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (!navList || !mobileMenu || !menuIcon) return;

        navList.classList.remove('active');
        menuIcon.textContent = 'menu';

        mobileMenu.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-label', 'Abrir menú');

        body.classList.remove('menu-open');
    });
});

function openModal(imgSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('imgFull');

    if (!modal || !modalImg) return;

    modalImg.src = imgSrc;
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');

    if (!modal) return;

    modal.classList.remove('active');
    body.style.overflow = '';
}

function openVideoModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoFrame');

    if (!modal || !frame) return;

    frame.src = videoSrc;
    modal.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const frame = document.getElementById('videoFrame');

    if (!modal || !frame) return;

    frame.src = '';
    modal.classList.remove('active');
    body.style.overflow = '';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeImageModal();
        closeVideoModal();
    }
});

document.querySelectorAll('.demo-img-wrapper[role="button"]').forEach(item => {
    item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            item.click();
        }
    });
});

document.querySelectorAll('.faq-q').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.toggle('active');

        question.setAttribute(
            'aria-expanded',
            isActive ? 'true' : 'false'
        );
    });
});
