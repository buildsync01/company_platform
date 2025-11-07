import { db } from '@/db';
import { companies, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import CompanyHeaderClient from '@/components/company-header-client';
import CompanyCTAClient from '@/components/company-cta-client';
import { CompanyInfoSection } from '@/components/company-info-section';

interface CompanyPageProps {
  params: {
    id: string;
  };
}

// Server component untuk bagian produk
function CompanyProductsSection({ company }: { company: any }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Products from {company.companyName}</h2>
        {company.products && company.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.products.map((product: any) => (
              <Card key={product.idProduct} className="bg-[#222222] rounded-2xl shadow-[0_0_15px_#F01457]/10 border border-[#2d2d2d] p-4 hover:scale-[1.02] transition-all hover:shadow-[#F01457]/10">
                {product.imageMain ? (
                  <Image 
                    src={product.imageMain} 
                    alt={product.name} 
                    width={300} 
                    height={300} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-slate-500">No Image</span>
                  </div>
                )}
                <h3 className="font-bold text-lg truncate">{product.name}</h3>
                <p className="text-slate-400 text-sm mt-1 truncate">{product.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-semibold text-[#F01457]">
                    {product.priceMin || product.priceMax || 'Price not specified'}
                  </span>
                  <span className="text-xs text-slate-500">
                    MOQ: {product.moq || 'N/A'}
                  </span>
                </div>
                {product.unitName && (
                  <div className="text-xs text-slate-500 mt-1">
                    Unit: {product.unitName}
                  </div>
                )}
                {product.createdAt && (
                  <div className="text-xs text-slate-500 mt-1">
                    Added: {new Date(product.createdAt).toLocaleDateString()}
                  </div>
                )}
                <Link href={`/product/${product.idProduct}`}>
                  <Button className="w-full mt-4 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white">
                    View Product Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400">No products available from this company.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const companyId = params.id;

  // Fetch company data with its products
  const company = await db.query.companies.findFirst({
    where: eq(companies.idCompany, companyId),
    with: {
      products: true
    }
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader />
      <main className="pt-16">
        {/* Company Header & Information Section */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a1a1a] to-[#1a1a2a] opacity-30"></div>
          
          <div className="relative z-10">
            <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading company information...</div>}>
              <CompanyHeaderClient company={company} />
            </Suspense>
            
            <Suspense fallback={<div className="py-12 text-center text-slate-400">Loading company details...</div>}>
              <CompanyInfoSection companyId={company.idCompany} />
            </Suspense>
          </div>
        </div>

        {/* Products Section */}
        <div className="py-16 bg-[#1a1a1a]/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#F01457] to-[#F01457]/80 bg-clip-text text-transparent">
                Products from {company.companyName}
              </h2>
              <div className="text-sm text-slate-400">
                {company.products?.length || 0} products
              </div>
            </div>
            
            {company.products && company.products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {company.products.map((product: any) => (
                  <Card 
                    key={product.idProduct} 
                    className="bg-gradient-to-b from-[#222222] to-[#2a2a2a] rounded-2xl shadow-[0_0_20px_#F01457]/10 border border-[#2d2d2d] p-5 hover:scale-[1.02] transition-all hover:shadow-[#F01457]/20 duration-300 group"
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      {product.imageMain ? (
                        <Image 
                          src={product.imageMain} 
                          alt={product.name} 
                          width={300} 
                          height={300} 
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                          <span className="text-slate-500">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-[#F01457]/80 text-white text-xs px-2 py-1 rounded-full">
                        {product.category || 'General'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-[#F01457] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#2d2d2d]">
                        <div className="space-y-1">
                          <div className="font-semibold text-[#F01457]">
                            {product.priceMin && product.priceMax ? 
                              `${product.priceMin} - ${product.priceMax}` : 
                              product.priceMin || product.priceMax || 'Price on request'
                            }
                          </div>
                          <div className="text-xs text-slate-500">
                            MOQ: {product.moq || 'N/A'} {product.unitName || ''}
                          </div>
                        </div>
                        
                        <Link href={`/product/${product.idProduct}`}>
                          <Button 
                            className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white hover:shadow-[0_0_15px_#F01457]/30 transition-shadow"
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-4 rounded-full bg-[#222222] border border-[#2d2d2d] mb-4">
                  <div className="text-4xl">📦</div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No Products Available</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  This company doesn't have any products listed at the moment. Check back later or contact them directly.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA Section */}
        <Suspense fallback={<div className="py-16 text-center text-slate-400">Loading contact options...</div>}>
          <CompanyCTAClient companyName={company.companyName} companyId={company.idCompany} />
        </Suspense>
      </main>
    </div>
  );
}