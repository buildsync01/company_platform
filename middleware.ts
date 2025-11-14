import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// For now, making all routes public to let server components handle auth
// We'll handle all auth protection in individual server components for reliability
export function middleware(request: NextRequest) {
  // Allow all requests to pass through
  // Auth protection will be handled in individual server components
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
