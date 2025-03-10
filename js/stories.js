document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.story-slide');
    const progressBars = document.querySelectorAll('.progress-bar .progress');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    
    let currentSlide = 0;
    let progressTimeout;

    function showSlide(index) {
        // Esconder todos os slides
        slides.forEach(slide => slide.classList.remove('active'));
        // Mostrar o slide atual
        slides[index].classList.add('active');
        
        // Resetar todas as barras de progresso
        progressBars.forEach((bar, i) => {
            bar.style.width = i < index ? '100%' : '0';
        });
        
        // Animar a barra de progresso atual
        clearTimeout(progressTimeout);
        progressBars[index].style.width = '100%';
        
        // Configurar o próximo slide
        progressTimeout = setTimeout(() => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                showSlide(currentSlide);
            } else {
                window.location.href = 'index.html'; // Voltar para a página inicial
            }
        }, 5000); // 5 segundos por slide
    }

    // Navegação por clique
    document.addEventListener('click', (e) => {
        const rect = slides[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        if (x < rect.width / 2 && currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        } else if (x > rect.width / 2 && currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    // Navegação por botões
    prevButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    nextButton.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            showSlide(currentSlide);
        }
    });

    // Pausar quando pressionar
    document.addEventListener('mousedown', () => {
        clearTimeout(progressTimeout);
        progressBars[currentSlide].style.transition = 'none';
    });

    // Continuar quando soltar
    document.addEventListener('mouseup', () => {
        progressBars[currentSlide].style.transition = '';
        showSlide(currentSlide);
    });

    // Iniciar o primeiro slide
    showSlide(0);
}); 