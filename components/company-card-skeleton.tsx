// components/company-card-skeleton.tsx
'use client';

import { Card } from '@/components/ui/card';

export function CompanyCardSkeleton({ aspectRatio = 'square' }: { aspectRatio?: 'square' | 'video' }) {
  const imageHeightClass = aspectRatio === 'video' ? 'aspect-video' : 'aspect-square';

  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden animate-pulse">
      {/* Image header skeleton with proper aspect ratio */}
      <div className={`relative ${imageHeightClass} bg-slate-700`}>
        <div className="absolute inset-0 bg-slate-700"></div>
      </div>
      
      {/* Info section skeleton */}
      <div className="p-5">
        <div className="h-4 bg-slate-700 rounded-full w-1/4 mb-3"></div>
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-4/5 mb-4"></div>
        
        {/* Chip skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-20 bg-slate-700 rounded-full"></div>
          <div className="h-6 w-24 bg-slate-700 rounded-full"></div>
          <div className="h-6 w-16 bg-slate-700 rounded-full"></div>
        </div>
        
        <div className="w-full h-10 bg-slate-700 rounded"></div>
      </div>
    </Card>
  );
}