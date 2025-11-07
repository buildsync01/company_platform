// app/profile/page.tsx (Server Component)
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getUser() {
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

export default async function ProfilePage() {
  const user = await getUser();

  const handleLogout = async () => {
    'use server';
    // This will be handled via a form action on the client
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">User Information</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.idUser}</p>
            <p><strong>Created:</strong> {user.createdAt?.toString()}</p>
          </div>
          
          <div className="pt-4">
            <form action="/api/auth/logout" method="post">
              <Button type="submit" variant="destructive">
                Logout
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}