// components/product-card.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Company } from '@/db/schema';

type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;

type ProductWithCompany = ProductType & { company: CompanyType };

interface ProductCardProps {
  product: ProductWithCompany;
  aspectRatio?: 'square' | 'video';
  showCategory?: boolean;
  cardType?: 'detail' | 'catalog'; // 'detail' for products page, 'catalog' for homepage
}

export default function ProductCard({ 
  product, 
  aspectRatio = 'square', 
  showCategory = true,
  cardType = 'detail'
}: ProductCardProps) {
  const imageHeightClass = aspectRatio === 'video' ? 'aspect-video' : 'aspect-square';
  
  // Determine button configuration based on card type
  const showCallButtons = cardType === 'catalog';
  const showDetailsButton = cardType === 'detail';
  
  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden hover:shadow-[0_0_30px_#F01457]/20 transition-shadow duration-300 group">
      {/* Product Image Header */}
      <div className={`relative ${imageHeightClass} overflow-hidden`}>
        {product.imageMain ? (
          <Image 
            src={product.imageMain} 
            alt={product.name} 
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#333333] flex items-center justify-center">
            <div className="text-4xl text-[#F01457] font-bold">
              {product.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
      
      {/* Product Info Section */}
      <div className="p-5">
        {/* Category as chip */}
        {showCategory && product.company.category && (
          <div className="inline-block bg-[#F01457]/20 text-[#F01457] text-xs px-3 py-1 rounded-full font-medium mb-3">
            {product.company.category}
          </div>
        )}
        
        <h3 className={`font-bold text-lg text-white mb-2 truncate`}>{product.name}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{product.description || 'No description available'}</p>
        
        {/* Company Info */}
        <div className="mb-4">
          <p className="text-slate-400 text-sm">by <span className="text-white">{product.company?.companyName || 'Unknown Supplier'}</span></p>
        </div>
        
        {/* Pricing */}
        <div className="mb-4">
          {product.priceMin && product.priceMax ? (
            <div className="text-[#F01457] font-semibold">
              {product.priceMin} - {product.priceMax}
            </div>
          ) : product.priceMin ? (
            <div className="text-[#F01457] font-semibold">
              {product.priceMin}
            </div>
          ) : (
            <div className="text-[#F01457] font-semibold">
              Price on request
            </div>
          )}
          {product.moq && (
            <div className="text-slate-500 text-sm">MOQ: {product.moq} {product.unitName || 'units'}</div>
          )}
        </div>
        
        {/* Buttons based on card type */}
        {showDetailsButton && (
          <Link href={`/product/${product.idProduct}`}>
            <Button className="w-full bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white hover:shadow-lg transition-shadow">
              View Details
            </Button>
          </Link>
        )}
        
        {showCallButtons && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 border-[#F01457]/50 text-[#F01457] hover:bg-[#F01457]/10"
            >
              Book Call
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[#F01457]/50 text-[#F01457] hover:bg-[#F01457]/10"
            >
              Chat
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}