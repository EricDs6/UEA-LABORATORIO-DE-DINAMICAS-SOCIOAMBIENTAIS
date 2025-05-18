const lista = document.getElementById('lista-noticias');
const form = document.getElementById('formulario');

let noticias = [];

fetch('data/noticias.json')
  .then(res => res.json())
  .then(data => {
    noticias = data;
    atualizarLista();
  });

form.addEventListener('submit', e => {
  e.preventDefault();
  const nova = {
    titulo: document.getElementById('titulo').value,
    resumo: document.getElementById('resumo').value,
    imagem: document.getElementById('imagem').value
  };
  noticias.push(nova);
  atualizarLista();
  salvar();
});

function atualizarLista() {
  lista.innerHTML = '';
  noticias.forEach((n, i) => {
    const li = document.createElement('li');
    li.textContent = `${n.titulo} - ${n.resumo}`;
    lista.appendChild(li);
  });
}

function salvar() {
  fetch('/salvar-noticias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noticias)
  })
  .then(res => res.ok ? alert('Salvo!') : alert('Erro ao salvar'));
}
