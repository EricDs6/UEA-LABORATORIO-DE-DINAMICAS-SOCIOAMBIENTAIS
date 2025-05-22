document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const status = document.getElementById('uploadStatus');
    const newsList = document.getElementById('newsList');

    async function handleSubmit(e) {
        e.preventDefault();
        status.innerHTML = '<div class="alert alert-info">Enviando...</div>';

        try {
            const formData = new FormData();
            const files = document.getElementById('fileInput').files;
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const date = document.getElementById('date').value;
            const partners = document.getElementById('partners').value;

            for (let file of files) {
                formData.append('files', file);
            }
            formData.append('title', title);
            formData.append('content', content);
            formData.append('date', date);
            formData.append('partners', partners);

            const response = await fetch('/api/routes/news', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                status.innerHTML = '<div class="alert alert-success">Notícia publicada com sucesso!</div>';
                form.reset();
                loadNews();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            status.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
        }
    }

    async function loadNews() {
        try {
            const response = await fetch('/data/news.json');
            const data = await response.json();
            renderNews(data.news);
        } catch (error) {
            console.error('Erro ao carregar notícias:', error);
        }
    }

    function renderNews(news) {
        newsList.innerHTML = news.map(item => `
            <div class="col-md-4">
                <div class="card news-item">
                    <img src="${item.images[0]}" class="news-thumbnail" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text small">${item.date}</p>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Adicionar listeners para botões de exclusão
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    async function handleDelete(e) {
        const id = e.target.dataset.id;
        if (!confirm('Deseja realmente excluir esta notícia?')) return;

        try {
            const response = await fetch(`/api/routes/news?id=${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadNews();
                status.innerHTML = '<div class="alert alert-success">Notícia excluída com sucesso!</div>';
            } else {
                throw new Error('Erro ao excluir notícia');
            }
        } catch (error) {
            status.innerHTML = `<div class="alert alert-danger">Erro: ${error.message}</div>`;
        }
    }

    form.addEventListener('submit', handleSubmit);
    loadNews();
});
