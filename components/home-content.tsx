'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllCompanies, getFeaturedProducts, getCompaniesByCategory, searchCompanies as searchCompaniesFull } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Company } from '@/db/schema';

// Define types for our data
type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;

// Component to display a company card with company info only (no products)
function CompanyCard({ company }: { company: CompanyType }) {
  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden hover:shadow-[0_0_30px_#F01457]/20 transition-shadow duration-300 group">
      {/* Company Image Header */}
      <div className="relative aspect-video overflow-hidden">
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

// Component to display a featured product
function FeaturedProductCard({ product }: { product: ProductType & { company: CompanyType } }) {
  return (
    <Card key={product.idProduct} className="bg-[#222222] rounded-2xl shadow-[0_0_15px_#F01457]/10 border border-[#2d2d2d] p-4 w-[280px] flex-shrink-0">
      {product.imageMain ? (
        <Image 
          src={product.imageMain} 
          alt={product.name} 
          width={240} 
          height={240} 
          className="w-full h-60 rounded-lg object-cover mb-4 aspect-square"
        />
      ) : (
        <div className="w-full h-60 bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-slate-500">No Image</span>
        </div>
      )}
      <h4 className="font-semibold truncate">{product.name}</h4>
      <Link href={`/company/${product.company.idCompany}`}>
        <p className="text-sm text-slate-400 hover:text-[#F01457] cursor-pointer">{product.company.companyName}</p>
      </Link>
      <Link href={`/product/${product.idProduct}`}>
        <Button className="w-full mt-4 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white">View Product</Button>
      </Link>
    </Card>
  );
}

// Skeleton loader for company cards
function CompanyCardSkeleton() {
  return (
    <Card className="bg-[#222222] rounded-2xl border border-[#2d2d2d] overflow-hidden animate-pulse">
      {/* Image header skeleton with proper aspect ratio */}
      <div className="relative pt-[56.25%] bg-slate-700"> {/* 16:9 aspect ratio */}
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

// Skeleton loader for featured product cards
function FeaturedProductCardSkeleton() {
  return (
    <Card className="bg-[#222222] rounded-2xl shadow-[0_0_15px_#F01457]/10 border border-[#2d2d2d] p-4 w-[280px] flex-shrink-0 animate-pulse">
      <div className="w-full h-60 rounded-lg bg-slate-700 mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-slate-700 rounded w-1/2 mb-4"></div>
      <div className="w-full h-10 bg-slate-700 rounded"></div>
    </Card>
  );
}

interface HomeContentProps {
  initialCompanies: CompanyType[];
  initialFeaturedProducts: (ProductType & { company: CompanyType })[];
}

export default function HomeContent({ initialCompanies, initialFeaturedProducts }: HomeContentProps) {
  const [companies, setCompanies] = useState<CompanyType[]>(initialCompanies);
  const [featuredProducts, setFeaturedProducts] = useState<(ProductType & { company: CompanyType })[]>(initialFeaturedProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data based on category and search query
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let newCompaniesData: CompanyType[] = [];
      let newFeaturedProductsData: (ProductType & { company: CompanyType })[] = [];

      if (searchQuery) {
        // If there's a search query, search across companies
        newCompaniesData = await searchCompaniesFull(searchQuery);
        // For featured products, we can also filter but for now just get all featured
        newFeaturedProductsData = await getFeaturedProducts(8);
      } else if (category && category !== 'all') {
        // If there's a category filter
        newCompaniesData = await getCompaniesByCategory(category);
        newFeaturedProductsData = await getFeaturedProducts(8);
      } else {
        // Default: get all companies and featured products
        newCompaniesData = await getAllCompanies();
        newFeaturedProductsData = await getFeaturedProducts(8);
      }

      setCompanies(newCompaniesData);
      setFeaturedProducts(newFeaturedProductsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [category, searchQuery]);

  // Initial load and when category/search changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // fetchData will be called due to useEffect
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  return (
    <div className="w-full">
      {/* Hero Section with Search */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F01457] to-[#F01457]/80">
            Find Verified Suppliers & Products You Can Trust
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Discover top companies and their best-selling products from various industries.
          </p>
          <form onSubmit={handleSearch} className="mt-8 max-w-4xl mx-auto">
            <Card className="p-4 md:p-6 rounded-2xl shadow-lg bg-[#222222] border border-[#2d2d2d]">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Input 
                  placeholder='Search for products or companies...' 
                  className="flex-grow bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full md:w-[180px] bg-transparent border-0 text-slate-400">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full md:w-auto bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </section>

      {/* Category Tabs / Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-transparent border-b border-[#2d2d2d] rounded-none mb-6">
              <button 
                className={`p-3 text-center ${category === 'all' || !category ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('all')}
              >
                All
              </button>
              <button 
                className={`p-3 text-center ${category === 'construction' ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('construction')}
              >
                Construction
              </button>
              <button 
                className={`p-3 text-center ${category === 'electronics' ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('electronics')}
              >
                Electronics
              </button>
              <button 
                className={`p-3 text-center ${category === 'fashion' ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('fashion')}
              >
                Fashion
              </button>
              <button 
                className={`p-3 text-center ${category === 'food' ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('food')}
              >
                Food & Beverage
              </button>
              <button 
                className={`p-3 text-center ${category === 'machinery' ? 'border-b-2 border-[#F01457] text-[#F01457]' : 'text-slate-400 hover:text-white'}`}
                onClick={() => handleCategoryChange('machinery')}
              >
                Machinery
              </button>
            </div>
            
            {/* Combined Listing: Companies with their Products */}
            <div className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <CompanyCardSkeleton key={i} />
                  ))}
                </div>
              ) : companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {companies.map((company) => (
                    <CompanyCard key={company.idCompany} company={company} />
                  ))}
                </div>
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-slate-400">No companies found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">🔥 Popular Products</h2>
          {isLoading ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-6 pb-4">
                {[...Array(8)].map((_, i) => (
                  <FeaturedProductCardSkeleton key={i} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : featuredProducts.length > 0 ? (
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-6 pb-4">
                {featuredProducts.map((product) => (
                  <FeaturedProductCard key={product.idProduct} product={product} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <p className="text-slate-400 text-center">No featured products available.</p>
          )}
        </div>
      </section>
    </div>
  );
}