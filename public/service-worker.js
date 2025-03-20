self.addEventListener('install', event => {
    self.skipWaiting(); // Força a ativação imediata
    console.log('ServiceWorker instalado');
    // Adicione arquivos ao cache se necessário
});

self.addEventListener('activate', event => {
    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cache => {
                if (cache !== 'nome-do-novo-cache') {
                    return caches.delete(cache);
                }
            })
        );
    });
    console.log('ServiceWorker ativado');
    // Limpe caches antigos se necessário
});

self.addEventListener('fetch', event => {
    console.log('Interceptando requisição para:', event.request.url);
    // Adicione lógica de cache se necessário
});
