export const API_BASE = 'https://api.example.com';

export function apiUrl(path: string) {
  const base = API_BASE.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
