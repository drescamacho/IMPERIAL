# CD Imperial · Web oficial

Web oficial del **Club Deportivo Imperial**: un club de raíces peruanas nacido en Madrid. *Del barrio al fútbol profesional.*

Es una web estática (HTML + CSS + JS, sin dependencias ni compilación). Se puede publicar tal cual en GitHub Pages, Netlify, Vercel o cualquier hosting.

## Estructura

```
index.html              Página de inicio (hero, cifras, proyecto, ambición, comunidad, noticias, patrocinadores)
assets/css/styles.css   Sistema visual (paleta, tipografías, componentes, responsive)
assets/js/config.js     CONTENIDO EDITABLE: cifras de redes, enlaces, noticias, patrocinadores
assets/js/main.js       Interacciones: menú, apariciones, contadores, parallax, render de contenido
assets/img/             Escudo (rojo y blanco, fondo transparente) y fotografías oficiales
```

## Editar contenido (sin tocar el diseño)

Todo se edita en `assets/js/config.js`:

- **Cifras de redes**: `stats` (TikTok e Instagram son aproximadas).
- **WhatsApp**: rellenar `links.whatsapp` con el enlace de la comunidad. Mientras esté vacío, el botón lleva a Instagram.
- **Patrocinios**: `links.sponsorEmail`. Si está vacío, el botón abre un mensaje directo de Instagram.
- **Noticias**: `news` (se muestran las 3 primeras). Las actuales son **contenido de ejemplo** y lo indican en pantalla (`example: true`).
- **Patrocinadores**: `sponsors`. Añadir solo marcas con autorización. Si la lista está vacía, se ven huecos de "Tu marca aquí".

Más adelante este archivo se puede cambiar por la API de un CMS headless (Strapi, Sanity, WordPress) sin rehacer el diseño.

## Ver en local

Abrir `index.html` en el navegador o ejecutar `npx serve .`.
