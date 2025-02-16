document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let autoSlideInterval;

    for (const link of links) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }

            // Feche o menu mobile após clicar em um link
            navLinks.classList.remove('active');
        });
    }

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Image Slider for Extensão em Ação
    const slides = document.querySelectorAll('.carousel-slide');
    const sliderDots = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Initialize first slide
    goToSlide(0);

    // Auto-advance slides
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Stop auto-slide on image click and allow manual navigation
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            stopAutoSlide();
        });
    });

    // Manual navigation with arrows
    prevButton.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide((currentSlide + 1) % slides.length);
    });

    // Hide header on scroll down, show on scroll up
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.top = '-80px'; // Adjust this value based on your header height
        } else {
            header.style.top = '0';
        }
        lastScrollTop = scrollTop;
    });

    // Add smooth transition to header
    header.style.transition = 'top 0.3s';
});
