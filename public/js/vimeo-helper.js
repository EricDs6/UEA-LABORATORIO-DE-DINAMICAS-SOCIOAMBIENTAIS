/**
 * Script auxiliar para gerenciar vídeos do Vimeo
 */
(function() {
    // Carregar script do Vimeo
    function loadVimeoScript() {
        if (document.querySelector('script[src="https://player.vimeo.com/api/player.js"]')) {
            return; // Script já carregado
        }
        
        console.log('Carregando script do Vimeo dinamicamente');
        const script = document.createElement('script');
        script.src = "https://player.vimeo.com/api/player.js";
        script.async = true;
        script.onload = function() {
            console.log('Script do Vimeo carregado com sucesso');
            initializeVimeoPlayers();
        };
        document.body.appendChild(script);
    }
    
    // Inicializar todos os players Vimeo na página
    function initializeVimeoPlayers() {
        const vimeoIframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
        console.log(`Encontrados ${vimeoIframes.length} iframes Vimeo`);
        
        if (!vimeoIframes.length) return;
        
        // Verificar se a API Vimeo está disponível
        if (typeof Vimeo === 'undefined') {
            console.warn('API Vimeo não está disponível ainda');
            setTimeout(initializeVimeoPlayers, 1000);
            return;
        }
        
        vimeoIframes.forEach((iframe, index) => {
            try {
                // Certificar-se que o iframe está visível
                iframe.style.display = 'block';
                
                // Inicializar o player
                const player = new Vimeo.Player(iframe);
                player.on('loaded', function() {
                    console.log(`Player #${index + 1} carregado com sucesso`);
                });
                
                player.on('error', function(error) {
                    console.error(`Erro no player #${index + 1}:`, error);
                });
                
                // Atualizar src para forçar recarregamento se necessário
                if (iframe.dataset.fixAttempt !== 'true') {
                    const currentSrc = iframe.src;
                    iframe.src = '';
                    setTimeout(() => {
                        iframe.src = currentSrc;
                        iframe.dataset.fixAttempt = 'true';
                    }, 100);
                }
            } catch (e) {
                console.error(`Erro ao inicializar o player Vimeo #${index + 1}:`, e);
            }
        });
    }
    
    // Executar em diferentes momentos para garantir inicialização
    function setupVimeoPlayers() {
        loadVimeoScript();
        
        // Tentar inicializar imediatamente
        initializeVimeoPlayers();
        
        // E também após um curto delay
        setTimeout(initializeVimeoPlayers, 1000);
        
        // E após carregamento completo da página
        window.addEventListener('load', function() {
            setTimeout(initializeVimeoPlayers, 1500);
        });
    }
    
    // Iniciar o processo
    setupVimeoPlayers();
})();
