import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import siteConfig from "./site.config.mjs";
import { legacyRedirects } from "./src/utils/legacy-redirects.mjs";

export default defineConfig({
  output: "static",
  site: siteConfig.siteUrl,
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !Object.hasOwn(legacyRedirects, new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
