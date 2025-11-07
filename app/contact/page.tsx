'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthWallModal from '@/components/auth-wall-modal';

export default function ContactPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [contactType, setContactType] = useState<'company' | 'product' | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  // Check query parameters to determine what to contact
  useEffect(() => {
    const companyId = searchParams.get('companyId');
    const productId = searchParams.get('productId');
    
    if (companyId) {
      setContactType('company');
      setContactId(companyId);
    } else if (productId) {
      setContactType('product');
      setContactId(productId);
    }
    
    // Always show auth modal if not signed in
    if (!isSignedIn) {
      setShowAuthModal(true);
    }
  }, [searchParams, isSignedIn]);

  // If user is signed in, redirect to appropriate contact form
  useEffect(() => {
    if (isSignedIn && contactType && contactId) {
      if (contactType === 'company') {
        // Here you would redirect to actual contact form for company
        console.log('Redirecting to company contact form', contactId);
        // In real implementation you would redirect to actual contact form
        // router.push(`/contact/company/${contactId}`);
      } else if (contactType === 'product') {
        // Here you would redirect to actual contact form for product
        console.log('Redirecting to product contact form', contactId);
        // In real implementation you would redirect to actual contact form
        // router.push(`/contact/product/${contactId}`);
      }
    }
  }, [isSignedIn, contactType, contactId, router]);

  // Close modal handler
  const handleCloseModal = () => {
    setShowAuthModal(false);
    // Redirect back to referring page or homepage
    router.back();
  };

  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-slate-400">Processing your contact request...</p>
      </div>
      
      <AuthWallModal 
        isOpen={showAuthModal} 
        onClose={handleCloseModal} 
        actionText="contact this supplier" 
      />
    </div>
  );
}