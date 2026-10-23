import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const origin = "https://eversoul.ca";
const publicPaths = [
  "/",
  "/about",
  "/contact",
  "/how-it-works",
  "/privacy-policy",
  "/terms-of-service",
  "/destinations/",
  "/destinations/beijing",
  "/destinations/changchun",
  "/destinations/dalian",
  "/destinations/guangzhou",
  "/destinations/harbin",
  "/destinations/shanghai",
  "/resources/",
  "/services/dental-care",
  "/services/genetic-health-assessment",
  "/services/health-screening-in-china",
  "/services/healthy-aging",
  "/services/medical-aesthetics-in-china",
  "/services/medical-travel-concierge",
  "/services/rehabilitation-in-china",
  "/services/specialist-surgical-care",
  "/services/tcm-integrative-care",
];
const locales = ["en", "zh"];
const siteTitle = "China Care Guide";
const homeMetadata = {
  en: {
    title: "Private Healthcare in China | China Care Guide",
    description:
      "Explore private MRI, CT, health screening, specialist care and rehabilitation options in China, with personalized visit and travel coordination.",
  },
  zh: {
    title: "赴华就医与个性化医疗协调 | China Care Guide",
    description:
      "了解赴华 MRI、CT、健康体检、专科就诊与康复选项，并按需求协调就诊、口译、陪诊和行程。",
  },
};

const escapeHtml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const localUrl = (locale, routePath) => `${origin}/${locale}${routePath === "/" ? "/" : routePath}`;
const safeJson = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");

let server;
try {
  server = await createServer({
    mode: "production",
    logLevel: "error",
    appType: "custom",
    server: { middlewareMode: true },
  });

  const [{ default: App }, { getLocalizedContentPage }, { getAestheticPageMetadata }, { getLegalPageMetadata }, { getHealthScreeningMetadata }] =
    await Promise.all([
      server.ssrLoadModule("/src/App.tsx"),
      server.ssrLoadModule("/src/PublicContent.tsx"),
      server.ssrLoadModule("/src/AestheticCarePages.tsx"),
      server.ssrLoadModule("/src/LegalPages.tsx"),
      server.ssrLoadModule("/src/HealthScreeningPage.tsx"),
    ]);

  const distDirectory = path.resolve("dist");
  const shell = await fs.readFile(path.join(distDirectory, "index.html"), "utf8");
  const sitemapEntries = [];

  for (const routePath of publicPaths) {
    const localizedUrls = Object.fromEntries(locales.map((locale) => [locale, localUrl(locale, routePath)]));

    for (const locale of locales) {
      const pathname = localizedUrls[locale].replace(origin, "");
      globalThis.window = { location: { pathname, origin, search: "", hash: "" } };

      let page;
      if (routePath === "/") {
        page = homeMetadata[locale];
      } else if (routePath === "/services/medical-aesthetics-in-china" || routePath === "/services/healthy-aging") {
        const kind = routePath.split("/").at(-1);
        page = getAestheticPageMetadata(locale, kind);
      } else if (routePath === "/services/health-screening-in-china") {
        page = getHealthScreeningMetadata(locale);
      } else if (routePath === "/privacy-policy" || routePath === "/terms-of-service") {
        page = getLegalPageMetadata(locale, routePath.slice(1));
      } else {
        page = getLocalizedContentPage(routePath, locale);
      }

      if (!page?.title || !page?.description) {
        throw new Error(`Missing SEO metadata for ${locale}${routePath}`);
      }

      const appHtml = renderToString(React.createElement(App));
      const pageUrl = localizedUrls[locale];
      const language = locale === "zh" ? "zh-CN" : "en";
      const structuredData = routePath === "/"
        ? {
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "name": siteTitle, "url": origin },
              { "@type": "WebSite", "name": siteTitle, "url": origin, "inLanguage": ["en", "zh-CN"] },
              { "@type": "WebPage", "name": page.title, "description": page.description, "url": pageUrl, "inLanguage": language },
            ],
          }
        : {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.title,
            description: page.description,
            url: pageUrl,
            inLanguage: language,
            isPartOf: { "@type": "WebSite", name: siteTitle, url: origin },
          };
      const structuredDataId = routePath === "/"
        ? "site-structured-data"
        : routePath === "/privacy-policy" || routePath === "/terms-of-service"
          ? "legal-page-structured-data"
          : routePath === "/services/medical-aesthetics-in-china" || routePath === "/services/healthy-aging"
            ? "care-page-structured-data"
            : routePath === "/services/health-screening-in-china"
              ? "screening-page-structured-data"
              : "public-page-structured-data";

      const headTags = [
        `<title>${escapeHtml(page.title)}</title>`,
        `<meta name="description" content="${escapeHtml(page.description)}" />`,
        `<link rel="canonical" href="${pageUrl}" />`,
        ...locales.map((alternateLocale) => `<link rel="alternate" hreflang="${alternateLocale === "zh" ? "zh-CN" : "en"}" href="${localizedUrls[alternateLocale]}" />`),
        `<link rel="alternate" hreflang="x-default" href="${localizedUrls.en}" />`,
        `<meta property="og:type" content="${routePath === "/" ? "website" : "article"}" />`,
        `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
        `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
        `<meta property="og:url" content="${pageUrl}" />`,
        `<meta name="twitter:card" content="summary" />`,
        `<script id="${structuredDataId}" type="application/ld+json">${safeJson(structuredData)}</script>`,
      ].join("\n    ");

      let html = shell
        .replace('<html lang="en">', `<html lang="${language}">`)
        .replace(/\s*<title>[\s\S]*?<\/title>/, "")
        .replace(/\s*<meta name="description"[^>]*\/?\s*>/, "")
        .replace(/\s*<meta property="og:[^"]+"[^>]*\/?\s*>/g, "")
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
        .replace("</head>", `    ${headTags}\n  </head>`);

      const relativeHtmlPath = path.join(pathname.replace(/^\//, ""), "index.html");
      const outputPath = path.join(distDirectory, relativeHtmlPath);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html);
    }

    sitemapEntries.push(`  <url>\n    <loc>${localizedUrls.en}</loc>\n${locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale === "zh" ? "zh-CN" : "en"}" href="${localizedUrls[locale]}" />`).join("\n")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrls.en}" />\n  </url>`);
    sitemapEntries.push(`  <url>\n    <loc>${localizedUrls.zh}</loc>\n${locales.map((locale) => `    <xhtml:link rel="alternate" hreflang="${locale === "zh" ? "zh-CN" : "en"}" href="${localizedUrls[locale]}" />`).join("\n")}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrls.en}" />\n  </url>`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join("\n")}\n</urlset>\n`;
  await fs.writeFile(path.join(distDirectory, "sitemap.xml"), sitemap);
  console.log(`Pre-rendered ${publicPaths.length * locales.length} public pages and generated sitemap.xml.`);
} finally {
  await server?.close();
}
