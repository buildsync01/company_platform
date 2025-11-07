'use client';

import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import AuthWallModal from '@/components/ui/auth-wall-modal';
import Link from 'next/link';

interface ProductContactClientProps {
  product: any;
}

export default function ProductContactClient({ product }: ProductContactClientProps) {
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
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
      <div className="flex gap-4">
        <Button 
          className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white px-8"
          onClick={handleContactClick}
        >
          Contact Supplier
        </Button>
        <Button variant="outline" className="border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d] px-8">
          Add to Inquiry
        </Button>
      </div>
      
      <AuthWallModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal} 
        actionText="contact the supplier" 
      />
    </>
  );
}