self.addEventListener('install', event => {
    console.log('ServiceWorker instalado');
    // Adicione arquivos ao cache se necessário
});

self.addEventListener('activate', event => {
    console.log('ServiceWorker ativado');
    // Limpe caches antigos se necessário
});

self.addEventListener('fetch', event => {
    console.log('Interceptando requisição para:', event.request.url);
    // Adicione lógica de cache se necessário
});
