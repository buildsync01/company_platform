// components/company-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Company } from '@/db/schema';

type CompanyType = typeof Company.$inferSelect;

export function CompanyCard({ 
  company, 
  aspectRatio = 'square' 
}: { 
  company: CompanyType; 
  aspectRatio?: 'square' | 'video'; 
}) {
  const imageHeightClass = aspectRatio === 'video' ? 'aspect-video' : 'aspect-square';

  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden hover:shadow-[0_0_30px_#F01457]/20 transition-shadow duration-300 group">
      {/* Company Image Header */}
      <div className={`relative ${imageHeightClass} overflow-hidden`}>
        {company.imageProfile ? (
          <Image 
            src={company.imageProfile} 
            alt={company.companyName} 
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#333333] flex items-center justify-center">
            <div className="text-4xl text-[#F01457] font-bold">
              {company.companyName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
      
      {/* Company Info Section */}
      <div className="p-5">
        {/* Category as chip */}
        {company.category && (
          <div className="inline-block bg-[#F01457]/20 text-[#F01457] text-xs px-3 py-1 rounded-full font-medium mb-3">
            {company.category}
          </div>
        )}
        
        <h3 className="font-bold text-lg text-white mb-2 truncate">{company.companyName}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{company.slogan || company.about || 'No description available'}</p>
        
        {/* Additional Info Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {company.companySize && (
            <div className="bg-[#2a2a2a] text-slate-300 text-xs px-2.5 py-1 rounded-full border border-[#2d2d2d]">
              {company.companySize} employees
            </div>
          )}
          {company.establishedYear && (
            <div className="bg-[#2a2a2a] text-slate-300 text-xs px-2.5 py-1 rounded-full border border-[#2d2d2d]">
              Est. {company.establishedYear}
            </div>
          )}
          {company.tradeRole && (
            <div className="bg-[#2a2a2a] text-slate-300 text-xs px-2.5 py-1 rounded-full border border-[#2d2d2d]">
              {company.tradeRole}
            </div>
          )}
        </div>
        
        <Link href={`/company/${company.idCompany}`}>
          <Button className="w-full bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white hover:shadow-lg transition-shadow">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}