// components/home-content.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllCompanies, getFeaturedProducts } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Company } from '@/db/schema';
import { CompanyCard } from '@/components/company-card';
import { CompanyCardSkeleton } from '@/components/company-card-skeleton';
import ProductCard from '@/components/product-card';
import { ProductCardSkeleton } from '@/components/product-card-skeleton';

// Define types for our data
type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;



interface HomeContentProps {
  initialCompanies: CompanyType[];
  initialFeaturedProducts: (ProductType & { company: CompanyType })[];
}

export default function HomeContent({ initialCompanies, initialFeaturedProducts }: HomeContentProps) {
  const [featuredCompanies, setFeaturedCompanies] = useState<CompanyType[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<(ProductType & { company: CompanyType })[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured manufacturers and products
  const loadData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Use initial data for featured companies or fetch more if needed
      setFeaturedCompanies(initialCompanies);
      setFeaturedProducts(initialFeaturedProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initialCompanies, initialFeaturedProducts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="w-full">
      {/* Hero Section with Search */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F01457] to-[#F01457]/80">
            Connect with Global Manufacturers
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Find trusted suppliers and verified manufacturers worldwide.
          </p>
          
          {/* Search Form */}
          <form className="mt-8 max-w-4xl mx-auto" action="/explore" method="GET">
            <div className="p-4 md:p-6 rounded-xl shadow-lg bg-[#222222] border border-[#2d2d2d] flex flex-col md:flex-row gap-4 items-center">
              <input
                type="text"
                name="q"
                placeholder="Search for products or companies..."
                className="flex-grow bg-transparent border border-[#2d2d2d] rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#F01457]/50"
              />
              <select
                name="category"
                className="w-full md:w-[180px] bg-transparent border border-[#2d2d2d] rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#F01457]/50 text-slate-400"
              >
                <option value="">All Industries</option>
                <option value="construction">Construction</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="food">Food & Beverage</option>
                <option value="machinery">Machinery</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="automotive">Automotive</option>
              </select>
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Manufacturers Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Manufacturers</h2>
            <p className="text-slate-400">
              Watch video tours and connect directly with verified manufacturers.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <CompanyCardSkeleton key={i} aspectRatio="video" />
              ))}
            </div>
          ) : featuredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCompanies.map((company) => (
                <CompanyCard key={company.idCompany} company={company} aspectRatio="video" />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-lg">No featured manufacturers available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Catalog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Product Catalog</h2>
            <p className="text-slate-400">
              Browse thousands of products from verified manufacturers.
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.idProduct} product={product} cardType="detail" aspectRatio="video" showCategory={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-lg">No featured products available.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl p-12 text-center bg-gradient-to-r from-[#F01457]/20 to-[#F01457]/10">
            <h2 className="text-4xl font-bold">Grow Your Business with Us</h2>
            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of verified suppliers connecting with buyers worldwide.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="mt-8 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white">Register Your Company</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}