import { getLimitedCompanies, getFeaturedProducts } from '@/app/actions';
import { Product, Company } from '@/db/schema';
import HomeContent from './home-content';

// Define types for our data
type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;

export default async function AsyncHomeData() {
  // Fetch initial data from server actions - only show first 4 companies on homepage
  const initialCompanies: CompanyType[] = await getLimitedCompanies(4);
  const initialFeaturedProducts: (ProductType & { company: CompanyType })[] = await getFeaturedProducts(8);

  // Pass the data to the client component
  return (
    <HomeContent 
      initialCompanies={initialCompanies} 
      initialFeaturedProducts={initialFeaturedProducts} 
    />
  );
}