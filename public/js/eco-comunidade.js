document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fechar menu mobile ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
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

    header.style.transition = 'top 0.3s';
    
    // Inicializar carrosséis de imagens nas notícias - implementação idêntica à da página index
    function initNewsCarousels() {
        console.log('Inicializando carrosséis de notícias (modo index)');
        const newsCarousels = document.querySelectorAll('.news-image-carousel');
        
        if (newsCarousels.length === 0) {
            console.log('Nenhum carrossel de notícias encontrado');
            return;
        }
        
        newsCarousels.forEach((carousel, carouselIndex) => {
            // Obter elementos do carrossel
            const slidesContainer = carousel.querySelector('.carousel-slides');
            if (!slidesContainer) {
                console.log(`Carrossel #${carouselIndex}: Container de slides não encontrado`);
                return;
            }
            
            const slides = Array.from(slidesContainer.querySelectorAll('img'));
            if (slides.length <= 1) {
                console.log(`Carrossel #${carouselIndex}: Não há slides suficientes (${slides.length})`);
                return;
            }
            
            console.log(`Carrossel #${carouselIndex}: ${slides.length} slides encontrados`);
            
            // Botões de navegação - recriar para evitar duplicação de event listeners
            let prevBtn = carousel.querySelector('.carousel-nav.prev');
            let nextBtn = carousel.querySelector('.carousel-nav.next');
            
            if (prevBtn) prevBtn.remove();
            if (nextBtn) nextBtn.remove();
            
            prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav prev';
            prevBtn.innerHTML = '&#10094;';
            prevBtn.setAttribute('aria-label', 'Imagem anterior');
            
            nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav next';
            nextBtn.innerHTML = '&#10095;';
            nextBtn.setAttribute('aria-label', 'Próxima imagem');
            
            carousel.appendChild(prevBtn);
            carousel.appendChild(nextBtn);
            
            // Container de indicadores - recriar completamente
            let indicatorsContainer = carousel.querySelector('.carousel-indicators');
            if (indicatorsContainer) indicatorsContainer.remove();
            
            indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
            carousel.appendChild(indicatorsContainer);
            
            // Estado do carrossel
            let currentSlide = 0;
            let autoSlideTimer = null;
            
            // Resetar slides e ativar apenas o primeiro
            slides.forEach(slide => slide.classList.remove('active'));
            slides[0].classList.add('active');
            
            // Criar indicadores para cada slide
            for (let i = 0; i < slides.length; i++) {
                const indicator = document.createElement('button');
                indicator.className = i === 0 ? 'carousel-indicator active' : 'carousel-indicator';
                indicator.setAttribute('aria-label', `Imagem ${i + 1}`);
                indicator.setAttribute('data-slide-index', i);
                indicator.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(i);
                });
                indicatorsContainer.appendChild(indicator);
            }
            
            const indicators = Array.from(indicatorsContainer.querySelectorAll('.carousel-indicator'));
            
            // Funções de navegação
            function goToSlide(index) {
                if (index >= 0 && index < slides.length) {
                    slides[currentSlide].classList.remove('active');
                    indicators[currentSlide].classList.remove('active');
                    
                    currentSlide = index;
                    
                    slides[currentSlide].classList.add('active');
                    indicators[currentSlide].classList.add('active');
                }
            }
            
            function nextSlide() {
                goToSlide((currentSlide + 1) % slides.length);
            }
            
            function prevSlide() {
                goToSlide((currentSlide - 1 + slides.length) % slides.length);
            }
            
            // Controle de timer para autoplay
            function startAutoSlide() {
                stopAutoSlide();
                autoSlideTimer = setInterval(nextSlide, 5000);
            }
            
            function stopAutoSlide() {
                if (autoSlideTimer) {
                    clearInterval(autoSlideTimer);
                    autoSlideTimer = null;
                }
            }
            
            // Event listeners
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                stopAutoSlide();
                prevSlide();
            });
            
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                stopAutoSlide();
                nextSlide();
            });
            
            // Pausar/retomar autoplay com mouse hover
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
            }, { passive: true });
            
            // Iniciar autoplay
            startAutoSlide();
        });
    }

    // Remover qualquer versão anterior da função para evitar conflitos
    window.initNewsCarousels = initNewsCarousels;
    
    // Inicializar carrosséis ao carregar a página
    initNewsCarousels();
    
    // Reinicializar após um pequeno atraso para garantir que as imagens estejam carregadas
    window.addEventListener('load', () => {
        setTimeout(initNewsCarousels, 500);
    });

    // Funcionalidade para o botão "Carregar mais notícias"
    const loadMoreButton = document.querySelector('.load-more-button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            // Aqui você pode implementar a lógica para carregar mais notícias
            // Por exemplo, fazer uma requisição AJAX para buscar mais notícias
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
    
    // Funcionalidade para os vídeos placeholders com Vimeo
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // Verificar se este placeholder tem informações do vídeo do Vimeo
            const videoId = this.dataset.videoId;
            const videoHash = this.dataset.videoHash;
            const videoTitle = this.dataset.videoTitle;
            
            if (videoId && videoHash) {
                // Criar o modal para o vídeo
                const videoModal = document.createElement('div');
                videoModal.className = 'video-modal';
                
                // Conteúdo do modal com iframe do Vimeo
                videoModal.innerHTML = `
                    <div class="video-modal-content">
                        <button class="video-modal-close">&times;</button>
                        <div class="video-container">
                            <div style="padding:56.25% 0 0 0;position:relative;">
                                <iframe src="https://player.vimeo.com/video/${videoId}?h=${videoHash}&autoplay=1&title=0&byline=0&portrait=0" 
                                    frameborder="0" 
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" 
                                    style="position:absolute;top:0;left:0;width:100%;height:100%;" 
                                    title="${videoTitle}">
                                </iframe>
                            </div>
                        </div>
                    </div>
                `;
                
                // Adicionar modal ao corpo da página
                document.body.appendChild(videoModal);
                
                // Tornar o modal visível com animação
                setTimeout(() => {
                    videoModal.classList.add('active');
                }, 10);
                
                // Fechar o modal quando clicar no botão de fechar
                const closeButton = videoModal.querySelector('.video-modal-close');
                closeButton.addEventListener('click', () => {
                    videoModal.classList.remove('active');
                    // Remover o modal do DOM após a animação
                    setTimeout(() => {
                        document.body.removeChild(videoModal);
                    }, 300);
                });
                
                // Fechar o modal ao clicar fora do conteúdo
                videoModal.addEventListener('click', (e) => {
                    if (e.target === videoModal) {
                        closeButton.click();
                    }
                });
                
                // Carregar o script do Vimeo se ainda não estiver carregado
                if (!window.Vimeo) {
                    const script = document.createElement('script');
                    script.src = 'https://player.vimeo.com/api/player.js';
                    document.body.appendChild(script);
                }
            } else {
                // Fallback para placeholder sem informações de vídeo
                alert('Este vídeo será disponibilizado em breve!');
            }
        });
    });

    // Carregar scripts do Vimeo apenas uma vez
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
        const vimeoScript = document.createElement('script');
        vimeoScript.src = 'https://player.vimeo.com/api/player.js';
        document.body.appendChild(vimeoScript);
    }
});