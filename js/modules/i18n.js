// Scope: i18n — page language + fetching /i18n/{lang}.json.

export function getPageLang() {
  const fromQuery = new URLSearchParams(location.search).get("lang");
  if (fromQuery === "en" || fromQuery === "es") return fromQuery;
  return window.SITE_LANG === "en" ? "en" : "es";
}

export async function loadI18n(lang) {
  const res = await fetch(`/i18n/${lang}.json`);
  if (!res.ok) throw new Error(`Could not load i18n/${lang}.json`);
  return res.json();
}
