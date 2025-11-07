'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/session-provider';
import { useState } from 'react';
import AuthWallModal from '@/components/ui/auth-wall-modal';
import Link from 'next/link';
import Image from 'next/image';

interface CompanyHeaderClientProps {
  company: any;
}

export default function CompanyHeaderClient({ company }: CompanyHeaderClientProps) {
  const { user, isLoading } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return; // Wait for auth check to complete
    
    if (!user) {
      setShowAuthModal(true);
    } else {
      // In a real app, you would navigate to the contact form
      window.location.href = `/contact?companyId=${company.idCompany}`;
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      {/* Company Header Section */}
      <section className="py-16 border-b border-[#2d2d2d]/50 bg-gradient-to-b from-transparent to-[#1a1a1a]/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="flex-shrink-0">
              {company.imageProfile ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F01457] to-[#F01457]/50 rounded-2xl blur-xl opacity-30"></div>
                  <Image 
                    src={company.imageProfile} 
                    alt={company.companyName} 
                    width={150}
                    height={150}
                    className="relative rounded-2xl object-cover border-2 border-[#F01457]/30 shadow-lg"
                  />
                </div>
              ) : (
                <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-br from-[#F01457] to-[#F01457]/50 flex items-center justify-center shadow-lg">
                  <div className="absolute inset-0 rounded-2xl blur-md"></div>
                  <div className="relative bg-[#222222] rounded-2xl w-32 h-32 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#F01457]">{company.companyName.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-gradient-to-r from-[#F01457] to-[#F01457]/50 px-4 py-1 rounded-full text-sm mb-2">
                <span className="text-white font-medium">Company Profile</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {company.companyName}
              </h1>
              <p className="text-lg text-slate-300 mt-3 italic">
                {company.slogan || 'Innovative solutions for your business needs'}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
                {company.category && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#F01457]/10 to-[#F01457]/5 rounded-full border border-[#F01457]/20">
                    <div className="w-2 h-2 rounded-full bg-[#F01457]"></div>
                    <span className="text-[#F01457] font-medium">{company.category}</span>
                  </div>
                )}
                {company.companySize && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-full border border-amber-500/20">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-amber-400 font-medium">{company.companySize} employees</span>
                  </div>
                )}
                {company.establishedYear && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-full border border-blue-500/20">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-blue-400 font-medium">Est. {company.establishedYear}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-8 max-w-3xl mx-auto md:mx-0">
                <p className="text-slate-300 leading-relaxed">
                  {company.about || 'No company description available. This company specializes in providing high-quality products and services to meet customer needs.'}
                </p>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white hover:shadow-[0_0_20px_#F01457]/30 transition-shadow min-w-[180px]"
                  onClick={handleContactClick}
                  disabled={isLoading}
                >
                  {isLoading ? 'Checking auth...' : 'Contact Us'}
                </Button>
                {company.website && (
                  <Button 
                    variant="outline" 
                    className="border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d] hover:border-[#F01457]/50 min-w-[180px]"
                  >
                    <Link href={company.website} target="_blank">Visit Website</Link>
                  </Button>
                )}
              </div>
            </div>
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