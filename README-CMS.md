# NÓMADE · CMS de Escritos

Esta carpeta agrega un mini CMS para publicar el blog sin editar GitHub a mano.

## Qué incluye

- `/escritos` → blog público.
- `/escritos/<slug>` → artículo individual.
- `/admin` → editor privado.
- Editor visual con vista previa en vivo.
- Portada con compresión de imagen.
- Borradores y publicaciones.
- Contenido guardado en `content/posts.json` mediante GitHub.
- Imágenes guardadas en `media/posts/` mediante GitHub.

## Variables de entorno en Vercel

```text
GITHUB_OWNER=tu_usuario_o_organizacion
GITHUB_REPO=nombre-del-repo
GITHUB_BRANCH=main
GITHUB_TOKEN=token_de_GitHub
ADMIN_PASSWORD=una_clave_larga
SESSION_SECRET=una_cadena_larga_y_aleatoria
GITHUB_COMMITTER_NAME=Lucía Snieg
GITHUB_COMMITTER_EMAIL=tu-correo@example.com
```

El token de GitHub no va en el navegador: queda solamente como variable de entorno de la función de Vercel.
Para modificar archivos, GitHub requiere permisos de contenido de escritura en el repositorio; los tokens granulares pueden usar `Contents: write`. 

## Primer uso

1. Subir estos archivos a la raíz del repositorio, respetando carpetas.
2. Agregar las variables en Vercel → Settings → Environment Variables.
3. Volver a desplegar.
4. Entrar a `/admin`.
5. Crear el primer escrito y publicar.

## Importante

El sistema está pensado para un solo editor. Cada publicación actualiza `content/posts.json` serialmente a través de la API de GitHub.
