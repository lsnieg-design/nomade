import { json, putRepoFile, requireAuth, slugify } from '../lib/cms.mjs';

export async function POST(request) {
  if (!requireAuth(request)) return json({ ok: false, error: 'No autorizado.' }, 401);
  try {
    const body = await request.json();
    const dataUrl = String(body.dataUrl || '');
    const name = slugify(body.name || 'imagen');
    if (!dataUrl.startsWith('data:image/')) return json({ ok: false, error: 'La imagen no es válida.' }, 400);

    const match = dataUrl.match(/^data:(image\/(?:webp|jpeg|png));base64,(.+)$/i);
    if (!match) return json({ ok: false, error: 'Solo se aceptan WebP, JPG o PNG.' }, 400);

    const mime = match[1].toLowerCase();
    const buffer = Buffer.from(match[2], 'base64');
    if (buffer.length > 2_500_000) return json({ ok: false, error: 'La imagen comprimida pesa más de 2,5 MB.' }, 413);

    const extension = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${name}-${Date.now()}.${extension}`;
    const path = `media/posts/${filename}`;
    await putRepoFile(path, buffer, `CMS: subir imagen ${filename}`, mime);

    return json({ ok: true, path: `/${path}` });
  } catch (error) {
    return json({ ok: false, error: error.message || 'No se pudo subir la imagen.' }, 500);
  }
}
