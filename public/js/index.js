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

    // Função corrigida para inicializar carrosséis de imagens nas notícias
    function initNewsCarousels() {
        console.log('Iniciando função initNewsCarousels');
        const newsCarousels = document.querySelectorAll('.news-image-carousel');
        
        if (newsCarousels.length === 0) {
            console.warn('Nenhum carrossel de notícias encontrado. Verifique se a classe .news-image-carousel existe no HTML.');
            return;
        }
        
        console.log(`Inicializando ${newsCarousels.length} carrosséis de notícias`);
        
        newsCarousels.forEach((carousel, carouselIndex) => {
            console.log(`Configurando carrossel #${carouselIndex}`);
            
            // Verificar estrutura do carrossel
            const slidesContainer = carousel.querySelector('.carousel-slides');
            if (!slidesContainer) {
                console.error(`Carrossel #${carouselIndex} não possui o container .carousel-slides`);
                return;
            }
            
            const slides = slidesContainer.querySelectorAll('img');
            if (!slides.length) {
                console.error(`Carrossel #${carouselIndex} não tem imagens dentro de .carousel-slides`);
                return;
            }
            
            console.log(`Carrossel #${carouselIndex} tem ${slides.length} slides`);
            
            // Remover handlers de eventos anteriores para evitar duplicação
            const oldPrevBtn = carousel.querySelector('.carousel-nav.prev');
            const oldNextBtn = carousel.querySelector('.carousel-nav.next');
            const oldIndicators = carousel.querySelector('.carousel-indicators');
            
            if (oldPrevBtn) oldPrevBtn.replaceWith(oldPrevBtn.cloneNode(true));
            if (oldNextBtn) oldNextBtn.replaceWith(oldNextBtn.cloneNode(true));
            if (oldIndicators) oldIndicators.innerHTML = '';
            
            // Botões de navegação
            let prevBtn = carousel.querySelector('.carousel-nav.prev');
            let nextBtn = carousel.querySelector('.carousel-nav.next');
            
            // Container de indicadores
            let indicatorsContainer = carousel.querySelector('.carousel-indicators');
            if (!indicatorsContainer) {
                console.log(`Criando container de indicadores para carrossel #${carouselIndex}`);
                indicatorsContainer = document.createElement('div');
                indicatorsContainer.className = 'carousel-indicators';
                carousel.appendChild(indicatorsContainer);
            }
            
            // Resetar estado atual do carrossel
            let currentSlide = 0;
            let autoSlideTimer;
            
            // Limpar indicadores existentes
            indicatorsContainer.innerHTML = '';
            
            // Garantir que apenas uma imagem esteja ativa inicialmente
            slides.forEach(slide => slide.classList.remove('active'));
            
            // Criar indicadores dinamicamente
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Imagem ${index + 1}`);
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });
            
            const indicatorDots = carousel.querySelectorAll('.carousel-indicator');
            
            // Ativar primeiro slide
            if (slides.length > 0) {
                slides[0].classList.add('active');
            }
            
            function goToSlide(index) {
                console.log(`Mudando para slide ${index} no carrossel #${carouselIndex}`);
                slides[currentSlide].classList.remove('active');
                if (indicatorDots[currentSlide]) indicatorDots[currentSlide].classList.remove('active');
                
                currentSlide = index;
                
                slides[currentSlide].classList.add('active');
                if (indicatorDots[currentSlide]) indicatorDots[currentSlide].classList.add('active');
            }
            
            function nextSlide() {
                goToSlide((currentSlide + 1) % slides.length);
            }
            
            function prevSlide() {
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }
            
            // Criar botões de navegação se não existirem e adicionar event listeners
            if (!prevBtn) {
                console.log(`Criando botão de navegação anterior para carrossel #${carouselIndex}`);
                prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-nav prev';
                prevBtn.innerHTML = '&#10094;';
                prevBtn.setAttribute('aria-label', 'Imagem anterior');
                carousel.appendChild(prevBtn);
            }
            
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(autoSlideTimer);
                prevSlide();
                startAutoSlide();
            });
            
            if (!nextBtn) {
                console.log(`Criando botão de navegação próximo para carrossel #${carouselIndex}`);
                nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-nav next';
                nextBtn.innerHTML = '&#10095;';
                nextBtn.setAttribute('aria-label', 'Próxima imagem');
                carousel.appendChild(nextBtn);
            }
            
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(autoSlideTimer);
                nextSlide();
                startAutoSlide();
            });
            
            // Iniciar carrossel automático com função específica
            function startAutoSlide() {
                if (autoSlideTimer) clearInterval(autoSlideTimer);
                if (slides.length > 1) {
                    autoSlideTimer = setInterval(nextSlide, 5000);
                }
            }
            
            // Iniciar carrossel automático se houver mais de uma imagem
            if (slides.length > 1) {
                // Exibir controles de navegação
                if (prevBtn) prevBtn.style.display = 'block';
                if (nextBtn) nextBtn.style.display = 'block';
                indicatorsContainer.style.display = 'flex';
                
                console.log(`Iniciando carrossel automático para carrossel #${carouselIndex}`);
                startAutoSlide();
                
                // Pausar autoplay ao passar o mouse
                carousel.addEventListener('mouseenter', () => {
                    clearInterval(autoSlideTimer);
                });
                
                carousel.addEventListener('mouseleave', () => {
                    startAutoSlide();
                });
                
                // Suporte para gestos de swipe em dispositivos móveis
                let touchStartX = 0;
                let touchEndX = 0;
                
                carousel.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                
                carousel.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    handleSwipe();
                }, { passive: true });
                
                function handleSwipe() {
                    clearInterval(autoSlideTimer);
                    if (touchEndX < touchStartX - 30) {
                        nextSlide(); // Swipe para a esquerda
                    } else if (touchEndX > touchStartX + 30) {
                        prevSlide(); // Swipe para a direita
                    }
                    startAutoSlide();
                }
            } else {
                // Esconder navegação se houver apenas uma imagem
                console.log(`Carrossel #${carouselIndex} tem apenas uma imagem, ocultando controles de navegação`);
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                indicatorsContainer.style.display = 'none';
            }
        });
    }

    // Garantir que a função initNewsCarousels esteja disponível globalmente
    window.initNewsCarousels = initNewsCarousels;
    
    // Inicializar carrosséis de notícias na carga do DOM
    console.log('Agendando inicialização de carrosséis');
    
    // Primeiro, tentar inicializar imediatamente
    initNewsCarousels();
    
    // Como fallback, tentar novamente após pequenos atrasos crescentes
    setTimeout(() => {
        console.log('Tentando inicializar carrosséis novamente após 500ms');
        initNewsCarousels();
    }, 500);
    
    setTimeout(() => {
        console.log('Tentando inicializar carrosséis novamente após 1500ms');
        initNewsCarousels();
    }, 1500);
});

// Garantir que o carrossel seja inicializado quando a página estiver completamente carregada
window.addEventListener('load', () => {
    console.log('Evento load disparado');
    if (typeof initNewsCarousels === 'function') {
        console.log('Inicializando carrosséis após carga completa');
        initNewsCarousels();
        
        // Adicionar um MutationObserver para detectar mudanças no DOM
        const observer = new MutationObserver((mutations) => {
            // Verificar se alguma alteração afeta os carrosséis
            for (let mutation of mutations) {
                if (mutation.type === 'childList' || 
                    (mutation.target.classList && 
                     mutation.target.classList.contains('news-image-carousel'))) {
                    console.log('Mudanças no DOM detectadas, reinicializando carrosséis');
                    initNewsCarousels();
                    break;
                }
            }
        });
        
        // Observar mudanças no container de notícias
        const newsSection = document.querySelector('.news-grid');
        if (newsSection) {
            observer.observe(newsSection, { 
                childList: true, 
                subtree: true, 
                attributes: true,
                attributeFilter: ['class']
            });
        }
    } else {
        console.error('Função initNewsCarousels não foi definida corretamente');
    }
});