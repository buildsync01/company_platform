import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from 'react';
import AsyncHomeData from '@/components/async-home-data';

export default function Home() {
  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader />

      <main className="pt-16">
        <Suspense fallback={
          <div className="py-20">
            {/* Hero Skeleton */}
            <section className="py-20 text-center">
              <div className="container mx-auto px-4">
                <div className="h-10 bg-slate-700 rounded w-3/4 max-w-2xl mx-auto mb-4"></div>
                <div className="h-5 bg-slate-700 rounded w-1/2 max-w-xl mx-auto mb-8"></div>
                
                {/* Search Form Skeleton */}
                <div className="max-w-4xl mx-auto">
                  <div className="p-4 md:p-6 rounded-xl bg-[#222222] border border-[#2d2d2d] flex flex-col md:flex-row gap-4 items-center">
                    <div className="h-12 flex-grow bg-slate-700 rounded-lg"></div>
                    <div className="w-full md:w-[180px] h-12 bg-slate-700 rounded-lg"></div>
                    <div className="w-full md:w-auto h-12 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Manufacturers Skeleton */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <div className="h-8 bg-slate-700 rounded w-64 max-w-xl mx-auto mb-4"></div>
                  <div className="h-5 bg-slate-700 rounded w-1/2 max-w-md mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[#222222] rounded-xl border border-[#2d2d2d] overflow-hidden animate-pulse">
                      {/* Image header with correct aspect ratio */}
                      <div className="relative pt-[100%] bg-slate-700"> {/* 1:1 aspect ratio */}
                        <div className="absolute inset-0 bg-slate-700"></div>
                      </div>
                      <div className="p-5">
                        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="h-6 bg-slate-700 rounded-full w-16"></div>
                          <div className="h-6 bg-slate-700 rounded-full w-20"></div>
                        </div>
                        
                        <div className="w-full h-10 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Product Catalog Skeleton */}
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <div className="h-8 bg-slate-700 rounded w-64 max-w-xl mx-auto mb-4"></div>
                  <div className="h-5 bg-slate-700 rounded w-1/2 max-w-md mx-auto"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-[#222222] rounded-xl border border-[#2d2d2d] overflow-hidden animate-pulse">
                      {/* Product image with correct aspect ratio */}
                      <div className="relative pt-[100%] bg-slate-700"> {/* 1:1 aspect ratio */}
                        <div className="absolute inset-0 bg-slate-700"></div>
                      </div>
                      <div className="p-5">
                        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2 mb-3"></div>
                        
                        <div className="mb-4">
                          <div className="h-4 bg-slate-700 rounded w-1/3 mb-1"></div>
                          <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                        </div>
                        
                        <div className="flex gap-2">
                          <div className="flex-1 h-10 bg-slate-700 rounded"></div>
                          <div className="flex-1 h-10 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        }>
          <AsyncHomeData />
        </Suspense>
      </main>
    </div>
  );
}