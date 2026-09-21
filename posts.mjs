import { json, publicPost, readPosts } from '../lib/cms.mjs';

export async function GET() {
  try {
    const { posts } = await readPosts();
    const published = posts
      .filter(post => post && post.published)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .map(publicPost);
    return json({ ok: true, posts: published }, 200, { 'cache-control': 'no-store' });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudieron cargar los escritos.' }, 500);
  }
}
