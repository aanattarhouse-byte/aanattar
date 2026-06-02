import { SERVER_API_BASE_URL } from '@/lib/backendApi';

const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(`/api/${path.join('/')}${sourceUrl.search}`, SERVER_API_BASE_URL);
  const headers = new Headers(request.headers);

  headers.delete('host');

  let response;
  try {
    response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: METHODS_WITH_BODY.has(request.method) ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
      cache: 'no-store'
    });
  } catch (error) {
    console.error(`[API proxy] Failed to reach backend ${targetUrl.origin}:`, error);
    return Response.json(
      {
        success: false,
        message: 'Unable to reach the backend API. Verify API_URL/API_BASE_URL, HTTPS, and hosting network access.'
      },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
