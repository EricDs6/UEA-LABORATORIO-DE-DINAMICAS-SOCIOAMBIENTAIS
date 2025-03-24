/**
 * Otimizações para mobile e melhorias de desempenho
 */
(function() {
    'use strict';
    
    // Otimização de scroll para mobile
    let lastScrollTop = 0;
    let scrollTimeout;
    let header;
    
    // Otimiza o scroll do header em mobile
    function optimizeHeaderScroll() {
        header = document.querySelector('.site-header');
        if (!header) return;
        
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Esconde o header ao rolar para baixo, exibe ao rolar para cima
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                    if (scrollTop > lastScrollTop + 10) {
                        header.classList.add('hidden');
                    } else if (scrollTop < lastScrollTop - 10) {
                        header.classList.remove('hidden');
                    }
                } else {
                    header.classList.remove('scrolled');
                    header.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop;
            });
        }, { passive: true });
    }
    
    // Melhora a interação em dispositivos touch
    function enhanceTouchInteractions() {
        document.querySelectorAll('.cta-button, .nav-links a, .carousel-nav, button').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
                setTimeout(() => {
                    this.blur();
                }, 300);
            }, { passive: true });
        });
    }
    
    // Otimiza o carregamento e renderização de imagens
    function optimizeImages() {
        if ('loading' in HTMLImageElement.prototype) {
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px'
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Adicionar função para garantir carregamento e exibição correta de imagens em carrosséis
    function enhanceImageCarousels() {
        // Otimização dos carrosséis de notícias
        document.querySelectorAll('.news-image-carousel').forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slides img');
            
            // Verificar se as imagens estão carregando corretamente
            slides.forEach(img => {
                // Força o carregamento completo da imagem
                if (!img.complete) {
                    img.onload = function() {
                        // Após carregar, verifica se é imagem ativa
                        if (img.classList.contains('active')) {
                            img.style.opacity = '1';
                            img.style.display = 'block';
                        }
                    };
                    
                    // Caso haja erro no carregamento
                    img.onerror = function() {
                        console.error('Erro ao carregar imagem:', img.src);
                        img.src = '/img/placeholder.jpg'; // Imagem de fallback se disponível
                    };
                }
                
                // Pré-carrega próxima imagem para transição suave
                const imgIndex = Array.from(slides).indexOf(img);
                const nextImgIndex = (imgIndex + 1) % slides.length;
                if (nextImgIndex !== imgIndex) {
                    const nextImg = slides[nextImgIndex];
                    if (nextImg && nextImg.getAttribute('src')) {
                        const preloadImg = new Image();
                        preloadImg.src = nextImg.getAttribute('src');
                    }
                }
            });
        });
        
        // Verifica o carrossel de extensão
        document.querySelectorAll('.extension-carousel').forEach(carousel => {
            const slides = carousel.querySelectorAll('.carousel-slide');
            
            slides.forEach(slide => {
                const img = slide.querySelector('img');
                if (img && !img.complete) {
                    img.onload = function() {
                        if (slide.classList.contains('active')) {
                            slide.style.opacity = '1';
                        }
                    };
                }
            });
        });
    }
    
    // Inicializa otimizações ao carregar o DOM
    document.addEventListener('DOMContentLoaded', function() {
        optimizeHeaderScroll();
        enhanceTouchInteractions();
        optimizeImages();
        enhanceImageCarousels();
        
        // Detecta se é dispositivo mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
        if (isMobile) {
            document.body.classList.add('mobile-device');
        }
        
        // Monitora redimensionamento para garantir que imagens se ajustem
        window.addEventListener('resize', function() {
            // Ajusta altura dos contêineres de carrossel conforme necessário
            document.querySelectorAll('.news-image-carousel, .extension-carousel').forEach(carousel => {
                // Manter proporção 16:9 usando padding-bottom
                // já implementado via CSS
            });
        });
    });
    
    // Otimização para quando o site estiver completamente carregado
    window.addEventListener('load', function() {
        // Remove estilos de animação após carregamento para melhorar desempenho
        setTimeout(() => {
            document.querySelectorAll('.section').forEach(section => {
                section.style.animation = 'none';
            });
        }, 1500);
    });
})();
