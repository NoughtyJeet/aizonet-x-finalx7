import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Define the shape of our BlogPost to match Supabase
interface Author {
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
}

interface BlogPost {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    author: Author;
    date: string;
    imageUrl: string;
    category: string;
    tags: string[];
    metaTitle: string;
    metaDescription: string;
}

const AUTHOR: Author = {
    name: 'Admin',
    role: 'AI Editor',
    bio: 'Expert in AI tools and productivity.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
};

const blogDir = path.join(process.cwd(), 'content', 'blog');
const files = fs.readdirSync(blogDir);

let sqlStatements = `
-- Insert Script for SEO Blog Posts
-- Run this in your Supabase SQL Editor
`;

files.forEach(file => {
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');

    // Basic frontmatter parser handling \r\n on Windows
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

    if (frontmatterMatch) {
        const fm = frontmatterMatch[1];
        let body = frontmatterMatch[2].trim();

        const titleMatch = fm.match(/title:\s*"(.*?)"/);
        const descMatch = fm.match(/meta_description:\s*"(.*?)"/);
        const dateMatch = fm.match(/date:\s*"(.*?)"/);

        // Extract slug from filename
        const slug = file.replace('.md', '');

        const title = titleMatch ? titleMatch[1] : '';
        const excerpt = descMatch ? descMatch[1] : '';
        const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];

        // Escape single quotes for SQL
        const escapeSql = (str: string) => str.replace(/'/g, "''");

        const post: BlogPost = {
            title,
            slug,
            excerpt,
            content: body,
            author: AUTHOR,
            date,
            imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            category: 'AI Tools Reviews',
            tags: ['AI', 'Productivity'],
            metaTitle: title,
            metaDescription: excerpt
        };

        sqlStatements += `
INSERT INTO posts (id, title, slug, excerpt, content, author, date, "imageUrl", category, tags, "metaTitle", "metaDescription")
VALUES (
  '${crypto.randomUUID()}',
  '${escapeSql(post.title)}',
  '${escapeSql(post.slug)}',
  '${escapeSql(post.excerpt)}',
  '${escapeSql(post.content)}',
  '${JSON.stringify(post.author)}'::jsonb,
  '${post.date}',
  '${escapeSql(post.imageUrl)}',
  '${escapeSql(post.category)}',
  '["AI", "Productivity"]'::jsonb,
  '${escapeSql(post.metaTitle)}',
  '${escapeSql(post.metaDescription)}'
) ON CONFLICT (slug) DO NOTHING;
`;
    }
});

fs.writeFileSync('generate_blog_sql.sql', sqlStatements);
console.log('Successfully generated generate_blog_sql.sql');
