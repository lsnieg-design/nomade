# Cómo integrar con la web actual

Copiá el contenido de esta carpeta a la raíz de tu repositorio NÓMADE, manteniendo la carpeta `api/`, `lib/`, `content/` y `media/`.

No reemplaza tu `index.html`, `nomade.html`, `acompanamiento.html` ni su CSS. `escritos.html` es la nueva página del blog y `admin.html` es el editor privado.

La carpeta trae copias de `style.css` y `script.js` de la base actual para que puedas probar el paquete de manera autónoma; en tu repo podés mantener tus archivos ya existentes si son los mismos.

`vercel.json` del paquete agrega las rutas `/escritos`, `/escritos/:slug` y `/admin` a las páginas correspondientes.
