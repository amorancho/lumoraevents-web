import type { APIRoute } from "astro";
import { siteConfig } from "../utils/site";

const getRobotsTxt = (sitemapUrl: URL) =>
  ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl.href}`].join("\n");

export const GET: APIRoute = () => {
  const sitemapUrl = new URL("/sitemap-index.xml", `${siteConfig.siteUrl}/`);

  return new Response(getRobotsTxt(sitemapUrl));
};
