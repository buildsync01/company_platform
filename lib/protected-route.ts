// lib/protected-route.ts
import { redirect } from 'next/navigation';
import { verifyToken } from './auth';
import { cookies } from 'next/headers';
import { getUserById } from './auth';

export async function requireAuth() {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    redirect('/sign-in');
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    redirect('/sign-in');
  }

  const user = await getUserById(decoded.userId);

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

export async function checkAuth() {
  const token = cookies().get('auth_token')?.value;

  if (!token) {
    return null;
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return null;
  }

  const user = await getUserById(decoded.userId);

  return user;
}