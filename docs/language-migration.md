# Migración del idioma principal a español

Implementación local preparada para revisión. No se ha publicado el sitio ni se han modificado DNS, reglas, Workers o ajustes de producción.

## Auditoría previa

- Framework: Astro 5.18.1, Tailwind CSS 4 y salida estática. Las páginas completas se generan durante el build; no dependen de JavaScript para mostrar su contenido esencial.
- Despliegue: el usuario confirmó que `lumoraevents.net` se publica en Cloudflare Pages mediante su integración con GitHub. Astro genera `dist/` desde la raíz del repositorio con `npm run build`. No se dispone de acceso al panel para contrastar sus ajustes guardados. El repositorio conserva `.github/workflows/deploy.yml` y `public/CNAME` para GitHub Pages; no configuran el proyecto de Cloudflare y no se modifican en esta adaptación.
- Pages Functions: no hay directorio `functions/`, middleware de Astro, adaptador `@astrojs/cloudflare`, `_worker.js` ni `_routes.json` en el código o el build inspeccionados. Las rutas se sirven como archivos estáticos.
- Rutas originales: inicio, nosotros/about, contacto/contact, privacidad/privacy y cookies, en inglés sin prefijo y español bajo `/es/`. También hay `404.astro` y `robots.txt.ts`; no se encontraron otras páginas públicas o legales.
- Idiomas: diccionarios `src/i18n/es.json` y `en.json`, configuración en `src/utils/site.ts`, funciones en `src/utils/i18n.ts` y equivalencias de slugs en `src/utils/routes.ts`. Se conserva este sistema.
- Enlaces: cabecera, footer, CTA, política de cookies y selector de idioma usan `getPagePath`. El selector recibe la página actual tanto en escritorio como en móvil.
- SEO: `BaseLayout.astro` genera canonical absoluto, hreflang ES/EN y el `x-default` existente, `html lang`, Open Graph, Twitter y JSON-LD de Organization/WebSite. Los títulos y descripciones salen de cada diccionario. No había `og:locale`.
- Sitemap: `@astrojs/sitemap` genera `sitemap-index.xml` y `sitemap-0.xml` desde las páginas construidas. No había hreflang en XML; continúa en HTML. No se introduce otro generador.
- Robots: permite `/` y anuncia `sitemap-index.xml`. La página 404 tiene `noindex` y carece de canonical/hreflang; no aparece en el sitemap.
- Redirecciones: se utiliza el mecanismo nativo `_redirects` de Cloudflare Pages. El archivo fuente `public/_redirects` llega sin cambios a `dist/_redirects` en el build. Se han eliminado el Worker independiente y su configuración de Wrangler.
- Cookies y GA4: `CookieConsent.astro` guarda la preferencia en `lumoraevents_cookie_consent`, versión 1, y carga Analytics únicamente después del consentimiento. `Analytics.astro` usa `PUBLIC_GA_MEASUREMENT_ID`. Ambos componentes, la clave de almacenamiento y la variable se conservan.
- El manifiesto abre `/` y mantiene su scope. Los datos estructurados apuntan al dominio corporativo; los enlaces al SaaS siguen apuntando a `https://app.lumoraevents.net`.

## Resultado y rutas

Todas las rutas finales tienen barra final canónica. Se conserva `trailingSlash: "always"` y el tratamiento del hosting para las variantes finales sin barra. Las rutas antiguas, con o sin barra, redirigen directamente a la URL final con barra.

| URL anterior      | URL de destino o reutilizada | Comportamiento previsto         |
| ----------------- | ---------------------------- | ------------------------------- |
| `/es/`            | `/`                          | 301 → 200, español              |
| `/es/nosotros/`   | `/nosotros/`                 | 301 → 200, español              |
| `/es/contacto/`   | `/contacto/`                 | 301 → 200, español              |
| `/es/privacidad/` | `/privacidad/`               | 301 → 200, español              |
| `/es/cookies/`    | `/cookies/`                  | 301 → 200, español              |
| `/about/`         | `/en/about/`                 | 301 → 200, inglés               |
| `/contact/`       | `/en/contact/`               | 301 → 200, inglés               |
| `/privacy/`       | `/en/privacy/`               | 301 → 200, inglés               |
| `/`               | `/`                          | 200, cambia de inglés a español |
| `/cookies/`       | `/cookies/`                  | 200, cambia de inglés a español |

El inicio inglés está en `/en/` y la política de cookies inglesa en `/en/cookies/`, ambos con HTTP 200.

Las URLs `/` y `/cookies/` se reutilizan. No pueden redirigir a inglés y servir simultáneamente las páginas españolas. Cambian su contenido y metadatos, y los buscadores deben volver a rastrearlas. Los enlaces externos antiguos a esas dos URLs mostrarán español; el selector permite acceder a su versión inglesa equivalente.

El `x-default` existente apunta ahora a la página española equivalente. Cada canonical sigue siendo autorreferencial; los idiomas se relacionan exclusivamente mediante hreflang. Se añaden `og:locale` y `og:locale:alternate`. El manifiesto declara `lang: "es"` y el 404 general usa español, sin detección de idioma.

## Archivos de implementación

| Archivo                                                                                      | Cambio                                                                                                 |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/utils/site.ts`                                                                          | Español por defecto, idiomas y locales Open Graph                                                      |
| `src/layouts/BaseLayout.astro`                                                               | Open Graph por idioma; canonical, hreflang, x-default y JSON-LD usan la nueva configuración compartida |
| `src/pages/index.astro`, `cookies.astro`                                                     | Español en las URLs reutilizadas                                                                       |
| `src/pages/nosotros.astro`, `contacto.astro`, `privacidad.astro`                             | Páginas españolas trasladadas desde `src/pages/es/`                                                    |
| `src/pages/en/index.astro`, `about.astro`, `contact.astro`, `privacy.astro`, `cookies.astro` | Páginas inglesas trasladadas desde la raíz                                                             |
| `src/pages/404.astro`                                                                        | Idioma por defecto y enlace al nuevo inicio                                                            |
| `src/pages/es/*.astro`, `src/pages/about.astro`, `contact.astro`, `privacy.astro`            | Eliminadas las páginas en URLs antiguas                                                                |
| `public/site.webmanifest`                                                                    | Idioma español                                                                                         |
| `public/_redirects`                                                                          | 16 reglas HTTP 301 nativas de Cloudflare Pages; ocho rutas antiguas con y sin barra final              |
| `tests/language-migration.test.mjs`                                                          | Pruebas HTTP locales y SEO sobre el HTML construido                                                    |
| `package.json`                                                                               | `npm test` construye y ejecuta las pruebas nativas de Node                                             |
| `README.md`, `docs/language-migration.md`                                                    | Idiomas, auditoría, validación y activación manual                                                     |

El sitemap y robots se siguen generando con su mecanismo existente y no se versionan en `dist/`. Los componentes visuales, CSS, imágenes y diccionarios conservan su contenido.

## Publicación en Cloudflare Pages, después de revisar

Las páginas y las redirecciones forman parte del mismo build estático. No hay que crear ni activar un Worker, añadir reglas de redirección en el panel o cambiar DNS.

1. Comprobar en el proyecto existente de Cloudflare Pages que el directorio raíz es el del repositorio, el comando es `npm run build` y el directorio de publicación es `dist`. Estos son los valores comprobados localmente; no se han leído ni cambiado ajustes del panel.
2. Revisar si existen reglas o Workers externos al repositorio que intercepten las rutas antiguas. Si llegó a activarse el Worker de la propuesta anterior, retirar únicamente ese Worker/ruta de la migración. No se activó durante esta tarea. No tocar reglas o registros de `app.lumoraevents.net`.
3. Tras aprobar la revisión, publicar mediante la integración Git existente de Cloudflare Pages. `_redirects` se procesa automáticamente junto con el HTML. No se ha hecho push ni se ha desplegado durante esta adaptación.
4. Repetir la matriz HTTP en una vista previa de Pages y después en el dominio público. Confirmar los parámetros de consulta, ausencia de cadenas, caché y las URLs reutilizadas. La configuración de la rama de producción y el disparo automático de builds siguen gestionados en el panel existente.

Las 16 reglas usan exclusivamente rutas relativas exactas, sin comodines. No incluyen `/`, `/cookies/` ni las rutas finales, por lo que no hay bucles ni redirecciones hacia inglés de las URLs españolas reutilizadas. No hay reglas para recursos, API o subdominios. Los destinos no fijan una query string; su conservación debe comprobarse en el runtime de Pages con la prueba HTTP disponible.

Cloudflare Pages no aplica `_redirects` a solicitudes atendidas por Pages Functions. No se han encontrado Functions en este proyecto; si se añaden en el futuro, habrá que excluir estas rutas de su ámbito o implementar la redirección en la Function correspondiente.

Referencias oficiales: [redirecciones nativas y limitación con Functions](https://developers.cloudflare.com/pages/configuration/redirects/), [Astro en Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) y [runtime local de Pages](https://developers.cloudflare.com/pages/functions/local-development/).

## Validación local y comprobaciones pendientes

```bash
npm run check
npm test
npm run format:check
```

`npm test` ejecuta `astro build` y 14 pruebas de Node. Levanta temporalmente Astro preview para comprobar el HTML y valida las reglas reales de `dist/_redirects`, su copia desde `public/` y sus destinos. Astro preview no interpreta `_redirects`; no se simulan sus respuestas HTTP con código propio. El servidor se cierra al terminar y no se accede a producción.

Las 14 pruebas verifican:

- HTTP 200 e idioma correcto de las diez páginas finales, incluso enviando Accept-Language del idioma contrario.
- H1, títulos y descripciones específicos de los diccionarios, presentes en HTML sin ejecutar JavaScript.
- Canonical absoluto y autorreferencial, hreflang recíprocos ES/EN y x-default español en cada pareja.
- Open Graph, JSON-LD, selector de idioma de escritorio/móvil en ambas direcciones, navegación, enlaces internos y archivos de imágenes/estilos/iconos.
- Enlace de política de cookies del banner, acceso a ajustes del footer y continuidad de la clave de consentimiento.
- 16 reglas 301 explícitas para las ocho rutas antiguas con/sin barra, sin duplicados, bucles ni destinos que vuelvan a redirigir.
- Exclusión de URLs reutilizadas, páginas finales, rutas desconocidas, API y recursos; las reglas son relativas y no incluyen hosts externos.
- Copia exacta `public/_redirects` → `dist/_redirects` y ausencia de Pages Functions y Worker en el build.
- Sitemap con exactamente las diez URLs indexables, robots abierto, 404 con HTTP 404/noindex y manifiesto.

La comprobación de Astro pasa sin errores. El build y las 14 pruebas pasan. No hay script de ESLint en el proyecto: `npm run check` es el análisis estático disponible.

`npm run format:check` detecta problemas de formato previos en archivos ajenos a esta migración. Se comprueba por separado el formato de los archivos modificados; no se aplica una reformateación global a componentes o traducciones.

Se intentó ejecutar `npx wrangler@4 pages dev` sobre el directorio `dist`. Wrangler 4.163.0 confirmó `Parsed 16 valid redirect rules` y la ausencia de Functions. El runtime `workerd` no pudo arrancar en este Windows por una violación de acceso (`0xc0000005`) y desbordamiento de pila. No se modificó el sistema para repararlo.

Queda pendiente la prueba HTTP de redirecciones en un runtime compatible o una vista previa real de Pages: códigos 301, un único salto a 200, GET/HEAD, parámetros repetidos/codificados y normalización de barra de Pages. Las validaciones de archivo no sustituyen esa prueba.

Para repetirla en un entorno compatible, arrancar `npx wrangler@4 pages dev dist` y, en otra terminal PowerShell, ejecutar:

```powershell
$env:PAGES_TEST_ORIGIN = "http://127.0.0.1:8788"
node --test
Remove-Item Env:PAGES_TEST_ORIGIN
```

Ese modo ejecuta las 14 comprobaciones contra Pages y añade la prueba HTTP de las 16 variantes con GET/HEAD y queries codificadas/repetidas (15 pruebas en total). Solo admite un origen local.

También quedan pendientes de verificar en el panel o tras publicar: ajustes de build reales, reglas externas, DNS/TLS, caché y posibles cabeceras robots. No se ha desplegado ni se han cambiado configuraciones de Cloudflare.

También queda pendiente la comprobación visual en navegador, interacción del menú y del consentimiento (aceptar/rechazar/revocar y persistencia entre idiomas), y las solicitudes reales de GA4 con el ID de producción. Sus componentes y lógica no se han modificado; las pruebas locales de enlaces/HTML no sustituyen esa comprobación funcional. El recrawl y los cambios de indexación de Google solo podrán observarse después de publicar.
