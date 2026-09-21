import crypto from 'node:crypto';

const GITHUB_API = 'https://api.github.com';
const API_VERSION = '2026-03-10';
const SESSION_COOKIE = 'nomade_admin';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function env(name, fallback = '') {
  return process.env[name] || fallback;
}

export function config() {
  const owner = env('GITHUB_OWNER');
  const repo = env('GITHUB_REPO');
  const token = env('GITHUB_TOKEN');
  const branch = env('GITHUB_BRANCH', 'main');
  const sessionSecret = env('SESSION_SECRET');
  const adminPassword = env('ADMIN_PASSWORD');
  if (!owner || !repo || !token || !sessionSecret || !adminPassword) {
    throw new Error('Faltan variables de entorno del CMS.');
  }
  return { owner, repo, token, branch, sessionSecret, adminPassword };
}

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function parseCookies(request) {
  const header = request.headers.get('cookie') || '';
  return Object.fromEntries(
    header
      .split(';')
      .map(part => part.trim())
      .filter(Boolean)
      .map(part => {
        const index = part.indexOf('=');
        return index === -1 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function makeSession(secret) {
  const payload = JSON.stringify({
    iat: Date.now(),
    exp: Date.now() + SESSION_TTL_SECONDS * 1000,
  });
  const encoded = base64url(payload);
  return `${encoded}.${sign(encoded, secret)}`;
}

export function isValidSession(request, secret) {
  const value = parseCookies(request)[SESSION_COOKIE];
  if (!value) return false;
  const [encoded, providedSignature] = value.split('.');
  if (!encoded || !providedSignature) return false;
  const expectedSignature = sign(encoded, secret);
  try {
    const a = Buffer.from(providedSignature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return Number.isFinite(payload.exp) && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function requireAuth(request) {
  const { sessionSecret } = config();
  return isValidSession(request, sessionSecret);
}

export function sessionCookie(request, value) {
  const secure = new URL(request.url).protocol === 'https:';
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function clearSessionCookie(request) {
  const secure = new URL(request.url).protocol === 'https:';
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
}

function githubHeaders(token) {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'x-github-api-version': API_VERSION,
    'user-agent': 'nomade-cms',
  };
}

function githubUrl(path, owner, repo) {
  return `${GITHUB_API}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
}

export async function getRepoFile(path) {
  const { owner, repo, token, branch } = config();
  const url = `${githubUrl(path, owner, repo)}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, { headers: githubHeaders(token), cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub GET ${path}: ${response.status} ${body}`);
  }
  const data = await response.json();
  const content = Buffer.from((data.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
  return { sha: data.sha, content, metadata: data };
}

export async function putRepoFile(path, contentBuffer, message, mimeType = 'application/octet-stream', sha = undefined) {
  const { owner, repo, token, branch } = config();
  const body = {
    message,
    content: Buffer.from(contentBuffer).toString('base64'),
    branch,
    committer: {
      name: env('GITHUB_COMMITTER_NAME', 'NÓMADE'),
      email: env('GITHUB_COMMITTER_EMAIL', 'nomade@localhost'),
    },
  };
  if (sha) body.sha = sha;
  const response = await fetch(githubUrl(path, owner, repo), {
    method: 'PUT',
    headers: { ...githubHeaders(token), 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GitHub PUT ${path}: ${response.status} ${details}`);
  }
  const data = await response.json();
  return { ...data, mimeType };
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export function normalizePost(input, existing = {}) {
  const title = String(input.title || '').trim();
  const slug = slugify(input.slug || title);
  if (!title || !slug) throw new Error('El título es obligatorio.');

  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(input.date || ''))
    ? String(input.date)
    : new Date().toISOString().slice(0, 10);

  const delta = Array.isArray(input.contentDelta) ? input.contentDelta : [];
  const tags = Array.isArray(input.tags)
    ? input.tags.map(x => String(x).trim()).filter(Boolean).slice(0, 10)
    : [];

  return {
    id: existing.id || crypto.randomUUID(),
    slug,
    title,
    excerpt: String(input.excerpt || '').trim().slice(0, 500),
    category: String(input.category || 'General').trim().slice(0, 80),
    date,
    cover: String(input.cover || '').trim(),
    tags,
    contentDelta: delta,
    published: Boolean(input.published),
    updatedAt: new Date().toISOString(),
  };
}

export async function readPosts() {
  const file = await getRepoFile('content/posts.json');
  if (!file) return { posts: [], sha: null };
  let parsed;
  try {
    parsed = JSON.parse(file.content);
  } catch {
    throw new Error('content/posts.json no contiene JSON válido.');
  }
  const posts = Array.isArray(parsed) ? parsed : [];
  return { posts, sha: file.sha };
}

export async function writePosts(posts, sha) {
  const jsonContent = JSON.stringify(posts, null, 2) + '\n';
  return putRepoFile(
    'content/posts.json',
    Buffer.from(jsonContent, 'utf8'),
    `CMS: actualizar escritos (${posts.length} publicados/borradores)`,
    'application/json',
    sha || undefined
  );
}

export function publicPost(post) {
  const { contentDelta: _delta, ...rest } = post;
  return rest;
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS };
