import { config, json, makeSession, sessionCookie } from '../lib/cms.mjs';

export async function POST(request) {
  try {
    const { adminPassword, sessionSecret } = config();
    const body = await request.json().catch(() => ({}));
    const password = String(body.password || '');
    if (!password || password !== adminPassword) {
      return json({ ok: false, error: 'Contraseña incorrecta.' }, 401);
    }
    return json({ ok: true }, 200, { 'set-cookie': sessionCookie(request, makeSession(sessionSecret)) });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo iniciar sesión.' }, 500);
  }
}
