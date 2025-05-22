import { put, list, del } from "@vercel/blob";

const STORE_ID = "LDS-STORAGE";

export async function uploadImage(file, filename) {
    try {
        const { url } = await put(filename, file, {
            access: 'public',
            addRandomSuffix: false
        });
        return url;
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
