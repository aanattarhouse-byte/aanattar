const trimTrailingSlash = (value?: string) => value?.trim().replace(/\/+$/, '') || '';

export const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || process.env.VITE_API_URL
);

export const SERVER_API_BASE_URL = trimTrailingSlash(
  process.env.API_URL
    || process.env.API_BASE_URL
    || process.env.NEXT_PUBLIC_API_URL
    || process.env.NEXT_PUBLIC_API_BASE_URL
    || process.env.VITE_API_URL
);

export type ApiErrorPayload = {
  success?: boolean;
  message?: string;
  code?: string;
};

type BackendFetchOptions = RequestInit & {
  timeoutMs?: number;
};

export async function backendFetch(path: string, options: BackendFetchOptions = {}) {
  const { timeoutMs = 15000, headers, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const baseUrl = typeof window === 'undefined' ? SERVER_API_BASE_URL : '';

  if (typeof window === 'undefined' && !baseUrl && process.env.NODE_ENV === 'production') {
    throw new Error('Backend API URL is not configured. Set API_URL or API_BASE_URL to the production backend HTTPS URL.');
  }

  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include',
      signal: controller.signal
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const payload = typeof data === 'object' && data !== null ? data as ApiErrorPayload : {};
      throw new Error(payload.message || `Backend API request failed with status ${response.status} for ${url}`);
    }

    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Backend API request timed out. Please try again.');
    }

    if (error instanceof TypeError) {
      throw new Error(`Backend API request failed for ${url}. Verify the API URL, HTTPS certificate, CORS policy, and network access.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
