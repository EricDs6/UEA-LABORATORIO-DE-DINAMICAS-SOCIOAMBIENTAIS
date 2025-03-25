/**
 * Personalizações e melhorias para o Bootstrap
 */
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona sombra à navbar quando rolar a página
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow');
                navbar.classList.add('navbar-shrink');
            } else {
                navbar.classList.remove('shadow');
                navbar.classList.remove('navbar-shrink');
            }
        });
    }
    
    // Fecha o menu mobile ao clicar em um item
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navLinks.length && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
    
    // Animação suave para links de navegação interna
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Inicializa tooltips do Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Inicializa popovers do Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    
    // Otimizar vídeos em destaque
    optimizeFeaturedVideos();
});

// Adiciona classe ao elemento visível durante a rolagem (efeito de animação)
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Configura o observador de interseção quando o documento estiver carregado
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.15
        });
        
        // Observa todos os elementos animáveis
        document.querySelectorAll('.animate-on-scroll').forEach(item => {
            observer.observe(item);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(item => {
            item.classList.add('visible');
        });
    }
});

// Adicionar função para gerenciar vídeos em destaque
function optimizeFeaturedVideos() {
    // Otimiza o carregamento de iframes de vídeo
    const videoIframes = document.querySelectorAll('.featured-image iframe');
    
    if (videoIframes.length === 0) return;
    
    // Em dispositivos móveis ou conexões lentas, podemos optar por não autoplay
    const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const connectionSpeed = navigator.connection ? navigator.connection.effectiveType : '4g';
    const shouldAutoplay = !isMobile || (connectionSpeed !== 'slow-2g' && connectionSpeed !== '2g');
    
    videoIframes.forEach((iframe) => {
        // Força o iframe a ocupar mais que 100% para evitar bordas
        iframe.style.position = 'absolute';
        iframe.style.top = '50%';
        iframe.style.left = '50%';
        iframe.style.width = '101%'; // Ligeiramente maior
        iframe.style.height = '101%'; // Ligeiramente maior
        iframe.style.transform = 'translate(-50%, -50%)'; // Centraliza
        iframe.style.border = '0';
        
        // Configurações específicas para vídeos do Vimeo
        if (iframe.src.includes('vimeo')) {
            // Modificar URL para garantir que o vídeo preencha todo o espaço
            let src = iframe.src;
            if (!src.includes('dnt=1')) {
                src += '&dnt=1'; // Evita rastreamento
            }
            
            // Configuração para melhor qualidade em tela cheia
            if (!src.includes('quality=')) {
                src += isMobile ? '&quality=540p' : '&quality=720p';
            }
            
            // Garantir que o vídeo cubra todo o espaço
            if (!src.includes('transparent=0')) {
                src += '&transparent=0';
            }
            
            // Forçar o preenchimento completo
            if (!src.includes('background=1')) {
                src += '&background=1';
            }
            
            iframe.src = src;
        }
        
        // Observador de interseção para gerenciar os recursos de vídeo
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    // Lógica para pausar/reproduzir vídeos baseado na visibilidade
                    if (!entry.isIntersecting) {
                        // Vídeo não está visível no viewport, pausar para economizar recursos
                        try {
                            // Tentativa de pausar o vídeo (embora com &background=1 o Vimeo já gerencia isso)
                            if (iframe.contentWindow && typeof iframe.contentWindow.postMessage === 'function') {
                                iframe.contentWindow.postMessage('{"method":"pause"}', '*');
                            }
                        } catch (e) {
                            console.warn('Não foi possível pausar o vídeo:', e);
                        }
                    } else {
                        // Vídeo está visível, retomar reprodução se necessário
                        if (shouldAutoplay) {
                            try {
                                if (iframe.contentWindow && typeof iframe.contentWindow.postMessage === 'function') {
                                    iframe.contentWindow.postMessage('{"method":"play"}', '*');
                                }
                            } catch (e) {
                                console.warn('Não foi possível reproduzir o vídeo:', e);
                            }
                        }
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px 300px 0px'
            });
            
            observer.observe(iframe.parentElement);
        }
    });
    
    // Verificação adicional no carregamento completo do vídeo
    window.addEventListener('load', function() {
        videoIframes.forEach(iframe => {
            // Garantir que o vídeo ocupe 101% para evitar bordas
            iframe.style.width = '101%';
            iframe.style.height = '101%';
        });
    });
    
    // Garantir que o redimensionamento da janela mantém as proporções
    window.addEventListener('resize', function() {
        document.querySelectorAll('.featured-image').forEach(container => {
            // A proporção é mantida automaticamente pelo padding-bottom no CSS
        });
    });
}
