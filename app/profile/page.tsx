import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { getUserById } from '@/lib/auth';
import { getUserCompany, createCompany, createProduct, deleteProduct, getUserProducts, updateProduct, deleteProductAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Package, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar,
  Edit3,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Check,
  X
} from 'lucide-react';

async function getUser() {
  const token = (await cookies()).get('auth_token')?.value;
  

  if (!token) {
    redirect('/sign-in');
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    redirect('/sign-in');
  }

  const user = await getUserById(decoded.userId);

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

export default async function ProfilePage() {
  const user = await getUser();
  const company = await getUserCompany();

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f5f5f5]">My Profile</h1>
          <p className="text-[#b0b0b0] mt-2">Manage your company and products</p>
        </div>

        {!company ? (
          // Company Creation Form
          <div className="max-w-3xl mx-auto">
            <Card className="bg-[#222222] shadow-lg rounded-2xl border border-[#2d2d2d]">
              <CardHeader className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white rounded-t-2xl p-6">
                <CardTitle className="flex items-center gap-3">
                  <Building2 className="h-6 w-6" />
                  <span>Create Your Company Profile</span>
                </CardTitle>
                <p className="text-white/80 mt-2">
                  Fill in your company details to start showcasing your products.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <form action={async (formData: FormData) => {
                  'use server';
                  await createCompany(null, formData);
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-[#f5f5f5]">Company Name *</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="Enter your company name"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#f5f5f5]">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="company@example.com"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#f5f5f5]">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 123-4567"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website" className="text-[#f5f5f5]">Website</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://www.example.com"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-[#f5f5f5]">Category</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="category"
                          name="category"
                          placeholder="e.g. Technology, Manufacturing, Services"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-[#f5f5f5]">Company Size</Label>
                      <Select name="companySize">
                        <SelectTrigger className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus:ring-[#F01457]/50">
                          <SelectValue placeholder="Select company size" className="[&>span]:text-[#b0b0b0]" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#222222] border-[#2d2d2d] text-[#f5f5f5]">
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="establishedYear" className="text-[#f5f5f5]">Established Year</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-[#b0b0b0]" />
                        <Input
                          id="establishedYear"
                          name="establishedYear"
                          type="number"
                          min="1800"
                          max={new Date().getFullYear()}
                          placeholder="Year company was established"
                          className="pl-10 bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="slogan" className="text-[#f5f5f5]">Slogan</Label>
                      <Input
                        id="slogan"
                        name="slogan"
                        placeholder="Brief tagline for your company"
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-[#f5f5f5]">About Company</Label>
                    <Textarea
                      id="about"
                      name="about"
                      placeholder="Tell us about your company, its mission, and what sets you apart"
                      rows={4}
                      className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#F01457] to-[#F01457]/80 hover:from-[#d0104a] hover:to-[#d0104a]/80 text-white py-3"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Company Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Company Dashboard
          <div className="space-y-6">
            {/* User Info Card */}
            <Card className="bg-[#222222] shadow-lg rounded-2xl border border-[#2d2d2d]">
              <CardHeader className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-[#F01457]/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-[#F01457]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#f5f5f5]">{user.email}</h2>
                    <p className="text-[#b0b0b0]">Account created: {user.createdAt?.toString()}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            
            {/* Company Info Card */}
            <Card className="bg-[#222222] shadow-lg rounded-2xl border border-[#2d2d2d]">
              <CardHeader className="bg-gradient-to-r from-[#F01457] to-[#F01457]/80 text-white rounded-t-2xl p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8" />
                      <h2 className="text-2xl font-bold">{company.companyName}</h2>
                    </div>
                    <p className="text-white/80 mt-1">{company.slogan}</p>
                  </div>
                  <Badge variant="secondary" className="bg-[#F01457]/20 text-[#f5f5f5]">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Email</p>
                      <p className="font-medium text-[#f5f5f5]">{company.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Phone</p>
                      <p className="font-medium text-[#f5f5f5]">{company.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Website</p>
                      <p className="font-medium text-[#f5f5f5]">{company.website || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Category</p>
                      <p className="font-medium text-[#f5f5f5]">{company.category || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Size</p>
                      <p className="font-medium text-[#f5f5f5]">{company.companySize || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#F01457] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#b0b0b0]">Established</p>
                      <p className="font-medium text-[#f5f5f5]">{company.establishedYear || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6 bg-[#2d2d2d]" />
                
                <div className="space-y-2">
                  <p className="text-sm text-[#b0b0b0]">About</p>
                  <p className="text-[#f5f5f5]">{company.about || 'No description provided.'}</p>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-[#2d2d2d] text-[#f5f5f5] hover:bg-[#F01457]/20 hover:border-[#F01457]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Company
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Products Section */}
            <Card className="bg-[#222222] shadow-lg rounded-2xl border border-[#2d2d2d]">
              <CardHeader className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-[#f5f5f5]">
                      <Package className="h-5 w-5 text-[#F01457]" />
                      Products
                    </CardTitle>
                    <p className="text-[#b0b0b0] text-sm mt-1">Manage your product catalog</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Add Product Form */}
                <form action={async (formData: FormData) => {
                  'use server';
                  await createProduct(null, formData);
                }} className="mb-8 p-4 bg-[#1a1a1a] rounded-2xl border border-[#2d2d2d]">
                  <h3 className="font-medium mb-4 flex items-center gap-2 text-[#f5f5f5]">
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#f5f5f5]">Product Name *</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Enter product name" 
                        required 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unitName" className="text-[#f5f5f5]">Unit Name</Label>
                      <Input 
                        id="unitName" 
                        name="unitName" 
                        placeholder="e.g. pcs, kg, unit" 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priceMin" className="text-[#f5f5f5]">Minimum Price</Label>
                      <Input 
                        id="priceMin" 
                        name="priceMin" 
                        placeholder="e.g. $10.00" 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priceMax" className="text-[#f5f5f5]">Maximum Price</Label>
                      <Input 
                        id="priceMax" 
                        name="priceMax" 
                        placeholder="e.g. $15.00" 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="moq" className="text-[#f5f5f5]">MOQ (Minimum Order Quantity)</Label>
                      <Input 
                        id="moq" 
                        name="moq" 
                        placeholder="e.g. 100 units" 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="imageMain" className="text-[#f5f5f5]">Image URL</Label>
                      <Input 
                        id="imageMain" 
                        name="imageMain" 
                        placeholder="https://example.com/image.jpg" 
                        className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="description" className="text-[#f5f5f5]">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Describe your product" 
                      rows={3}
                      className="bg-[#1a1a1a] border-[#2d2d2d] text-[#f5f5f5] focus-visible:ring-[#F01457]/50"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="mt-4 bg-gradient-to-r from-[#F01457] to-[#F01457]/80 hover:from-[#d0104a] hover:to-[#d0104a]/80"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </form>
                
                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.products && company.products.length > 0 ? (
                    company.products.map((product) => (
                      <Card 
                        key={product.idProduct} 
                        className="border border-[#2d2d2d] hover:shadow-[0_0_15px_#F01457]/10 transition-all hover:scale-[1.02] bg-[#1a1a1a]"
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-[#f5f5f5]">{product.name}</h3>
                            <form action={async (formData: FormData) => {
                              'use server';
                              await deleteProductAction(null, formData);
                            }} className="ml-2">
                              <input type="hidden" name="productId" value={product.idProduct} />
                              <Button 
                                type="submit" 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 border-[#2d2d2d] hover:bg-red-500/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </form>
                          </div>
                          <p className="text-sm text-[#b0b0b0] mt-2 line-clamp-2">{product.description || 'No description'}</p>
                          
                          <div className="mt-4 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#b0b0b0]">Price:</span>
                              <span className="font-medium text-[#f5f5f5]">{product.priceMin || 'N/A'} - {product.priceMax || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#b0b0b0]">MOQ:</span>
                              <span className="font-medium text-[#f5f5f5]">{product.moq || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#b0b0b0]">Unit:</span>
                              <span className="font-medium text-[#f5f5f5]">{product.unitName || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Package className="h-12 w-12 text-[#b0b0b0] mx-auto" />
                      <h3 className="mt-4 text-lg font-medium text-[#f5f5f5]">No products yet</h3>
                      <p className="mt-2 text-[#b0b0b0]">
                        Get started by adding your first product to your catalog.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}