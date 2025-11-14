import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import ProductsClient from './components/products-client';
import { getAllProducts } from '@/app/actions';

export default async function ProductsPage() {
  // Fetch first page of products (8 items)
  const initialProducts = await getAllProducts(1, 8);

  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader currentPage="products" />
      <main className="pt-16">
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading products...</div>}>
          <ProductsClient initialProducts={initialProducts} />
        </Suspense>
      </main>
    </div>
  );
}