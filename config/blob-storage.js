import { put, list, del } from "@vercel/blob";

export async function uploadImage(file, filename) {
    try {
        // Criar um FormData para enviar o arquivo
        const formData = new FormData();
        formData.append('file', file);

        // Fazer o upload através da API do Vercel Blob
        const response = await fetch(`/api/upload?filename=${filename}`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer upload');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
}

export async function listImages() {
    try {
        const { blobs } = await list();
        return blobs;
    } catch (error) {
        console.error('Erro ao listar imagens:', error);
        throw error;
    }
}

export async function deleteImage(filename) {
    try {
        await del(filename);
        return true;
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        throw error;
    }
}
