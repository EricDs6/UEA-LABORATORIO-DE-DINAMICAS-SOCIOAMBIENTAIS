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

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
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

    // Adicionar transição suave ao header
    header.style.transition = 'top 0.3s';

    // Função otimizada para inicializar carrosséis de imagens nas notícias
    function initNewsCarousels() {
        console.log('Inicializando carrosséis de notícias');
        const newsCarousels = document.querySelectorAll('.news-image-carousel');
        
        if (newsCarousels.length === 0) {
            console.log('Nenhum carrossel de notícias encontrado');
            return;
        }
        
        newsCarousels.forEach((carousel, carouselIndex) => {
            // Limpar os event listeners anteriores para evitar duplicações
            const oldPrevBtn = carousel.querySelector('.carousel-nav.prev');
            const oldNextBtn = carousel.querySelector('.carousel-nav.next');
            
            if (oldPrevBtn) {
                const newPrevBtn = oldPrevBtn.cloneNode(true);
                oldPrevBtn.parentNode.replaceChild(newPrevBtn, oldPrevBtn);
            }
            
            if (oldNextBtn) {
                const newNextBtn = oldNextBtn.cloneNode(true);
                oldNextBtn.parentNode.replaceChild(newNextBtn, oldNextBtn);
            }
            
            // Obter elementos do carrossel
            const slidesContainer = carousel.querySelector('.carousel-slides');
            if (!slidesContainer) return;
            
            const slides = slidesContainer.querySelectorAll('img');
            if (slides.length <= 0) return;
            
            // Botões de navegação
            const prevBtn = carousel.querySelector('.carousel-nav.prev');
            const nextBtn = carousel.querySelector('.carousel-nav.next');
            
            // Container de indicadores
            let indicatorsContainer = carousel.querySelector('.carousel-indicators');
            if (!indicatorsContainer) {
                indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'carousel-indicators';
                carousel.appendChild(indicatorsContainer);
            } else {
                indicatorsContainer.innerHTML = '';
            }
            
            // Configurar estado inicial
            let currentSlide = 0;
            let autoSlideTimer = null;
            
            // Garantir que apenas uma imagem esteja ativa inicialmente
            slides.forEach(slide => slide.classList.remove('active'));
            slides[0].classList.add('active');
            
            // Criar indicadores
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Imagem ${index + 1}`);
                indicator.addEventListener('click', () => goToSlide(index));
                // Remover o uso do elemento span interno
                
                indicatorsContainer.appendChild(indicator);
            });
            
            const indicators = carousel.querySelectorAll('.carousel-indicator');
            
            function goToSlide(index) {
                // Remover classe active do slide atual
                slides[currentSlide].classList.remove('active');
                if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');
                
                // Atualizar índice e adicionar classe active ao novo slide
                currentSlide = index;
                slides[currentSlide].classList.add('active');
                if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
            }
            
            function nextSlide() {
                goToSlide((currentSlide + 1) % slides.length);
            }
            
            function prevSlide() {
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }
            
            function startAutoSlide() {
                if (autoSlideTimer) clearInterval(autoSlideTimer);
                if (slides.length > 1) {
                    autoSlideTimer = setInterval(nextSlide, 2000);  // Alterado de 5000 para 2000 ms
                }
            }
            
            function stopAutoSlide() {
                if (autoSlideTimer) {
                    clearInterval(autoSlideTimer);
                    autoSlideTimer = null;
                }
            }
            
            // Adicionar event listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoSlide();
                    prevSlide();
                    startAutoSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    stopAutoSlide();
                    nextSlide();
                    startAutoSlide();
                });
            }
            
            // Iniciar carrossel automático se houver mais de uma imagem
            if (slides.length > 1) {
                // Exibir controles de navegação
                if (prevBtn) prevBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block';
                indicatorsContainer.style.display = 'flex';
                
                startAutoSlide();
                
                // Pausar autoplay ao passar o mouse
                carousel.addEventListener('mouseenter', stopAutoSlide);
                carousel.addEventListener('mouseleave', startAutoSlide);
                
                // Suporte para gestos de swipe em dispositivos móveis
                let touchStartX = 0;
                
                carousel.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                
                carousel.addEventListener('touchend', (e) => {
                    const touchEndX = e.changedTouches[0].screenX;
                    const diff = touchEndX - touchStartX;
                    
                    stopAutoSlide();
                    if (diff < -30) {
                        nextSlide(); // Swipe para a esquerda
                    } else if (diff > 30) {
                        prevSlide(); // Swipe para a direita
                    }
                    startAutoSlide();
                }, { passive: true });
            } else {
                // Esconder navegação se houver apenas uma imagem
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                indicatorsContainer.style.display = 'none';
            }
        });
    }

    // Garantir que a função initNewsCarousels esteja disponível globalmente
    window.initNewsCarousels = initNewsCarousels;
    
    // Inicializar carrosséis logo que possível
    initNewsCarousels();
});

// Inicializar carrosséis novamente após a carga completa da página
window.addEventListener('load', () => {
    // Garantir que todos os recursos estejam carregados antes de inicializar
    setTimeout(() => {
        if (typeof initNewsCarousels === 'function') {
            initNewsCarousels();
            
            // Observar mudanças no DOM que possam afetar os carrosséis
            const newsContainer = document.querySelector('.news-grid');
            if (newsContainer && 'MutationObserver' in window) {
                const observer = new MutationObserver(() => {
                    initNewsCarousels();
                });
                
                observer.observe(newsContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }, 500);
});