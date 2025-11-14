'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/session-provider'; // Using custom auth provider
import { useState } from 'react';
import AuthWallModal from '@/components/ui/auth-wall-modal';
import Link from 'next/link';

interface ProductCTAClientProps {
  product: any;
}

export default function ProductCTAClient({ product }: ProductCTAClientProps) {
  const { user, isLoading } = useSession(); // Using custom auth provider
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
    } else {
      // In a real app, you would navigate to the contact form
      window.location.href = `/contact?productId=${product.idProduct}`;
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
            <h2 className="text-3xl font-bold">Ready to Procure?</h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Contact {product.company.companyName} directly for more information about {product.name}.
            </p>
            <Button 
              size="lg" 
              className="mt-8 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
              onClick={handleContactClick}
            >
              Request Quotation
            </Button>
          </div>
        </div>
      </section>
      
      <AuthWallModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal} 
        actionText="contact the supplier" 
      />
    </>
  );
}