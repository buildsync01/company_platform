import { Card } from '@/components/ui/card';
import { db } from '@/db';
import { companies } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Image from 'next/image';

interface CompanyInfoSectionProps {
  companyId: string;
}

export async function CompanyInfoSection({ companyId }: CompanyInfoSectionProps) {
  // Fetch company data
  const company = await db.query.companies.findFirst({
    where: eq(companies.idCompany, companyId),
  });

  if (!company) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-[#1a1a1a] to-[#222222]/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-[#F01457] to-[#F01457]/50 px-6 py-2 rounded-full mb-4">
            <span className="text-white font-semibold">Company Details</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Company Information
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F01457] to-transparent mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="space-y-8">
          {/* Company Details Card - Full Width */}
          <Card className="bg-gradient-to-br from-[#222222] to-[#2a2a2a] rounded-2xl border border-[#2d2d2d] p-6 shadow-[0_0_30px_#F01457]/10 hover:shadow-[0_0_40px_#F01457]/15 transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-8 bg-gradient-to-b from-[#F01457] to-[#F01457]/50 rounded-full"></div>
              <h3 className="text-2xl font-bold text-white">Company Details</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.email && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Email</div>
                    <div className="text-white font-medium mt-1">{company.email}</div>
                  </div>
                )}
                
                {company.phone && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Phone</div>
                    <div className="text-white font-medium mt-1">{company.phoneCode ? `+${company.phoneCode} ${company.phone}` : company.phone}</div>
                  </div>
                )}
                
                {company.companyType && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Type</div>
                    <div className="text-white font-medium mt-1">{company.companyType}</div>
                  </div>
                )}
                
                {company.tradeRole && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Trade Role</div>
                    <div className="text-white font-medium mt-1">{company.tradeRole}</div>
                  </div>
                )}
                
                {company.status && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Status</div>
                    <div className={`font-medium mt-1 ${company.status.toLowerCase() === 'active' ? 'text-green-400' : 'text-amber-400'}`}>
                        {company.status}
                    </div>
                  </div>
                )}
                
                {company.cityId && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Location</div>
                    <div className="text-white font-medium mt-1">{company.cityId}</div>
                  </div>
                )}
                
                <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                  <div className="text-slate-400 text-sm">Member Since</div>
                  <div className="text-white font-medium mt-1">{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'Unknown'}</div>
                </div>
                
                {company.companyVerifiedAt && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                    <div className="text-slate-400 text-sm">Verification</div>
                    <div className="text-green-400 font-medium mt-1 flex items-center gap-2">
                      <span>✓ Verified</span>
                    </div>
                  </div>
                )}
                
                {/* Manufacturing Info - Integrated into Company Details */}
                {company.isManufacture !== undefined && (
                  <div className="bg-gradient-to-r from-[#2a2a2a]/50 to-[#2d2d2d]/50 p-4 rounded-xl border border-[#2d2d2d]/50 lg:col-span-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-slate-400 text-sm">Manufacturing</div>
                        <div className={`font-medium mt-1 ${company.isManufacture ? 'text-green-400' : 'text-amber-400'}`}>
                          {company.isManufacture ? 'Manufacturing Company' : 'Trading Company'}
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${company.isManufacture ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {company.isManufacture ? 'Yes' : 'No'}
                      </div>
                    </div>
                    
                    {company.manufacturePicture && (
                      <div className="mt-3">
                        <div className="text-slate-400 text-sm mb-2">Manufacture Facility</div>
                        <div className="mt-2">
                          <Image 
                            src={company.manufacturePicture} 
                            alt="Manufacture facility" 
                            width={300} 
                            height={200} 
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Additional Company Fields - Integrated into Company Details */}
                {company.username && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50 lg:col-span-3">
                    <div className="text-slate-400 text-sm">Username</div>
                    <div className="text-white font-medium mt-1">{company.username}</div>
                  </div>
                )}
                
                {company.cityId && !company.cityId.match(/^\s*$/) && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50 lg:col-span-3">
                    <div className="text-slate-400 text-sm">City</div>
                    <div className="text-white font-medium mt-1">{company.cityId}</div>
                  </div>
                )}
                
                {(company.temporaryName || company.pronunciation) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-3">
                    {company.temporaryName && (
                      <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                        <div className="text-slate-400 text-sm">Temporary Name</div>
                        <div className="text-white font-medium mt-1">{company.temporaryName}</div>
                      </div>
                    )}
                    
                    {company.pronunciation && (
                      <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50">
                        <div className="text-slate-400 text-sm">Pronunciation</div>
                        <div className="text-white font-medium mt-1">{company.pronunciation}</div>
                      </div>
                    )}
                  </div>
                )}
                
                {company.companyVerifiedAt && (
                  <div className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#2d2d2d]/50 lg:col-span-3">
                    <div className="text-slate-400 text-sm">Verified At</div>
                    <div className="text-green-400 font-medium mt-1">{new Date(company.companyVerifiedAt).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Additional Information - Side by side with Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Banner Image */}
              {company.imageBanner && (
                <Card className="bg-gradient-to-br from-[#222222] to-[#2a2a2a] rounded-2xl border border-[#2d2d2d] p-6 shadow-[0_0_30px_#F01457]/10 hover:shadow-[0_0_40px_#F01457]/15 transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-b from-[#F01457] to-[#F01457]/50 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">Company Banner</h3>
                  </div>
                  
                  <div className="mt-2">
                    <Image 
                      src={company.imageBanner} 
                      alt="Company Banner" 
                      width={500} 
                      height={200} 
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  </div>
                </Card>
              )}
            </div>
            
            {/* Files */}
            <div className="space-y-6">
              {company.companyProfileFile && (
                <Card className="bg-gradient-to-br from-[#222222] to-[#2a2a2a] rounded-2xl border border-[#2d2d2d] p-6 shadow-[0_0_30px_#F01457]/10 hover:shadow-[0_0_40px_#F01457]/15 transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-b from-[#F01457] to-[#F01457]/50 rounded-full"></div>
                    <h3 className="text-xl font-bold text-white">Documents</h3>
                  </div>
                  
                  <a 
                    href={company.companyProfileFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white text-center py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    Company Profile
                  </a>
                </Card>
              )}
              
              {company.productCatalog && (
                <Card className="bg-gradient-to-br from-[#222222] to-[#2a2a2a] rounded-2xl border border-[#2d2d2d] p-6 shadow-[0_0_30px_#F01457]/10 hover:shadow-[0_0_40px_#F01457]/15 transition-shadow duration-300">
                  <a 
                    href={company.productCatalog} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-center py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow"
                  >
                    Product Catalog
                  </a>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}