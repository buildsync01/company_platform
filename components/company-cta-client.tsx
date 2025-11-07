'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/session-provider';
import { useState } from 'react';
import AuthWallModal from '@/components/ui/auth-wall-modal';
import Link from 'next/link';

interface CompanyCTAClientProps {
  companyName: string;
  companyId: string;
}

export default function CompanyCTAClient({ companyName, companyId }: CompanyCTAClientProps) {
  const { user, isLoading } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return; // Wait for auth check to complete
    
    if (!user) {
      setShowAuthModal(true);
    } else {
      // In a real app, you would navigate to the contact form
      window.location.href = `/contact?companyId=${companyId}`;
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl p-12 text-center bg-gradient-to-r from-[#F01457]/20 to-[#F01457]/10">
            <h2 className="text-3xl font-bold">Contact {companyName}</h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Interested in their products? Get in touch directly with {companyName}.
            </p>
            <Button 
              size="lg" 
              className="mt-8 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
              onClick={handleContactClick}
              disabled={isLoading}
            >
              {isLoading ? 'Checking auth...' : 'Request Callback'}
            </Button>
          </div>
        </div>
      </section>
      
      <AuthWallModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal} 
        actionText="contact this company" 
      />
    </>
  );
}