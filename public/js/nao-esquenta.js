document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            header.classList.toggle('menu-open');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav') && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            if (header) {
                header.classList.remove('menu-open');
            }
        }
    });

    // Controle de scroll para o header
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100 && header) {
            header.classList.add('scrolled');
            if (scrollTop > lastScrollTop) {
                header.style.top = '-100px';
            } else {
                header.style.top = '0';
            }
        } else if (header) {
            header.classList.remove('scrolled');
            header.classList.remove('hidden');
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
    
    // Inicializar os carrosséis
    if (typeof initNewsCarousels === 'function') {
        initNewsCarousels();
    } else {
        console.warn('Função initNewsCarousels não encontrada');
    }
    
    // Adicionar funcionalidade para o botão "Carregar mais notícias"
    const loadMoreButton = document.querySelector('.load-more-button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            this.innerHTML = '<span class="loading-spinner"></span> Carregando...';
            this.disabled = true;
            
            // Simulação de carregamento (remover na implementação real)
            setTimeout(() => {
                this.innerHTML = 'Carregar mais notícias';
                this.disabled = false;
                alert('Esta funcionalidade será implementada em breve!');
            }, 2000);
        });
    }
});

// Função para inicializar os carrosséis de notícias
function initNewsCarousels() {
    console.log('Inicializando carrosséis de notícias');
    const newsCarousels = document.querySelectorAll('.news-image-carousel');
    
    if (newsCarousels.length === 0) {
        console.log('Nenhum carrossel de notícias encontrado');
        return;
    }
    
    newsCarousels.forEach((carousel, carouselIndex) => {
        console.log(`Inicializando carrossel #${carouselIndex}`);
        
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
        if (!slidesContainer) {
            console.log(`Carrossel #${carouselIndex} não tem container de slides`);
            return;
        }
        
        const slides = slidesContainer.querySelectorAll('img');
        if (slides.length <= 0) {
            console.log(`Carrossel #${carouselIndex} não tem imagens`);
            return;
        }
        
        console.log(`Carrossel #${carouselIndex} tem ${slides.length} slides`);
        
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
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            
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
                autoSlideTimer = setInterval(nextSlide, 5000);
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
            if (prevBtn) prevBtn.style.display = 'flex';
            if (nextBtn) nextBtn.style.display = 'flex';
            indicatorsContainer.style.display = 'flex';
            
            startAutoSlide();
            
            // Pausar autoplay ao passar o mouse
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
            
            // Suporte para gestos de swipe em dispositivos móveis
            let touchStartX = 0;
            
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            }, { passive: true });
            
            carousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                
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

// Disponibilizar a função globalmente
window.initNewsCarousels = initNewsCarousels;

// Inicializar no carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar os carrosséis
    initNewsCarousels();
    
    // Adicionar funcionalidade para o botão "Carregar mais notícias"
    const loadMoreButton = document.querySelector('.load-more-button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            this.innerHTML = '<span class="loading-spinner"></span> Carregando...';
            this.disabled = true;
            
            // Simulação de carregamento (remover na implementação real)
            setTimeout(() => {
                this.innerHTML = 'Carregar mais notícias';
                this.disabled = false;
                alert('Esta funcionalidade será implementada em breve!');
            }, 2000);
        });
    }
});

// Inicializar carrosséis novamente após a carga completa da página
window.addEventListener('load', () => {
    setTimeout(initNewsCarousels, 500);
});