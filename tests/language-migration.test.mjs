import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { preview } from "astro";
import siteConfig from "../site.config.mjs";

// Independent acceptance matrix: test the requested public contract.
const pages = [
  { page: "home", es: "/", en: "/en/" },
  { page: "about", es: "/nosotros/", en: "/en/about/" },
  { page: "contact", es: "/contacto/", en: "/en/contact/" },
  { page: "privacy", es: "/privacidad/", en: "/en/privacy/" },
  { page: "cookies", es: "/cookies/", en: "/en/cookies/" },
];
const redirects = [
  ["/es/", "/"],
  ["/es/nosotros/", "/nosotros/"],
  ["/es/contacto/", "/contacto/"],
  ["/es/privacidad/", "/privacidad/"],
  ["/es/cookies/", "/cookies/"],
  ["/about/", "/en/about/"],
  ["/contact/", "/en/contact/"],
  ["/privacy/", "/en/privacy/"],
];
const dictionaries = Object.fromEntries(
  await Promise.all(
    ["es", "en"].map(async (locale) => [
      locale,
      JSON.parse(
        await readFile(
          new URL("../src/i18n/" + locale + ".json", import.meta.url),
        ),
      ),
    ]),
  ),
);
const absolute = (path) => new URL(path, siteConfig.siteUrl).href;
const decode = (text) =>
  text
    .replaceAll("&amp;", "&")
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
const withoutScripts = (html) =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
const tags = (html, tag) =>
  [
    ...withoutScripts(html).matchAll(
      new RegExp("<" + tag + "\\b([^>]*)>", "gi"),
    ),
  ].map(([, attributes]) =>
    Object.fromEntries(
      [...attributes.matchAll(/([:\w-]+)(?:="([^"]*)")?/g)].map(
        ([, name, value]) => [name, decode(value ?? "")],
      ),
    ),
  );
const textContent = (html) =>
  decode(html.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
const distFile = (path) =>
  new URL(
    "../dist" + path + (path.endsWith("/") ? "index.html" : ""),
    import.meta.url,
  );

let previewServer;
let localOrigin;
const rules = (
  await readFile(new URL("../dist/_redirects", import.meta.url), "utf8")
)
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"))
  .map((line) => line.split(/\s+/));
const ruleDestinations = new Map(
  rules.map(([source, destination]) => [source, destination]),
);

before(async () => {
  if (process.env.PAGES_TEST_ORIGIN) {
    const origin = new URL(process.env.PAGES_TEST_ORIGIN);
    assert.ok(
      ["127.0.0.1", "localhost", "[::1]"].includes(origin.hostname),
      "Pages runtime tests must use a local server",
    );
    localOrigin = origin.origin;
    return;
  }
  previewServer = await preview({
    root: fileURLToPath(new URL("../", import.meta.url)),
    server: { host: "127.0.0.1", port: 0 },
    logLevel: "silent",
  });
  localOrigin = "http://127.0.0.1:" + previewServer.server.address().port;
});

after(async () => {
  await previewServer?.stop();
});

for (const pair of pages) {
  for (const locale of ["es", "en"]) {
    const path = pair[locale];
    test(
      path + ": HTTP 200, localized static HTML, SEO and language switcher",
      async () => {
        const response = await fetch(new URL(path, localOrigin), {
          redirect: "manual",
          headers: { "accept-language": locale === "es" ? "en-US" : "es-ES" },
        });
        assert.equal(response.status, 200);
        const html = await response.text();
        const dictionary = dictionaries[locale];
        const content =
          pair.page === "home" ? dictionary : dictionary[pair.page + "Page"];
        assert.equal(tags(html, "html")[0].lang, locale);
        assert.equal(
          textContent(html.match(/<title>([\s\S]*?)<\/title>/)[1]),
          content.meta.title,
        );
        const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
        assert.equal(headings.length, 1);
        assert.equal(textContent(headings[0][1]), content.hero.title);
        const meta = Object.fromEntries(
          tags(html, "meta").map((item) => [
            item.name ?? item.property,
            item.content,
          ]),
        );
        assert.equal(meta.description, content.meta.description);
        assert.doesNotMatch(meta.robots ?? "", /noindex|nofollow/i);
        assert.equal(meta["og:url"], absolute(path));
        assert.equal(meta["og:title"], content.meta.title);
        assert.equal(meta["og:description"], content.meta.description);
        assert.equal(meta["og:locale"], locale === "es" ? "es_ES" : "en_US");
        assert.equal(
          meta["og:locale:alternate"],
          locale === "es" ? "en_US" : "es_ES",
        );
        const links = tags(html, "link");
        assert.deepEqual(
          links
            .filter((item) => item.rel === "canonical")
            .map((item) => item.href),
          [absolute(path)],
        );
        assert.deepEqual(
          Object.fromEntries(
            links
              .filter((item) => item.rel === "alternate")
              .map((item) => [item.hreflang, item.href]),
          ),
          {
            es: absolute(pair.es),
            en: absolute(pair.en),
            "x-default": absolute(pair.es),
          },
        );
        const anchors = tags(html, "a");
        for (const language of ["es", "en"]) {
          const switches = anchors.filter((item) => item.hreflang === language);
          assert.equal(
            switches.length,
            2,
            "desktop and mobile language controls",
          );
          assert.ok(switches.every((item) => item.href === pair[language]));
          assert.ok(
            switches.every(
              (item) =>
                item["aria-current"] ===
                (language === locale ? "page" : undefined),
            ),
          );
        }
        assert.ok(anchors.some((item) => item.href === siteConfig.appUrl));
        const cookiePanel = html.slice(
          html.indexOf('id="lumora-cookie-consent"'),
        );
        assert.ok(
          tags(cookiePanel, "a").some(
            (item) =>
              item.href ===
              pages.find((item) => item.page === "cookies")[locale],
          ),
        );
        assert.match(html, /data-open-cookie-settings/);
        assert.match(html, /lumoraevents_cookie_consent/);
        // Content, navigation and links exist without executing any JavaScript.
        for (const anchor of anchors) {
          const target = new URL(anchor.href, absolute(path));
          if (target.origin !== siteConfig.siteUrl) continue;
          assert.ok(
            (await stat(distFile(target.pathname))).isFile(),
            path + ": broken internal link " + anchor.href,
          );
          if (target.hash) {
            const targetHtml = await readFile(
              distFile(target.pathname),
              "utf8",
            );
            assert.ok(
              tags(targetHtml, "[a-z][a-z0-9]*").some(
                (item) => item.id === decodeURIComponent(target.hash.slice(1)),
              ),
              path + ": missing anchor " + anchor.href,
            );
          }
        }
        for (const asset of [
          ...links
            .filter((item) =>
              ["icon", "apple-touch-icon", "stylesheet", "manifest"].includes(
                item.rel,
              ),
            )
            .map((item) => item.href),
          ...tags(html, "img").map((item) => item.src),
        ]) {
          const target = new URL(asset, absolute(path));
          if (target.origin === siteConfig.siteUrl) {
            assert.ok((await stat(distFile(target.pathname))).isFile(), asset);
          }
        }
        const jsonLd = JSON.parse(
          html.match(
            /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
          )[1],
        );
        const website = jsonLd["@graph"].find(
          (item) => item["@type"] === "WebSite",
        );
        assert.equal(website.url, siteConfig.siteUrl);
        assert.deepEqual(website.inLanguage, ["es", "en"]);
      },
    );
  }
}

test("native Pages rules cover all 16 legacy variants with HTTP 301 and final destinations", async () => {
  assert.equal(rules.length, 16);
  assert.equal(
    ruleDestinations.size,
    16,
    "no duplicate or conflicting sources",
  );
  assert.ok(rules.every((rule) => rule.length === 3 && rule[2] === "301"));
  for (const [oldPath, newPath] of redirects) {
    for (const source of [oldPath, oldPath.slice(0, -1)]) {
      assert.equal(ruleDestinations.get(source), newPath);
      assert.equal(
        ruleDestinations.has(newPath),
        false,
        "no redirect chains or loops",
      );
      assert.ok((await stat(distFile(newPath))).isFile(), newPath);
    }
  }
});

// Astro preview does not implement Pages' _redirects. Run this additional HTTP
// check against a local "wrangler pages dev dist" server, without an emulator
// implemented by these tests or any requests to a production deployment.
if (process.env.PAGES_TEST_ORIGIN) {
  test("Cloudflare Pages runtime: one 301 hop, both slash variants, GET/HEAD and exact queries", async () => {
    for (const [oldPath, newPath] of redirects) {
      for (const source of [oldPath, oldPath.slice(0, -1)]) {
        for (const method of ["GET", "HEAD"]) {
          const query = "?utm_source=seo%20migration&ref=a%2Fb&tag=1&tag=2";
          const response = await fetch(localOrigin + source + query, {
            method,
            redirect: "manual",
          });
          assert.equal(response.status, 301, method + " " + source);
          assert.ok(response.headers.has("location"));
          const location = new URL(
            response.headers.get("location"),
            localOrigin,
          );
          assert.equal(location.href, localOrigin + newPath + query);
          const destination = await fetch(localOrigin + newPath + query, {
            method,
            redirect: "manual",
          });
          assert.equal(destination.status, 200, newPath);
        }
      }
    }
  });
}

test("redirect rules exclude reused/final URLs, unknown paths, assets, API and external hosts", () => {
  for (const path of [
    ...pages.flatMap(({ es, en }) => [es, en]),
    "/cookies",
    "/images/new_logo.png",
    "/_astro/global.css",
    "/api/contact",
    "/es/unknown/",
    "/es/images/logo.png",
    "/about/team/",
    "/es//",
    "/sitemap-index.xml",
    "/robots.txt",
  ]) {
    assert.equal(ruleDestinations.has(path), false, path);
  }
  for (const [source, destination] of rules) {
    assert.ok(source.startsWith("/") && !source.startsWith("//"));
    assert.ok(destination.startsWith("/") && !destination.startsWith("//"));
    assert.doesNotMatch(
      source + destination,
      /[*:?]/,
      "only exact relative paths",
    );
  }
});

test("build includes _redirects unchanged and no Pages Functions or Worker", async () => {
  assert.equal(
    await readFile(new URL("../dist/_redirects", import.meta.url), "utf8"),
    await readFile(new URL("../public/_redirects", import.meta.url), "utf8"),
  );
  for (const path of ["functions", "dist/_worker.js", "dist/_routes.json"]) {
    await assert.rejects(stat(new URL("../" + path, import.meta.url)), {
      code: "ENOENT",
    });
  }
});

test("sitemap, robots, 404 and manifest agree with the final route set", async () => {
  const index = await fetch(localOrigin + "/sitemap-index.xml");
  assert.equal(index.status, 200);
  const sitemapUrls = [
    ...(await index.text()).matchAll(/<loc>([^<]+)<\/loc>/g),
  ].map(([, value]) => value);
  assert.equal(sitemapUrls.length, 1);
  const result = await fetch(
    new URL(new URL(sitemapUrls[0]).pathname, localOrigin),
  );
  assert.equal(result.status, 200);
  const sitemap = await result.text();
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map(([, value]) => value)
      .sort(),
    pages.flatMap(({ es, en }) => [absolute(es), absolute(en)]).sort(),
  );
  const robots = await fetch(localOrigin + "/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(
    await robots.text(),
    /^User-agent: \*\nAllow: \/\n\nSitemap: https:\/\/lumoraevents\.net\/sitemap-index\.xml$/,
  );
  const missing = await fetch(localOrigin + "/not-a-page/");
  assert.equal(missing.status, 404);
  const missingHtml = await missing.text();
  assert.equal(tags(missingHtml, "html")[0].lang, "es");
  assert.ok(
    tags(missingHtml, "meta").some(
      (item) => item.name === "robots" && item.content === "noindex",
    ),
  );
  assert.ok(
    !tags(missingHtml, "link").some((item) =>
      ["canonical", "alternate"].includes(item.rel),
    ),
  );
  const manifest = JSON.parse(
    await readFile(new URL("../dist/site.webmanifest", import.meta.url)),
  );
  assert.equal(manifest.lang, "es");
  assert.equal(manifest.start_url, "/");
});
