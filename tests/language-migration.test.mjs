import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
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
  { from: "/es/", to: "/" },
  { from: "/es/nosotros/", to: "/nosotros/" },
  { from: "/es/contacto/", to: "/contacto/" },
  { from: "/es/privacidad/", to: "/privacidad/" },
  { from: "/es/cookies/", to: "/cookies/" },
  { from: "/about/", to: "/en/about/" },
  { from: "/contact/", to: "/en/contact/" },
  { from: "/privacy/", to: "/en/privacy/" },
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

before(async () => {
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
        assert.ok(
          !tags(html, "meta").some(
            (item) => item["http-equiv"]?.toLowerCase() === "refresh",
          ),
          path + ": final pages must not redirect",
        );
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

for (const { from, to } of redirects) {
  test(
    from + ": instant static redirect to " + to + " without loops",
    async () => {
      const html = await readFile(distFile(from), "utf8");
      for (const query of ["", "?utm_source=migration&ref=a%2Fb"]) {
        for (const method of ["GET", "HEAD"]) {
          const response = await fetch(localOrigin + from + query, {
            method,
            redirect: "manual",
          });
          assert.equal(response.status, 200, method + " " + from + query);
          assert.equal(response.headers.has("location"), false);
          assert.match(response.headers.get("content-type"), /text\/html/);
          if (method === "GET") {
            assert.equal(await response.text(), html);
          } else {
            await response.arrayBuffer();
          }
        }
      }
      assert.equal(
        tags(html, "html")[0].lang,
        to.startsWith("/en/") ? "en" : "es",
      );
      assert.deepEqual(
        tags(html, "meta")
          .filter((item) => item["http-equiv"]?.toLowerCase() === "refresh")
          .map((item) => item.content),
        ["0; url=" + absolute(to)],
      );
      assert.deepEqual(
        tags(html, "link")
          .filter((item) => item.rel === "canonical")
          .map((item) => item.href),
        [absolute(to)],
      );
      assert.ok(!tags(html, "link").some((item) => item.rel === "alternate"));
      const anchors = tags(html, "a");
      assert.equal(anchors.length, 1);
      assert.equal(anchors[0].href, absolute(to));
      assert.ok(
        textContent(html.match(/<a\b[^>]*>([\s\S]*?)<\/a>/)[1]).length > 0,
        "visible fallback link has text",
      );
      assert.doesNotMatch(html, /<script\b|<style\b|\bhidden(?:=|\s|>)/i);
      assert.notEqual(from, to);
      assert.ok(pages.some(({ es, en }) => es === to || en === to));
      assert.ok(!redirects.some((item) => item.from === to));
      const destination = await fetch(localOrigin + to, { redirect: "manual" });
      assert.equal(destination.status, 200);
      assert.equal(destination.headers.has("location"), false);
      assert.ok(
        !tags(await destination.text(), "meta").some(
          (item) => item["http-equiv"]?.toLowerCase() === "refresh",
        ),
        "destination serves content directly, with no redirect chain or loop",
      );
    },
  );
}

test("unknown URLs return real HTTP 404, with and without a slash", async () => {
  for (const path of ["/es/unknown/", "/about/team/", "/not-a-page/"]) {
    for (const variant of [path, path.slice(0, -1)]) {
      for (const query of ["", "?utm_source=migration&ref=a%2Fb"]) {
        for (const method of ["GET", "HEAD"]) {
          const response = await fetch(localOrigin + variant + query, {
            method,
            redirect: "manual",
          });
          assert.equal(response.status, 404, method + " " + variant + query);
          assert.equal(response.headers.has("location"), false);
          await response.arrayBuffer();
        }
      }
    }
  }
});

test("publication contains final pages and eight static redirects without runtime or hosting redirects", async () => {
  const files = (
    await readdir(new URL("../dist/", import.meta.url), { recursive: true })
  ).map((file) => file.replaceAll("\\", "/"));
  const htmlFiles = files.filter((file) => file.endsWith(".html")).sort();
  assert.deepEqual(
    htmlFiles,
    [
      "404.html",
      ...pages
        .flatMap(({ es, en }) => [es, en])
        .map((path) => path.slice(1) + "index.html"),
      ...redirects.map(({ from }) => from.slice(1) + "index.html"),
    ].sort(),
  );
  for (const path of [
    "_redirects",
    "_worker.js",
    "_routes.json",
    ".htaccess",
    "functions",
    "hosting/redirects-worker.mjs",
    "hosting/wrangler.json",
  ]) {
    await assert.rejects(stat(distFile("/" + path)), { code: "ENOENT" });
  }
  const redirectFiles = new Set(
    redirects.map(({ from }) => from.slice(1) + "index.html"),
  );
  for (const file of htmlFiles) {
    const html = await readFile(distFile("/" + file), "utf8");
    assert.equal(
      tags(html, "meta").filter(
        (item) => item["http-equiv"]?.toLowerCase() === "refresh",
      ).length,
      redirectFiles.has(file) ? 1 : 0,
      file + ": only legacy pages contain a meta refresh",
    );
    assert.doesNotMatch(
      html,
      /\b(?:(?:window|document|globalThis)\.)?location(?:\s*=|\.(?:href\s*=|(?:assign|replace)\s*\())/,
      file + ": no JavaScript navigation",
    );
    assert.doesNotMatch(
      html,
      /(?:href|src|action)=["'](?:https:\/\/lumoraevents\.net)?\/es(?:\/|["'?#])/i,
      file + ": no links to retired Spanish routes",
    );
    assert.doesNotMatch(html, /https:\/\/lumoraevents\.net\/es(?:\/|["?#])/);
  }
});

test("llms.txt references the ten final pages and no retired Spanish prefix", async () => {
  const llms = await readFile(distFile("/llms.txt"), "utf8");
  const urls = [
    ...llms.matchAll(/\]\((https:\/\/lumoraevents\.net\/[^)]*)\)/g),
  ].map(([, url]) => url);
  assert.deepEqual(
    urls.sort(),
    pages.flatMap(({ es, en }) => [absolute(es), absolute(en)]).sort(),
  );
  assert.doesNotMatch(llms, /\/es\//);
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
