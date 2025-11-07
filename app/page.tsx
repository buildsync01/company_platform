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
                <form className="mt-8 max-w-4xl mx-auto">
                  <div className="p-4 md:p-6 rounded-2xl shadow-lg bg-[#222222] border border-[#2d2d2d]">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="flex-grow h-12 bg-slate-700 rounded-lg animate-pulse"></div>
                      <div className="w-full md:w-[180px] h-12 bg-slate-700 rounded-lg animate-pulse"></div>
                      <div className="w-full md:w-auto h-12 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            {/* Category Tabs / Filter Section */}
            <section className="py-8">
              <div className="container mx-auto px-4">
                <div className="w-full">
                  <div className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-transparent border-b border-[#2d2d2d] rounded-none mb-6">
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                    <div className="p-3 text-center bg-slate-700/30 animate-pulse">Category</div>
                  </div>
                  
                  {/* Combined Listing: Companies with their Products */}
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#222222] rounded-2xl border border-[#2d2d2d] p-4 animate-pulse">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700"></div>
                            <div className="h-4 bg-slate-700 rounded w-1/3"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-[#2d2d2d] p-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded bg-slate-700"></div>
                                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="bg-[#2d2d2d] p-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded bg-slate-700"></div>
                                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="bg-[#2d2d2d] p-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded bg-slate-700"></div>
                                <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full h-10 mt-4 bg-slate-700 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-20">
              <div className="container mx-auto px-4">
                <div className="h-8 bg-slate-700 rounded w-64 mb-6 animate-pulse"></div>
                <div className="flex gap-6 pb-4 overflow-x-auto">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-[#222222] rounded-2xl border border-[#2d2d2d] p-4 w-[280px] flex-shrink-0 animate-pulse">
                      <div className="w-full h-60 rounded-lg bg-slate-700 mb-4"></div>
                      <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-700 rounded w-1/2 mb-4"></div>
                      <div className="w-full h-10 bg-slate-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        }>
          <AsyncHomeData />
        </Suspense>
        
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
      </main>
    </div>
  );
}