// Color themes. Each id has a matching [data-theme="<id>"] block in
// src/app/globals.css that sets the --c-* palette and --syntax-* colors.
export const THEMES = Object.freeze([
  { id: "default", name: "Default" },
  { id: "dracula", name: "Dracula" },
  { id: "gruvbox", name: "Gruvbox" },
  { id: "nord", name: "Nord" },
  { id: "solarized", name: "Solarized Dark" },
  { id: "catppuccin", name: "Catppuccin Mocha" },
  { id: "tokyo-night", name: "Tokyo Night" },
  { id: "one-dark", name: "One Dark" },
  { id: "monokai", name: "Monokai" },
]);

export const DEFAULT_THEME = "default";

const THEME_IDS = THEMES.map((t) => t.id);

export function isThemeId(id) {
  return THEME_IDS.includes(id);
}

// Fall back to the default theme for unknown or missing ids
export function resolveTheme(id) {
  return isThemeId(id) ? id : DEFAULT_THEME;
}

// Set the theme on <html> so the CSS variables switch everywhere
export function applyTheme(id) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = resolveTheme(id);
}

/**
 * Inline script for <head> that applies the saved theme before first paint.
 * Reads the same localStorage entry as src/lib/settings.js.
 * @param {string} storageKey settings key in localStorage
 */
export function themeInitScript(storageKey) {
  return `(function(){try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(
    storageKey,
  )})||"{}");var ids=${JSON.stringify(
    THEME_IDS,
  )};if(s&&ids.indexOf(s.theme)>-1)document.documentElement.dataset.theme=s.theme;}catch(e){}})();`;
}
