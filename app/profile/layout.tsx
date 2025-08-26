import { SiteHeader } from '@/components/site-header';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#1a1a1a] text-slate-50 min-h-screen">
      <SiteHeader />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}