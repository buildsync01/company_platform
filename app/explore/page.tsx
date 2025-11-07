// app/explore/page.tsx
import { Suspense } from 'react';
import { SiteHeader } from '@/components/site-header';
import ExploreCompaniesClient from './components/explore-companies-client';
import { getAllCompanies } from '@/app/actions';

interface SearchParams {
  q?: string;
  category?: string;
}

export default async function ExploreCompaniesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const initialCompanies = await getAllCompanies();
  const searchQuery = searchParams.q || '';
  const category = searchParams.category || 'all';

  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader currentPage="explore" />
      <main className="pt-16">
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading companies...</div>}>
          <ExploreCompaniesClient 
            initialCompanies={initialCompanies} 
            initialSearchQuery={searchQuery}
            initialCategory={category}
          />
        </Suspense>
      </main>
    </div>
  );
}