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
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading companies and products...</div>}>
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