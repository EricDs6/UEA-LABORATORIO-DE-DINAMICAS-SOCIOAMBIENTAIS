document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    let autoSlideInterval;

    // Rolar suavemente para links internos
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
                // Fechar o menu mobile ao clicar em um link
                navLinks.classList.remove('active');
            }
        });
    }

    // Alternar menu mobile
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Carrossel de Extensão
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelector('.carousel-dots');
    const carouselPrevBtn = document.querySelector('.carousel-prev');
    const carouselNextBtn = document.querySelector('.carousel-next');
    let currentCarouselSlide = 0;
    let carouselInterval;

    // Criar pontos de navegação
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.addEventListener('click', () => goToCarouselSlide(index));
        carouselDots.appendChild(dot);
    });

    const carouselDotBtns = document.querySelectorAll('.dot');

    function goToCarouselSlide(index) {
        carouselSlides[currentCarouselSlide].classList.remove('active');
        carouselDotBtns[currentCarouselSlide].classList.remove('active');
        currentCarouselSlide = index;
        carouselSlides[currentCarouselSlide].classList.add('active');
        carouselDotBtns[currentCarouselSlide].classList.add('active');
    }

    // Inicializar o primeiro slide
    goToCarouselSlide(0);

    // Avançar slides automaticamente
    function startCarouselAuto() {
        carouselInterval = setInterval(() => {
            goToCarouselSlide((currentCarouselSlide + 1) % carouselSlides.length);
        }, 5000);
    }

    function stopCarouselAuto() {
        clearInterval(carouselInterval);
    }

    startCarouselAuto();

    // Navegação manual
    carouselPrevBtn.addEventListener('click', () => {
        stopCarouselAuto();
        goToCarouselSlide((currentCarouselSlide - 1 + carouselSlides.length) % carouselSlides.length);
        startCarouselAuto();
    });

    carouselNextBtn.addEventListener('click', () => {
        stopCarouselAuto();
        goToCarouselSlide((currentCarouselSlide + 1) % carouselSlides.length);
        startCarouselAuto();
    });

    // Pausar autoplay ao passar o mouse
    const carouselContainer = document.querySelector('.extension-carousel');
    carouselContainer.addEventListener('mouseenter', stopCarouselAuto);
    carouselContainer.addEventListener('mouseleave', startCarouselAuto);

    // Esconder header ao rolar para baixo em dispositivos móveis
    function isMobile() {
        return window.innerWidth <= 768; 
    }

    let ticking = false;
    window.addEventListener('scroll', function(e) {
        if (isMobile() && !ticking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop) {
                    header.style.top = '-100px'; 
                } else {
                    header.style.top = '0';
                }
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });

    carouselDots.setAttribute('aria-live', 'polite');
    carouselSlides.forEach((slide, index) => {
        slide.setAttribute('role', 'img');
        slide.setAttribute('aria-label', `Slide ${index + 1}`);
    });

    // Usar IntersectionObserver para lazy loading de imagens
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Debounce para eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Aplicar debounce no evento de scroll
    const handleScroll = debounce(() => {
        // Seu código de scroll aqui
    }, 20);

    window.addEventListener('scroll', handleScroll);
});