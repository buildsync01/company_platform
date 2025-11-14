// app/products/components/products-client.tsx
'use client';

import { useState } from 'react';
import { getAllProducts, searchProducts } from '@/app/actions';
import { Product, Company } from '@/db/schema';
import ProductCard from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Define types for our data
type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;

type ProductWithCompany = ProductType & { company: CompanyType };

interface ProductsClientProps {
  initialProducts: ProductWithCompany[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<ProductWithCompany[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 8);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    try {
      let newProducts;
      if (searchQuery.trim()) {
        newProducts = await searchProducts(searchQuery, 1, 8);
      } else {
        newProducts = await getAllProducts(1, 8);
      }
      
      setProducts(newProducts);
      setPage(1); // Reset to first page after search
      setHasMore(newProducts.length === 8); // If we got 8 products, there might be more
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const goToPage = async (pageNum: number) => {
    if (pageNum < 1 || isLoading) return;
    
    setIsLoading(true);
    try {
      let newProducts;
      
      if (searchQuery) {
        newProducts = await searchProducts(searchQuery, pageNum, 8);
      } else {
        newProducts = await getAllProducts(pageNum, 8);
      }
      
      setProducts(newProducts);
      setPage(pageNum);
      
      // If we got fewer than 8 products on this page, there are no more
      setHasMore(newProducts.length === 8);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    if (!hasMore || isLoading) return;
    goToPage(page + 1);
  };

  const loadPrevPage = () => {
    if (page <= 1 || isLoading) return;
    goToPage(page - 1);
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">All Products</h1>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input 
                placeholder='Search for products...' 
                className="flex-grow bg-[#222222] border-[#2d2d2d] text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Button 
                className="w-full md:w-auto bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
                type="submit"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {products.length === 0 && !isSearching ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-xl">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.idProduct}>
                    <ProductCard product={product} cardType="detail" aspectRatio="video" />
                  </div>
                ))}
              </div>
              
              {/* Loading skeletons */}
              {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`} />
                  ))}
                </div>
              )}
              
              {/* Pagination Controls */}
              {!isLoading && products.length > 0 && (
                <div className="flex flex-col items-center gap-4 mt-12">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={loadPrevPage}
                      disabled={page <= 1 || isLoading}
                      className="border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d]"
                    >
                      Previous
                    </Button>
                    
                    <span className="mx-4 text-slate-400">
                      Page {page}
                    </span>
                    
                    <Button
                      variant="outline"
                      onClick={loadNextPage}
                      disabled={!hasMore || isLoading}
                      className="border-[#2d2d2d] text-slate-300 hover:bg-[#2d2d2d]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}