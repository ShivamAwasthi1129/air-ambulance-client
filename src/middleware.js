// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Set the x-forwarded-host header to the request's host
  requestHeaders.set('x-forwarded-host', request.headers.get('host') || '');

  // You can also ensure the origin header is set correctly if needed
  requestHeaders.set('origin', request.headers.get('origin') || '');

  // Return the modified request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Specify the paths where the middleware should be applied
export const config = {
  matcher: '/api/:path*', // Apply to all API routes
};