// Integração Sanity para sites estáticos (UMD)
// Adicione este script no final do <body> do noticias.html
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@sanity/client@5.18.2/dist/sanityClient.umd.min.js';
  script.onload = function() {
    var client = sanityClient({
      projectId: 'c57wcy5u', // Seu Project ID
      dataset: 'production',
      apiVersion: '2023-01-01',
      useCdn: true
    });
    client.fetch(`*[_type == "post"]|order(publishedAt desc)[0...10]{
      title,
      slug,
      publishedAt,
      "imageUrl": mainImage.asset->url,
      body
    }`).then(function(posts) {
      var container = document.getElementById('noticias-list');
      if (!container) return;
      if (!posts.length) {
        container.innerHTML = '<p>Nenhuma notícia encontrada.</p>';
        return;
      }
      container.innerHTML = posts.map(function(post) {
        return `<article style="margin-bottom:2em;">
          <h2>${post.title}</h2>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="${post.title}" style="max-width:300px;">` : ''}
          <p><small>${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : ''}</small></p>
          <div>${post.body && post.body[0] && post.body[0].children ? post.body[0].children.map(function(c){return c.text}).join(' ') : ''}</div>
        </article>`;
      }).join('');
    });
  };
  document.body.appendChild(script);
})();
