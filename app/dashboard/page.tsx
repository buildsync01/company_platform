// app/dashboard/page.tsx (Server Component)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAuth } from '@/lib/protected-route';

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Welcome, {user.email}!</h3>
              <p className="text-muted-foreground">This is your protected dashboard.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button formAction="/api/auth/logout" variant="destructive">
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}