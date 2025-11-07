// app/test-verify/route.ts
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return Response.json(
        { authenticated: false, error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = await verifyToken(token);

    if (!decoded) {
      return Response.json(
        { authenticated: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    return Response.json({
      authenticated: true,
      userId: decoded.userId,
      token: token.substring(0, 20) + '...' // Only show partial token for security
    });
  } catch (error) {
    console.error('Verify endpoint error:', error);
    return Response.json(
      { authenticated: false, error: 'Verification error' },
      { status: 500 }
    );
  }
}