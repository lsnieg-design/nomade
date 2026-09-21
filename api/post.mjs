import { json, publicPost, readPosts } from '../lib/cms.mjs';

export async function GET(request) {
  try {
    const slug = new URL(request.url).searchParams.get('slug') || '';
    if (!slug) return json({ ok: false, error: 'Falta el slug.' }, 400);
    const { posts } = await readPosts();
    const post = posts.find(item => item && item.slug === slug && item.published);
    if (!post) return json({ ok: false, error: 'No encontré ese escrito.' }, 404);
    return json({ ok: true, post: publicPostWithContent(post) }, 200, { 'cache-control': 'no-store' });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo cargar el escrito.' }, 500);
  }
}

function publicPostWithContent(post) {
  return {
    ...publicPost(post),
    contentDelta: Array.isArray(post.contentDelta) ? post.contentDelta : [],
  };
}
