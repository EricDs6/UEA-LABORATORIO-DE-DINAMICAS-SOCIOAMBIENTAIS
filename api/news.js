import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
    const newsPath = join(process.cwd(), 'public/data/news.json');

    try {
        switch (req.method) {
            case 'GET':
                const newsData = JSON.parse(readFileSync(newsPath, 'utf8'));
                return res.status(200).json(newsData);

            case 'POST':
                const currentNews = JSON.parse(readFileSync(newsPath, 'utf8'));
                const newNews = {
                    id: Date.now().toString(),
                    ...req.body,
                    createdAt: new Date().toISOString()
                };
                
                currentNews.news.unshift(newNews); // Adiciona no início do array
                writeFileSync(newsPath, JSON.stringify(currentNews, null, 2));
                
                return res.status(201).json(newNews);

            case 'DELETE':
                const { id } = req.query;
                const newsToUpdate = JSON.parse(readFileSync(newsPath, 'utf8'));
                newsToUpdate.news = newsToUpdate.news.filter(news => news.id !== id);
                
                writeFileSync(newsPath, JSON.stringify(newsToUpdate, null, 2));
                return res.status(200).json({ success: true });

            default:
                return res.status(405).json({ error: 'Método não permitido' });
        }
    } catch (error) {
        console.error('Erro na API:', error);
        return res.status(500).json({ error: error.message });
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};
