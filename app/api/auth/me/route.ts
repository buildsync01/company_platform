// app/api/auth/me/route.ts
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return Response.json(
        { message: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = await verifyToken(token);

    if (!decoded) {
      return Response.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user by ID
    const user = await getUserById(decoded.userId);

    if (!user) {
      return Response.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    return Response.json({
      id: user.idUser,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json(
      { message: 'An error occurred while fetching user data' },
      { status: 500 }
    );
  }
}