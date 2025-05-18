fetch('data/noticias.json')
  .then(res => res.json())
  .then(noticias => {
    const container = document.getElementById('noticias-container');
    noticias.forEach(noticia => {
      const card = `
        <div class="col-md-6 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="${noticia.imagem}" class="card-img-top" alt="${noticia.titulo}">
            <div class="card-body">
              <h5 class="card-title">${noticia.titulo}</h5>
              <p class="card-text">${noticia.resumo}</p>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  });
