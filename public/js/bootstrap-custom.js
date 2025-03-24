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
