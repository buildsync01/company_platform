import { db } from '@/db';
import { products, companies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site-header';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ProductCTAClient from '@/components/product-cta-client';
import ProductContactClient from '@/components/product-contact-client';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// Server component untuk bagian utama produk
function ProductMainSection({ product }: { product: any }) {
  return (
    <section className="py-12 border-b border-[#2d2d2d]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            {product.imageMain ? (
              <Image 
                src={product.imageMain} 
                alt={product.name} 
                width={600} 
                height={600} 
                className="w-full h-auto rounded-2xl object-cover border border-[#2d2d2d]"
              />
            ) : (
              <div className="w-full h-96 bg-slate-700 rounded-2xl flex items-center justify-center">
                <span className="text-slate-500">Product Image Not Available</span>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/2">
            <div className="mb-4">
              <Link href={`/company/${product.company.idCompany}`}>
                <span className="text-[#F01457] hover:underline cursor-pointer">{product.company.companyName}</span>
              </Link>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="text-2xl font-bold text-[#F01457]">
                {product.priceMin || product.priceMax || 'Price not specified'}
              </div>
              {product.moq && (
                <div className="text-slate-400">
                  <span className="font-medium">MOQ:</span> {product.moq}
                </div>
              )}
            </div>
            
            <p className="text-slate-300 mb-8">
              {product.description || 'No description available for this product.'}
            </p>
            
            <Suspense fallback={<div className="flex gap-4"><Button className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white px-8" disabled>Loading...</Button></div>}>
              <ProductContactClient product={product} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

// Server component untuk informasi produk
function ProductInfoSection({ product }: { product: any }) {
  return (
    <section className="py-12 border-b border-[#2d2d2d]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Product Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-[#222222] p-6 rounded-2xl border border-[#2d2d2d]">
            <h3 className="text-xl font-semibold mb-4 text-[#F01457]">Supplier Details</h3>
            
            <div className="flex items-center gap-4 mb-6">
              {product.company.imageProfile ? (
                <Image 
                  src={product.company.imageProfile} 
                  alt={product.company.companyName} 
                  width={60} 
                  height={60} 
                  className="rounded-xl object-cover"
                />
              ) : (
                <div className="w-15 h-15 rounded-xl bg-slate-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#F01457]">{product.company.companyName.charAt(0)}</span>
                </div>
              )}
              <div>
                <h4 className="font-bold text-lg">{product.company.companyName}</h4>
                <p className="text-slate-400 text-sm">{product.company.slogan}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {product.company.category && (
                <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span>{product.company.category}</span>
                </div>
              )}
              {product.company.companySize && (
                <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                  <span className="text-slate-400">Company Size:</span>
                  <span>{product.company.companySize}</span>
                </div>
              )}
              {product.company.establishedYear && (
                <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                  <span className="text-slate-400">Established:</span>
                  <span>{product.company.establishedYear}</span>
                </div>
              )}
            </div>

            <Link href={`/company/${product.company.idCompany}`}>
              <Button variant="outline" className="w-full mt-6 border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d]">
                View Supplier Profile
              </Button>
            </Link>
          </Card>
          
          <Card className="bg-[#222222] p-6 rounded-2xl border border-[#2d2d2d]">
            <h3 className="text-xl font-semibold mb-4 text-[#F01457]">Product Specifications</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                <span className="text-slate-400">Product Name:</span>
                <span>{product.name}</span>
              </div>
              
              <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                <span className="text-slate-400">Price:</span>
                <span>{product.priceMin || product.priceMax || 'Not specified'}</span>
              </div>
              
              <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                <span className="text-slate-400">MOQ:</span>
                <span>{product.moq || 'Not specified'}</span>
              </div>
              
              <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                <span className="text-slate-400">Unit:</span>
                <span>{product.unitName || 'Not specified'}</span>
              </div>
              
              <div className="flex justify-between border-b border-[#2d2d2d] pb-2">
                <span className="text-slate-400">Added:</span>
                <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;

  // Fetch product data with its company
  const product = await db.query.products.findFirst({
    where: eq(products.idProduct, productId),
    with: {
      company: true
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader />
      <main className="pt-16">
        <ProductMainSection product={product} />
        <ProductInfoSection product={product} />

        {/* CTA Section */}
        <Suspense fallback={<div className="py-16 text-center text-slate-400">Loading contact options...</div>}>
          <ProductCTAClient product={product} />
        </Suspense>
      </main>
    </div>
  );
}