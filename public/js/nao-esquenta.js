document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const siteHeader = document.querySelector('.site-header');
    let lastScrollTop = 0;

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            siteHeader.classList.toggle('menu-open');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.main-navigation') && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            if (siteHeader) {
                siteHeader.classList.remove('menu-open');
            }
        }
    });

    // Controle de scroll para o header
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100 && siteHeader) {
            siteHeader.classList.add('scrolled');
            if (scrollTop > lastScrollTop) {
                siteHeader.classList.add('hidden');
            } else {
                siteHeader.classList.remove('hidden');
            }
        } else if (siteHeader) {
            siteHeader.classList.remove('scrolled');
            siteHeader.classList.remove('hidden');
        }
        lastScrollTop = scrollTop;
    });

    // Carrossel de Imagens
    const slides = document.querySelectorAll('.carousel-slide');
    const sliderDots = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoSlideInterval;

    // Criar pontos de navegação
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

    // Inicializar o primeiro slide
    goToSlide(0);

    // Avançar slides automaticamente
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide((currentSlide + 1) % slides.length);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    startAutoSlide();

    // Parar o avanço automático ao clicar em uma imagem e permitir navegação manual
    slides.forEach(slide => {
        slide.addEventListener('click', () => {
            stopAutoSlide();
        });
    });

    // Navegação manual com setas
    prevButton.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    });

    nextButton.addEventListener('click', () => {
        stopAutoSlide();
        goToSlide((currentSlide + 1) % slides.length);
    });

    // Rolar suavemente para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 64;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Fechar menu mobile se estiver aberto
                navLinks.classList.remove('active');
            }
        });
    });

    // Esconder header ao rolar para baixo apenas em dispositivos móveis
    function isMobile() {
        return window.innerWidth <= 768; 
    }

    window.addEventListener('scroll', () => {
        if (isMobile()) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop) {
                header.style.top = '-100px'; 
            } else {
                header.style.top = '0';
            }
            lastScrollTop = scrollTop;
        }
    });

    // Adicionar transição suave ao header
    header.style.transition = 'top 0.3s';
});