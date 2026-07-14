export const APP_NAME="Tecnocar N&S";

export const PRIMARY="#00E676";

export const DARK="#090B10";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const ASSET_BASE_URL = API_URL.replace(/\/api\/?$/, "");

export function assetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${ASSET_BASE_URL}${path}`;
}