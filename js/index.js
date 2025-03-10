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

    // Carrossel de Imagens para Extensão em Ação
    const slides = document.querySelectorAll('.carousel-slide');
    const sliderDots = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentSlide = 0;

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
        }, 2500);
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

    
    sliderDots.setAttribute('aria-live', 'polite');
    slides.forEach((slide, index) => {
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

    const storyItems = document.querySelectorAll('.story-item');
    const storyModal = document.getElementById('storyModal');
    if (!storyModal) {
        console.error('Modal não encontrado');
        return;
    }
    const storyImage = storyModal.querySelector('.story-image');
    const closeButton = storyModal.querySelector('.story-close');
    const prevButton = storyModal.querySelector('.story-nav.prev');
    const nextButton = storyModal.querySelector('.story-nav.next');
    const progress = storyModal.querySelector('.progress');
    
    const stories = [
        {
            image: '/img/destaques/Campeões do hackathon.jpg',
            title: 'Hackathon',
            description: 'Primeiro lugar no Hackathon Inova Itacoatiara! 🏆'
        },
        {
            image: '/img/projetos/nao-esquenta/visita_inpa.gif',
            title: 'INPA',
            description: 'Visita técnica ao INPA para desenvolvimento de projetos 🔬'
        },
        {
            image: '/img/projetos/eco-comunidade/eco-comunidade.jpg',
            title: 'Eco',
            description: 'Projeto EcoComunidade em ação! 🌱'
        },
        {
            image: '/img/extras/capacitacao rural.jpg',
            title: 'Capacitação',
            description: 'Capacitação em Cadastro Ambiental Rural 📚'
        },
        {
            image: '/img/extensao/extensao1.jpg',
            title: 'Extensão',
            description: 'Atividades de extensão com a comunidade 🤝'
        }
    ];

    let currentStoryIndex = 0;
    let storyTimeout;

    storyItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openStoryModal(index);
        });
    });

    function showStory(index) {
        const story = stories[index];
        
        // Atualizar indicadores
        const indicators = document.querySelector('.story-indicators');
        if (indicators) {
            indicators.innerHTML = stories.map((_, i) => `
                <div class="story-indicator ${i === index ? 'active' : ''}">
                    <div class="progress" style="width: ${i < index ? '100%' : '0'}"></div>
                </div>
            `).join('');
        }
        
        // Atualizar conteúdo
        if (storyImage) {
            storyImage.innerHTML = `
                <div class="story-click-area prev"></div>
                <div class="story-click-area next"></div>
                <img src="${story.image}" alt="${story.title}">
                <div class="story-description">
                    <strong>${story.title}</strong>
                    <p>${story.description}</p>
                </div>
            `;

            // Configurar áreas clicáveis
            const prevArea = storyImage.querySelector('.story-click-area.prev');
            const nextArea = storyImage.querySelector('.story-click-area.next');
            
            if (prevArea && nextArea) {
                prevArea.addEventListener('click', prevStory);
                nextArea.addEventListener('click', nextStory);
            }
        }

        // Animar progresso
        if (indicators) {
            const currentIndicator = indicators.children[index].querySelector('.progress');
            if (currentIndicator) {
                currentIndicator.style.width = '0';
                setTimeout(() => {
                    currentIndicator.style.width = '100%';
                }, 50);
            }
        }

        // Configurar timeout
        clearTimeout(storyTimeout);
        storyTimeout = setTimeout(nextStory, 5000);
    }

    function nextStory() {
        currentStoryIndex = (currentStoryIndex + 1) % stories.length;
        if (currentStoryIndex === 0) {
            closeStoryModal();
        } else {
            showStory(currentStoryIndex);
        }
    }

    function prevStory() {
        currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
        showStory(currentStoryIndex);
    }

    function openStoryModal(index) {
        if (!storyModal) return;
        
        currentStoryIndex = index;
        storyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Adicionar indicadores se não existirem
        if (!storyModal.querySelector('.story-indicators')) {
            const indicators = document.createElement('div');
            indicators.className = 'story-indicators';
            storyModal.querySelector('.story-modal-content').insertBefore(
                indicators,
                storyModal.querySelector('.story-view')
            );
        }
        
        showStory(currentStoryIndex);
    }

    function closeStoryModal() {
        storyModal.classList.remove('active');
        document.body.style.overflow = '';
        clearTimeout(storyTimeout);
    }

    closeButton.addEventListener('click', closeStoryModal);
    prevButton.addEventListener('click', prevStory);
    nextButton.addEventListener('click', nextStory);

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeStoryModal();
    });

    // Adicionar controle por toque
    let touchStartX = 0;
    let touchEndX = 0;

    storyModal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    storyModal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                prevStory();
            } else {
                nextStory();
            }
        }
    }

    // Pausar o timer quando o usuário pressionar o mouse/toque
    storyModal.addEventListener('mousedown', () => {
        clearTimeout(storyTimeout);
    });

    storyModal.addEventListener('touchstart', () => {
        clearTimeout(storyTimeout);
    });

    // Retomar o timer quando soltar
    storyModal.addEventListener('mouseup', () => {
        storyTimeout = setTimeout(nextStory, 5000);
    });

    storyModal.addEventListener('touchend', () => {
        storyTimeout = setTimeout(nextStory, 5000);
    });
});