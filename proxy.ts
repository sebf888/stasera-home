import { NextResponse, type NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Server action calls are POST requests. Skip Basic Auth for them —
  // they are protected by Next.js CSRF origin checking and posterAdminEnabled()
  // inside every action. Skipping also avoids buffering large file upload bodies.
  if (request.method === 'POST') {
    return NextResponse.next();
  }

  const password = process.env.INTERNAL_PASSWORD;

  // No password configured → allow through (dev convenience)
  if (!password) {
    return NextResponse.next();
  }

  const auth = request.headers.get('authorization');

  if (auth?.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const colon = decoded.indexOf(':');
      const user = decoded.slice(0, colon);
      const pass = decoded.slice(colon + 1);
      const expectedUser = process.env.INTERNAL_USER ?? 'admin';
      if (user === expectedUser && pass === password) {
        return NextResponse.next();
      }
    } catch {
      // malformed base64 — fall through to 401
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Stasera Internal", charset="UTF-8"' },
  });
}

export const config = {
  matcher: '/internal/:path*',
};
