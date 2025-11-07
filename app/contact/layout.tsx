import { SiteHeader } from '@/components/site-header';

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
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