import { json, normalizePost, publicPost, readPosts, requireAuth, writePosts } from '../lib/cms.mjs';

export async function GET(request) {
  if (!requireAuth(request)) return json({ ok: false, error: 'No autorizado.' }, 401);
  try {
    const { posts } = await readPosts();
    return json({ ok: true, posts: posts.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))) });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudieron cargar los escritos.' }, 500);
  }
}

export async function POST(request) {
  if (!requireAuth(request)) return json({ ok: false, error: 'No autorizado.' }, 401);
  try {
    const input = await request.json();
    const { posts, sha } = await readPosts();
    const slug = String(input.slug || input.title || '').trim();
    if (posts.some(post => post.slug === slug && post.id !== input.id)) {
      return json({ ok: false, error: 'Ya existe un escrito con ese slug.' }, 409);
    }
    const normalized = normalizePost(input);
    if (posts.some(post => post.slug === normalized.slug)) {
      return json({ ok: false, error: 'Ya existe un escrito con ese slug.' }, 409);
    }
    posts.push(normalized);
    await writePosts(posts, sha);
    return json({ ok: true, post: normalized });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo publicar el escrito.' }, 500);
  }
}

export async function PUT(request) {
  if (!requireAuth(request)) return json({ ok: false, error: 'No autorizado.' }, 401);
  try {
    const input = await request.json();
    if (!input.id) return json({ ok: false, error: 'Falta el id del escrito.' }, 400);
    const { posts, sha } = await readPosts();
    const index = posts.findIndex(post => post.id === input.id);
    if (index === -1) return json({ ok: false, error: 'No encontré ese escrito.' }, 404);
    const normalized = normalizePost(input, posts[index]);
    if (posts.some(post => post.slug === normalized.slug && post.id !== normalized.id)) {
      return json({ ok: false, error: 'Ya existe un escrito con ese slug.' }, 409);
    }
    posts[index] = normalized;
    await writePosts(posts, sha);
    return json({ ok: true, post: normalized });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo actualizar el escrito.' }, 500);
  }
}

export async function DELETE(request) {
  if (!requireAuth(request)) return json({ ok: false, error: 'No autorizado.' }, 401);
  try {
    const body = await request.json().catch(() => ({}));
    const { posts, sha } = await readPosts();
    const next = posts.filter(post => post.id !== body.id);
    if (next.length === posts.length) return json({ ok: false, error: 'No encontré ese escrito.' }, 404);
    await writePosts(next, sha);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo eliminar el escrito.' }, 500);
  }
}
