/**
 * Script para gerenciar o filtro de notícias e outros comportamentos
 * relacionados à exibição de notícias no site do LDS
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o filtro de notícias
    initializeNewsFilter();
    
    // Configurar efeitos hover nos cards de notícias
    setupNewsCardEffects();
    
    // Configurar botão "Carregar mais"
    setupLoadMoreButton();
});

/**
 * Inicializa o sistema de filtro para as notícias
 */
function initializeNewsFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const newsItems = document.querySelectorAll('.news-item');
    
    if (!filterButtons.length || !newsItems.length) return;
    
    // Evento de clique para os botões de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            this.classList.add('active');
            
            // Obter o valor do filtro
            const filterValue = this.getAttribute('data-filter');
            
            // Filtrar os itens
            newsItems.forEach(item => {
                if (filterValue === 'all') {
                    // Mostrar todos
                    item.classList.remove('filtered-out');
                    setTimeout(() => {
                        item.style.position = 'static';
                    }, 500);
                } else {
                    // Filtrar por categoria
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (itemCategory === filterValue) {
                        item.classList.remove('filtered-out');
                        setTimeout(() => {
                            item.style.position = 'static';
                        }, 500);
                    } else {
                        item.classList.add('filtered-out');
                        setTimeout(() => {
                            item.style.position = 'absolute';
                        }, 500);
                    }
                }
            });
        });
    });
}

/**
 * Configura efeitos de hover para os cards de notícias
 */
function setupNewsCardEffects() {
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card-title')?.classList.add('hover-title');
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.card-title')?.classList.remove('hover-title');
        });
    });
}

/**
 * Configura o comportamento do botão "Carregar mais"
 */
function setupLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-button');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Adicionar classe de loading
        this.classList.add('loading');
        
        // Exemplo: simular carregamento
        setTimeout(() => {
            // Aqui você normalmente faria uma requisição AJAX para carregar mais notícias
            console.log('Carregando mais notícias...');
            
            // Após carregar, remover a classe de loading
            this.classList.remove('loading');
            
            // Exemplo: adicionar uma mensagem quando não há mais notícias
            const totalLoadedItems = document.querySelectorAll('.news-item').length;
            if (totalLoadedItems >= 6) {
                this.innerHTML = 'Não há mais notícias para carregar';
                this.disabled = true;
                this.classList.add('disabled');
            }
        }, 1000);
    });
}
