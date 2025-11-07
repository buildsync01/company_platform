// app/test-token/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function TestTokenPage() {
  const [token, setToken] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token from cookies
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(c => c.startsWith('auth_token='));
    if (tokenCookie) {
      const tokenValue = tokenCookie.split('=')[1];
      setToken(tokenValue);
      
      try {
        // Decode JWT token manually to see payload
        const base64Url = tokenValue.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        setDecoded(JSON.parse(jsonPayload));
      } catch (err) {
        setError('Could not decode token: ' + (err as Error).message);
      }
    } else {
      setError('No auth_token cookie found');
    }
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Token Debug Page</h1>
        
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Token in Cookie:</h2>
            <p className="break-all">{token || 'None'}</p>
          </div>
          
          <div>
            <h2 className="font-semibold">Decoded Token Payload:</h2>
            <pre className="bg-white p-3 rounded border">
              {decoded ? JSON.stringify(decoded, null, 2) : 'Could not decode'}
            </pre>
          </div>
          
          {error && (
            <div className="text-red-600">
              <h2 className="font-semibold">Error:</h2>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}