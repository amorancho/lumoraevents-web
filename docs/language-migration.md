# Migración del idioma principal a español

## Decisión definitiva e infraestructura

La web corporativa se aloja en GitHub Pages. Cloudflare gestiona únicamente DNS, sin proxy. No se utilizan Cloudflare Pages ni Workers, ni se añade ningún mecanismo de redirección para las URLs retiradas.

El español es el idioma principal sin prefijo y el inglés se sirve bajo `/en/`. Se acepta que Google vuelva a rastrear e indexar las URLs definitivas. Esta revisión mantiene las páginas y el SEO ya implementados y elimina únicamente los restos de la propuesta anterior de redirecciones.

No se ha hecho commit, push ni despliegue de este ajuste, ni se ha cambiado la configuración de producción.

## Configuración y artefacto de publicación

- `astro.config.mjs` mantiene `output: "static"`, `trailingSlash: "always"` y `@astrojs/sitemap`.
- El comando `npm run build` genera `dist/` desde la raíz del repositorio.
- `.github/workflows/deploy.yml` usa `withastro/action` para construir y subir el artefacto, y `actions/deploy-pages` para publicarlo. No añade rewrites, redirecciones ni un fallback al inicio.
- `public/CNAME` conserva `lumoraevents.net`. No se modifica la aplicación SaaS ni sus subdominios.
- `src/pages/404.astro` genera `dist/404.html` con contenido español, `noindex` y enlace al inicio. Se muestra como página de error; no se copia `index.html` sobre ella ni se generan páginas antiguas que devuelvan 200.
- No hay Pages Functions, middleware, Worker ni configuración de fallback de aplicación en el repositorio.
- El artefacto contiene exactamente diez páginas finales y `404.html`, además de assets, robots, sitemap, manifiesto, CNAME y `llms.txt`. No contiene las páginas retiradas ni `_redirects`.

El panel privado de GitHub Pages no se ha podido consultar mediante la API sin autenticar. Se ha revisado el workflow del repositorio y comprobado el comportamiento HTTP público, incluida una ruta inexistente, para descartar respuestas de error con estado 200.

## URLs finales

Todas las URLs siguientes tienen HTTP 200 en la prueba local y en la comprobación pública realizada durante esta revisión.

| Página     | Español        | Inglés         |
| ---------- | -------------- | -------------- |
| Inicio     | `/`            | `/en/`         |
| Nosotros   | `/nosotros/`   | `/en/about/`   |
| Contacto   | `/contacto/`   | `/en/contact/` |
| Privacidad | `/privacidad/` | `/en/privacy/` |
| Cookies    | `/cookies/`    | `/en/cookies/` |

`/` y `/cookies/` conservan sus URLs y muestran español. Sus versiones inglesas están en `/en/` y `/en/cookies/`. No se redirigen las URLs reutilizadas.

## URLs retiradas

| URL retirada      | Comportamiento definitivo |
| ----------------- | ------------------------- |
| `/es/`            | HTTP 404                  |
| `/es/nosotros/`   | HTTP 404                  |
| `/es/contacto/`   | HTTP 404                  |
| `/es/privacidad/` | HTTP 404                  |
| `/es/cookies/`    | HTTP 404                  |
| `/about/`         | HTTP 404                  |
| `/contact/`       | HTTP 404                  |
| `/privacy/`       | HTTP 404                  |

También se comprueban las variantes sin barra final y las peticiones GET/HEAD. No se implementan 301, 302, redirecciones JavaScript ni meta refresh. `robots.txt` permite rastrear estas URLs para que los buscadores observen el estado 404.

## SEO y comportamiento conservados

- Canonical absoluto y autorreferencial en cada página final, sin canonical cruzado entre idiomas.
- Hreflang `es` y `en` recíprocos y autorreferenciales para cada pareja. El `x-default` existente apunta a la versión española equivalente.
- `html lang`, títulos y descripciones específicos de cada idioma; Open Graph con URL, título, descripción e idioma coherentes.
- Sitemap generado con únicamente las diez URLs finales, sin páginas retiradas ni 404. `robots.txt` permite `/` y anuncia `sitemap-index.xml`.
- Enlaces internos y selectores de escritorio y móvil conservan las equivalencias entre idiomas.
- No hay referencias al prefijo español retirado como ruta vigente en el HTML, los enlaces, datos estructurados o `llms.txt`.
- No se modifican diseño, traducciones, consentimiento de cookies, Analytics ni enlaces al SaaS. Las páginas esenciales se generan en HTML durante el build.

Las menciones a URLs retiradas en esta guía y en las pruebas documentan el comportamiento 404; no son enlaces de navegación ni URLs indexables.

## Archivos de este ajuste

| Archivo                             | Cambio                                                                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public/_redirects`                 | Eliminado                                                                                                                                                   |
| `tests/language-migration.test.mjs` | Retirada la lógica de Cloudflare Pages; se comprueban 404 reales, ausencia de mecanismos de redirección, inventario de HTML y enlaces finales de `llms.txt` |
| `README.md`                         | Infraestructura de GitHub Pages y decisión sin redirecciones                                                                                                |
| `docs/language-migration.md`        | Guía actualizada con la decisión definitiva y las comprobaciones                                                                                            |

`redirects-worker.mjs` y `hosting/wrangler.json` ya estaban eliminados. No se recrean ni se conservan instrucciones para activarlos.

## Comprobaciones ejecutadas

```bash
npm run check
npm test
```

`npm test` construye el sitio y ejecuta 14 pruebas con un servidor temporal de Astro preview, que se cierra al terminar. Verifica:

- HTTP 200, H1 y SEO de las diez páginas finales, incluidos inicio y cookies en español.
- Canonical, hreflang, Open Graph, JSON-LD, enlaces y selectores de idioma en ambas direcciones.
- HTTP 404 sin cabecera Location en las ocho rutas retiradas y rutas desconocidas, con/sin barra, con/sin query string y con GET/HEAD.
- Inventario exacto de HTML y ausencia de reglas, Worker, meta refresh o navegación JavaScript que implemente redirecciones.
- `llms.txt` con las diez páginas finales, sitemap, robots, manifiesto y 404 sin canonical/hreflang.

El build y las 14 pruebas pasan. Astro check pasa sin errores ni advertencias. Se comprueba el formato de los archivos modificados, sin reformatear archivos ajenos al ajuste.

También se ha realizado una revisión de solo lectura del dominio público: diez páginas con 200 y SEO coherente; 32 peticiones GET/HEAD a las 16 variantes antiguas con 404 sin Location; dos URLs desconocidas con 404; sitemap y robots correctos. El servidor se identifica como GitHub.com. Estos resultados describen la publicación existente; no implican que se haya desplegado este ajuste local.

## Publicación y pendientes

No se necesita activar el proxy, crear Workers ni añadir reglas manuales en Cloudflare. No se ha ejecutado ningún despliegue.

Cuando se apruebe la publicación, el workflow de GitHub Pages debe publicar el nuevo artefacto completo para retirar también `_redirects` del resultado servido. El push a `main` ya dispara ese workflow, por lo que no se ha realizado en esta revisión.

Después de publicar, volver a comprobar los estados HTTP y el SEO del dominio público y revisar el sitemap en Search Console. La nueva indexación y los efectos de retirar las URLs antiguas solo podrán observarse progresivamente. La comprobación visual y funcional de cookies/GA4 en navegador sigue siendo independiente; sus componentes no se modifican en este ajuste.

Referencia oficial: [página 404 personalizada de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
