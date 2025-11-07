// lib/auth.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Secret for JWT signing - this should come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development';

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to compare a password with a hash
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Function to generate a JWT token
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}

// Function to verify a JWT token
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    // Ensure we have a token
    if (!token) {
      console.log('No token provided to verifyToken');
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log('Successfully decoded token:', decoded);
    return decoded;
  } catch (error: any) {
    console.error('Token verification error:', error.message || error);
    return null;
  }
}

// Function to get user by ID
export async function getUserById(id: string) {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.idUser, id))
    .limit(1);
    
  return userResult[0] || null;
}

// Function to get user by email
export async function getUserByEmail(email: string) {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
    
  return userResult[0] || null;
}

// Function to get the currently authenticated user from the token
export async function getCurrentUser() {
  const token = cookies().get('auth_token')?.value;
  
  if (!token) {
    return null;
  }
  
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    return null;
  }
  
  return await getUserById(decoded.userId);
}