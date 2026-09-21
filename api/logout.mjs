import { clearSessionCookie, json } from '../lib/cms.mjs';

export async function POST(request) {
  return json({ ok: true }, 200, { 'set-cookie': clearSessionCookie(request) });
}
