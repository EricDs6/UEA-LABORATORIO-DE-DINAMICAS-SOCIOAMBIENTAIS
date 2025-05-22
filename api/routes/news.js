import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        const data = await req.formData();
        const files = data.getAll('files');
        const title = data.get('title');
        const content = data.get('content');
        const date = data.get('date');
        const partners = data.get('partners').split(',');

        const urls = [];
        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `news/${Date.now()}-${file.name}`;
            
            const { url } = await put(filename, buffer, {
                access: 'public',
            });
            urls.push(url);
        }

        // Atualizar news.json
        const newsPath = path.join(process.cwd(), 'public/data/news.json');
        const newsData = JSON.parse(await fs.readFile(newsPath, 'utf8'));
        
        const newNews = {
            id: Date.now().toString(),
            type: files.length > 1 ? 'carousel' : 'single',
            images: urls,
            title,
            content,
            date,
            partners: partners.map(p => ({ tag: p.trim() })),
            createdAt: new Date().toISOString()
        };

        newsData.news.unshift(newNews);
        await fs.writeFile(newsPath, JSON.stringify(newsData, null, 2));

        return NextResponse.json({ success: true, news: newNews });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
