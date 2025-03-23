// Garantir carregamento do script do Vimeo logo no início
(function() {
    // Carregar script do Vimeo se ainda não estiver carregado
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
        console.log('Carregando script do Vimeo');
        const vimeoScript = document.createElement('script');
        vimeoScript.src = "https://player.vimeo.com/api/player.js";
        vimeoScript.async = true;
        document.head.appendChild(vimeoScript);
    }
})();

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

    // Carrossel de Imagens - corrigindo o erro
    const slides = document.querySelectorAll('.carousel-slide');
    const sliderDots = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoSlideInterval;

    // Verificar se os elementos do carrossel principal existem antes de inicializar
    if (slides.length > 0 && sliderDots) {
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
            // Verificar se os elementos existem antes de manipulá-los
            if (slides[currentSlide] && dots[currentSlide]) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
            }
            
            currentSlide = index;
            
            if (slides[currentSlide] && dots[currentSlide]) {
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }
        }

        // Inicializar o primeiro slide se houver slides
        if (slides.length > 0) {
            goToSlide(0);
        }

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
    }

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
    
    // Função padronizada para inicializar carrosséis - exatamente como na index
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
            
            console.log(`Criando ${slides.length} indicadores para o carrossel #${carouselIndex}`);
            
            // Criar indicadores como tracinhos
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.classList.add('carousel-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.setAttribute('aria-label', `Slide ${index + 1}`);
                indicator.addEventListener('click', () => goToSlide(index));
                // Não adicionamos mais o elemento interno span, já que agora são tracinhos simples
                
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
    console.log('Disponibilizando função initNewsCarousels globalmente');
    window.initNewsCarousels = initNewsCarousels;
    
    // Inicializar no carregamento do DOM
    console.log('Tentando inicializar carrosséis de imediato');
    initNewsCarousels();
    
    // Inicializar novamente após carregamento completo
    window.addEventListener('load', function() {
        console.log('Evento load disparado, inicializando carrosséis após pequeno delay');
        setTimeout(() => {
            console.log('Executando inicialização de carrosséis após delay');
            if (typeof initNewsCarousels === 'function') {
                initNewsCarousels();
            }
        }, 500);
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

    // Função específica para inicialização de vídeos do Vimeo
    function setupVimeoVideos() {
        console.log('Configurando vídeos do Vimeo');
        const vimeoIframes = document.querySelectorAll('.news-video iframe[src*="player.vimeo.com"]');
        
        vimeoIframes.forEach((iframe, index) => {
            console.log(`Ajustando iframe ${index + 1}`);
            
            // Garantir visibilidade
            iframe.style.display = 'block';
            
            // Verificar se já tem o script do Vimeo
            if (typeof Vimeo !== 'undefined') {
                try {
                    // Inicializar o player para garantir funcionamento
                    new Vimeo.Player(iframe);
                    console.log(`Player Vimeo inicializado para iframe ${index + 1}`);
                } catch (e) {
                    console.error('Erro ao inicializar Vimeo Player:', e);
                }
            }
        });
    }
    
    // Executar configuração de vídeos com delay
    setTimeout(setupVimeoVideos, 1000);
    
    // Adicionar chamada para inicializar vídeos após carregamento completo
    window.addEventListener('load', function() {
        // Configurar vídeos do Vimeo
        setTimeout(setupVimeoVideos, 1500);
    });
});

// Adicionar função para garantir carregamento dos vídeos do Vimeo
function initVimeoVideos() {
    console.log('Inicializando vídeos do Vimeo');
    
    // Carregar script do Vimeo se ainda não estiver carregado
    if (!document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
        const vimeoScript = document.createElement('script');
        vimeoScript.src = 'https://player.vimeo.com/api/player.js';
        vimeoScript.async = true;
        document.body.appendChild(vimeoScript);
        
        vimeoScript.onload = function() {
            console.log('Script do Vimeo carregado com sucesso');
            checkVimeoIframes();
        };
    } else {
        checkVimeoIframes();
    }
}

function checkVimeoIframes() {
    // Verificar todos os iframes do Vimeo e recarregá-los se necessário
    const vimeoIframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
    console.log(`Encontrados ${vimeoIframes.length} iframes do Vimeo`);
    
    vimeoIframes.forEach((iframe, index) => {
        console.log(`Verificando iframe ${index + 1}`);
        
        // Garantir que o iframe esteja visível
        iframe.style.display = 'block';
        
        // Recarregar o iframe se necessário
        const currentSrc = iframe.getAttribute('src');
        iframe.setAttribute('src', currentSrc);
    });
}

// Adicionar a função ao carregamento da página e window.load
document.addEventListener('DOMContentLoaded', initVimeoVideos);
window.addEventListener('load', () => {
    setTimeout(initVimeoVideos, 1000);
});

// Disponibilizar a função globalmente também fora do DOMContentLoaded
// para garantir que esteja acessível o mais cedo possível
console.log('Definindo função initNewsCarousels global');
if (typeof window.initNewsCarousels !== 'function') {
    window.initNewsCarousels = function() {
        console.log('Chamada global para initNewsCarousels, redirecionando para implementação quando disponível');
        if (window._realInitNewsCarousels) {
            window._realInitNewsCarousels();
        } else {
            console.log('Implementação real ainda não disponível');
        }
    };
}