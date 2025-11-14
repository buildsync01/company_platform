// components/product-card-skeleton.tsx
'use client';

import { Card } from '@/components/ui/card';

export function ProductCardSkeleton() {
  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden animate-pulse">
      {/* Image header skeleton with square aspect ratio */}
      <div className="relative aspect-square bg-slate-700">
        <div className="absolute inset-0 bg-slate-700"></div>
      </div>
      
      {/* Info section skeleton */}
      <div className="p-5">
        <div className="h-4 bg-slate-700 rounded-full w-1/4 mb-3"></div>
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-4/5 mb-4"></div>
        
        {/* Company info skeleton */}
        <div className="h-3 bg-slate-700 rounded w-2/3 mb-4"></div>
        
        {/* Price skeleton */}
        <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-1/3 mb-4"></div>
        
        <div className="w-full h-10 bg-slate-700 rounded"></div>
      </div>
    </Card>
  );
}