export const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
] as const;

export type Locale = (typeof languages)[number]["code"];
const localeCodes = new Set<string>(languages.map(({ code }) => code));

export function parseLocalizedPath(pathname: string): { locale: Locale | null; path: string } {
  const normalized = pathname.replace(/\/{2,}/g, "/");
  const [, first = "", ...rest] = normalized.split("/");
  if (localeCodes.has(first)) return { locale: first as Locale, path: `/${rest.join("/")}` || "/" };
  return { locale: null, path: normalized || "/" };
}

export function localizedPath(pathname: string, locale: Locale, search = "", hash = "") {
  const parsed = parseLocalizedPath(pathname);
  const path = parsed.path.startsWith("/") ? parsed.path : `/${parsed.path}`;
  const suffix = path === "/" ? "/" : path;
  return `/${locale}${suffix}${search}${hash}`;
}

export function changeLocale(locale: Locale) {
  window.location.assign(localizedPath(window.location.pathname, locale, window.location.search, window.location.hash));
}

export function localizeLinkClick(event: { target: EventTarget | null; defaultPrevented: boolean; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean }, locale: Locale) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
  const href = anchor.getAttribute("href") ?? "";
  if (!href.startsWith("/") || href.startsWith("//")) return;
  const targetPath = new URL(href, window.location.origin).pathname;
  if (targetPath === "/admin" || targetPath.startsWith("/admin/") || targetPath.startsWith("/api/")) return;
  if (parseLocalizedPath(targetPath).locale) return;
  const targetUrl = new URL(href, window.location.origin);
  anchor.href = localizedPath(targetUrl.pathname, locale, targetUrl.search, targetUrl.hash);
}
