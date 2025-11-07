'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function AuthButtons() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated by checking for auth token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));
    
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/profile">Profile</Link>
          </Button>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Logout
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Join Free</Link>
          </Button>
        </div>
      )}
    </div>
  );
}