import { listImages } from '../../config/blob-storage.js';

document.addEventListener('DOMContentLoaded', async function() {
    const loadMoreBtn = document.getElementById('loadMoreNews');
    const newsGrid = document.querySelector('.news-grid');
    let currentPage = 1;
    const itemsPerPage = 6;

    async function loadNewsFromStorage() {
        try {
            // Carregar imagens do Blob Storage
            const blobs = await listImages();
            const newsData = await fetch('/data/news.json');
            const newsJson = await newsData.json();
            
            // Combinar dados do JSON com URLs do Blob Storage
            const combinedNews = newsJson.news.map(news => {
                if (news.type === 'single') {
                    const blob = blobs.find(b => b.pathname.includes(news.image));
                    return {
                        ...news,
                        image: blob ? blob.url : news.image
                    };
                }
                return news;
            });

            return combinedNews;
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
            return [];
        }
    }

    // ... resto do código existente ...
});
