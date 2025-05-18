// Script para carregar notícias da pasta data/noticias e exibir na página principal
async function fetchNoticias() {
  const noticiasContainer = document.getElementById('noticias-container');
  if (!noticiasContainer) return;

  // Lista de arquivos de notícias (em produção, use API ou gere lista via build)
  const arquivos = [
    '/data/noticias/exemplo.md'
    // Adicione mais arquivos conforme necessário
  ];

  for (const arquivo of arquivos) {
    try {
      const resp = await fetch(arquivo);
      if (!resp.ok) continue;
      const texto = await resp.text();
      const noticia = parseMarkdown(texto);
      noticiasContainer.innerHTML += renderNoticia(noticia);
    } catch (e) {
      console.error('Erro ao carregar notícia:', arquivo, e);
    }
  }
}

// Função simples para extrair frontmatter YAML e corpo Markdown
function parseMarkdown(md) {
  const match = md.match(/^---([\s\S]*?)---([\s\S]*)$/);
  if (!match) return { title: '', date: '', summary: '', cover: '', body: md };
  const yaml = match[1];
  const body = match[2];
  const obj = {};
  yaml.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) obj[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
  });
  obj.body = body.trim();
  return obj;
}

function renderNoticia(noticia) {
  return `<div class="col-md-6">
    <div class="card news-card h-100 shadow-sm">
      ${noticia.cover ? `<img src="${noticia.cover}" class="card-img-top" alt="${noticia.title}">` : ''}
      <div class="card-body">
        <h5 class="card-title">${noticia.title}</h5>
        <p class="card-text text-muted mb-1"><small>${new Date(noticia.date).toLocaleDateString('pt-BR')}</small></p>
        <p class="card-text">${noticia.summary}</p>
        <div class="card-text">${marked.parse(noticia.body)}</div>
      </div>
    </div>
  </div>`;
}

document.addEventListener('DOMContentLoaded', fetchNoticias);
