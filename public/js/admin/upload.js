import { uploadImage } from '../../../config/blob-storage.js';

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('uploadStatus');
    const files = document.getElementById('fileInput').files;

    try {
        status.innerHTML = '<div class="alert alert-info">Enviando...</div>';
        
        for (const file of files) {
            const filename = `news/${Date.now()}-${file.name}`;
            const url = await uploadImage(file, filename);
            
            status.innerHTML += `
                <div class="alert alert-success">
                    Arquivo enviado: ${file.name}<br>
                    URL: <a href="${url}" target="_blank">${url}</a>
                </div>
            `;
        }
    } catch (error) {
        status.innerHTML = `
            <div class="alert alert-danger">
                Erro ao enviar: ${error.message}
            </div>
        `;
    }
});
