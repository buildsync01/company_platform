// app/explore/components/explore-companies-client.tsx
'use client';

import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { getLimitedCompanies, getCompaniesByCategoryWithLimit, searchCompanies } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Product, Company } from '@/db/schema';
import { CompanyCard } from '@/components/company-card';
import { CompanyCardSkeleton } from '@/components/company-card-skeleton';

// Define types for our data
type ProductType = typeof Product.$inferSelect;
type CompanyType = typeof Company.$inferSelect;

interface ExploreCompaniesClientProps {
  initialCompanies: CompanyType[];
  initialSearchQuery: string;
  initialCategory: string;
}

// Available categories
const CATEGORIES = [
  { label: 'All Industries', value: 'all' },
  { label: 'Construction', value: 'construction' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Food & Beverage', value: 'food' },
  { label: 'Machinery', value: 'machinery' },
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Automotive', value: 'automotive' },
];

export default function ExploreCompaniesClient({ 
  initialCompanies, 
  initialSearchQuery,
  initialCategory
}: ExploreCompaniesClientProps) {
  const [companies, setCompanies] = useState<CompanyType[]>(initialCompanies);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory && initialCategory !== 'all' ? [initialCategory] : []
  );
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [showCategories, setShowCategories] = useState(false);
  const [searchCategoryTerm, setSearchCategoryTerm] = useState('');

  // Fetch companies based on categories and search query
  const fetchCompanies = useCallback(async (searchParam: string = searchQuery, categoriesParam: string[] = selectedCategories) => {
    setIsLoading(true);
    
    try {
      let newCompaniesData: CompanyType[] = [];

      if (searchParam) {
        // If there's a search query, search across companies
        newCompaniesData = await searchCompanies(searchParam);
      } else if (categoriesParam.length > 0) {
        // If there are category filters
        // For multi-category, we'll search across all selected categories
        const allResults = [];
        for (const category of categoriesParam) {
          const results = await getCompaniesByCategoryWithLimit(category, 50);
          allResults.push(...results);
        }
        // Remove duplicates based on idCompany
        const uniqueCompanies = allResults.filter((comp, index, self) =>
          index === self.findIndex(c => c.idCompany === comp.idCompany)
        );
        newCompaniesData = uniqueCompanies;
      } else {
        // Default: get all companies
        newCompaniesData = await getLimitedCompanies(50); // Default limit for explore page
      }

      setCompanies(newCompaniesData);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategories]); // Dependencies moved to function parameters

  // Initial load
  useEffect(() => {
    fetchCompanies(initialSearchQuery, initialCategory && initialCategory !== 'all' ? [initialCategory] : []);
  }, []); // Empty dependency array means this only runs once on mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies(searchQuery, selectedCategories); // Now fetchCompanies will be called on submit
  };

  const toggleCategory = (category: string) => {
    if (category === 'all') {
      // For 'all', clear all selections except 'all'
      setSelectedCategories([]);
    } else {
      // Toggle the category in the list
      setSelectedCategories(prev => 
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
    setSearchCategoryTerm('');
  };

  // Handle keyboard events for category search
  const handleCategorySearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // When user presses Enter, don't submit the form, just handle the keyboard event
      e.preventDefault();
    }
  };

  // Filtered categories based on search term
  const filteredCategories = CATEGORIES.filter(cat => 
    cat.value !== 'all' && 
    cat.label.toLowerCase().includes(searchCategoryTerm.toLowerCase())
  );

  return (
    <>
      {/* Search and Filter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Explore Companies</h1>
          
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8">
            <Card className="p-4 md:p-6 rounded-2xl shadow-lg bg-[#222222] border border-[#2d2d2d]">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Input 
                  placeholder='Search for companies...' 
                  className="flex-grow bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                
                {/* Category selection with dropdown and search */}
                <div className="relative w-full md:w-64">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-transparent border-0 text-slate-400 hover:bg-[#3a3a3a] hover:text-white"
                    onClick={() => setShowCategories(!showCategories)}
                  >
                    {selectedCategories.length === 0 
                      ? 'Select Categories' 
                      : `${selectedCategories.length} ${selectedCategories.length > 1 ? 'Categories' : 'Category'} selected`}
                  </Button>
                  
                  {/* Category dropdown with search */}
                  {showCategories && (
                    <div className="absolute z-10 w-full mt-2 bg-[#2a2a2a] border border-[#2d2d2d] rounded-lg shadow-lg">
                      <div className="p-2 border-b border-[#2d2d2d]">
                        <Input
                          type="text"
                          placeholder="Search categories..."
                          className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                          autoFocus
                          onChange={(e) => setSearchCategoryTerm(e.target.value)}
                          onKeyDown={handleCategorySearchKeyDown}
                          value={searchCategoryTerm}
                        />
                      </div>
                      <div className="p-2 max-h-60 overflow-y-auto">
                        <div className="space-y-2">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div key={category.value} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={category.value}
                                  checked={selectedCategories.includes(category.value)}
                                  onChange={() => toggleCategory(category.value)}
                                  className="h-4 w-4 rounded border-gray-300 text-[#F01457] focus:ring-[#F01457]"
                                />
                                <label 
                                  htmlFor={category.value} 
                                  className="text-sm font-medium leading-none"
                                >
                                  {category.label}
                                </label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-slate-400 text-sm py-4">
                              No categories found matching "{searchCategoryTerm}"
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="w-full md:w-auto bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
              
              {/* Selected categories chips */}
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCategories.map((category) => {
                    const catObj = CATEGORIES.find(c => c.value === category);
                    if (!catObj) return null;
                    
                    return (
                      <div 
                        key={category} 
                        className="bg-[#F01457]/20 text-[#F01457] text-sm px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {catObj.label}
                        <button 
                          type="button" 
                          onClick={() => toggleCategory(category)}
                          className="text-white hover:text-slate-200"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="text-xs text-slate-400 hover:text-slate-200 p-1 h-auto"
                    onClick={handleResetFilters}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </Card>
          </form>
          
          {/* Results Count */}
          <div className="text-center text-slate-400 mb-8">
            {isLoading ? 'Loading...' : `Total Companies Registered : ${companies.length}`}
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <CompanyCardSkeleton key={i} aspectRatio="video" />
              ))}
            </div>
          ) : companies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {companies.map((company) => (
                <CompanyCard key={company.idCompany} company={company} aspectRatio="video" />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-slate-400 text-xl">No companies found matching your criteria.</p>
              <p className="text-slate-500 mt-2">Try adjusting your search or filter.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}