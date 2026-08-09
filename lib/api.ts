const BASE_URL = '/api';

async function request<T>(method: string, path: string, body?: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      console.error(`API ${method} ${path} failed:`, res.status, res.statusText);
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error(`API ${method} ${path} error:`, err);
    return null;
  }
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  del: <T>(path: string) => request<T>('DELETE', path),
};