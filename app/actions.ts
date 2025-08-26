'use server';

import { z } from 'zod';
import { db } from '@/db';
import { companies, products, users } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, and, or, ilike, count } from 'drizzle-orm';
import { cookies } from 'next/headers';

const createCompanySchema = z.object({
    companyName: z.string().min(3, "Company name must be at least 3 characters"),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().optional(),
    slogan: z.string().optional(),
    about: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    companySize: z.string().optional(),
    establishedYear: z.string().optional(),
    category: z.string().optional(),
});

export async function createCompany(prevState: any, formData: FormData) {
    try {
        // Get user ID from token
        const token = (await cookies()).get('auth_token')?.value;
        
        if (!token) {
            return { error: "You must be logged in to create a company." };
        }
        
        // Dynamically import verifyToken for Turbopack compatibility
        const { verifyToken } = await import('@/lib/auth');
        const decodedToken = await verifyToken(token);
        
        if (!decodedToken) {
            return { error: "Invalid or expired token." };
        }

        const userId = decodedToken.userId;

        const validatedFields = createCompanySchema.safeParse({
            companyName: formData.get('companyName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            slogan: formData.get('slogan'),
            about: formData.get('about'),
            website: formData.get('website'),
            companySize: formData.get('companySize'),
            establishedYear: formData.get('establishedYear'),
            category: formData.get('category'),
        });

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }

        await db.insert(companies).values({
            userId: userId,
            companyName: validatedFields.data.companyName,
            email: validatedFields.data.email,
            phone: validatedFields.data.phone,
            slogan: validatedFields.data.slogan,
            about: validatedFields.data.about,
            website: validatedFields.data.website,
            companySize: validatedFields.data.companySize,
            establishedYear: validatedFields.data.establishedYear,
            category: validatedFields.data.category,
        });
    } catch (error) {
        console.error('Error in createCompany:', error);
        return { error: "Failed to create company. Please try again." };
    }

    revalidatePath('/profile');
    redirect('/profile');
}

// Function to get all companies with their products (for homepage)
export async function getAllCompaniesWithProducts() {
    try {
        const companiesWithProducts = await db.query.companies.findMany({
            with: {
                products: {
                    limit: 3, // Limit to 3 featured products per company
                }
            },
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        return companiesWithProducts;
    } catch (error) {
        console.error('Error fetching companies with products:', error);
        return [];
    }
}

// Function to get all companies (for homepage - modern view without products)
export async function getAllCompanies() {
    try {
        const companiesList = await db.query.companies.findMany({
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        return companiesList;
    } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
    }
}

// Function to get featured/popular products
export async function getFeaturedProducts(limit: number = 8) {
    try {
        const { verifyToken } = await import('@/lib/auth');
        const featuredProducts = await db.query.products.findMany({
            limit: limit,
            with: {
                company: true
            },
            orderBy: (products, { desc }) => desc(products.createdAt),
        });
        return featuredProducts;
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
}

// Function to get companies with products by category
export async function getCompaniesWithProductsByCategory(category: string) {
    try {
        if (!category || category === 'all') {
            return await getAllCompaniesWithProducts();
        }
        
        const companiesWithProducts = await db.query.companies.findMany({
            where: eq(companies.category, category),
            with: {
                products: {
                    limit: 3,
                }
            },
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        return companiesWithProducts;
    } catch (error) {
        console.error('Error fetching companies with products by category:', error);
        return [];
    }
}

// Function to get companies by category (for modern homepage view)
export async function getCompaniesByCategory(category: string) {
    try {
        if (!category || category === 'all') {
            return await getAllCompanies();
        }
        
        const companiesList = await db.query.companies.findMany({
            where: eq(companies.category, category),
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        return companiesList;
    } catch (error) {
        console.error('Error fetching companies by category:', error);
        return [];
    }
}

// Function to get companies by category (for explore page)
export async function getCompaniesByCategoryWithLimit(category: string, limit: number = 50) {
    try {
        if (!category || category === 'all') {
            return await getLimitedCompanies(limit);
        }
        
        const companiesList = await db.query.companies.findMany({
            where: eq(companies.category, category),
            orderBy: (companies, { desc }) => desc(companies.createdAt),
            limit: limit,
        });
        return companiesList;
    } catch (error) {
        console.error('Error fetching companies by category:', error);
        return [];
    }
}

// Function to search companies and products
export async function searchCompaniesAndProducts(query: string) {
    try {
        if (!query) {
            return await getAllCompaniesWithProducts();
        }
        
        const searchResults = await db.query.companies.findMany({
            where: or(
                ilike(companies.companyName, `%${query}%`),
                ilike(companies.category, `%${query}%`),
                ilike(companies.about, `%${query}%`)
            ),
            with: {
                products: {
                    where: or(
                        ilike(products.name, `%${query}%`),
                        ilike(products.description, `%${query}%`)
                    ),
                    limit: 3,
                }
            },
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        
        return searchResults;
    } catch (error) {
        console.error('Error searching companies and products:', error);
        return [];
    }
}

// Function to search companies (for modern homepage view)
export async function searchCompanies(query: string) {
    try {
        if (!query) {
            return await getAllCompanies();
        }
        
        const searchResults = await db.query.companies.findMany({
            where: or(
                ilike(companies.companyName, `%${query}%`),
                ilike(companies.category, `%${query}%`),
                ilike(companies.about, `%${query}%`)
            ),
            orderBy: (companies, { desc }) => desc(companies.createdAt),
        });
        
        return searchResults;
    } catch (error) {
        console.error('Error searching companies:', error);
        return [];
    }
}

// Function to get limited companies (for homepage - only first 4)
export async function getLimitedCompanies(limit: number = 50) { // Increased default limit for explore page
    try {
        const companiesList = await db.query.companies.findMany({
            orderBy: (companies, { desc }) => desc(companies.createdAt),
            limit: limit,
        });
        return companiesList;
    } catch (error) {
        console.error('Error fetching limited companies:', error);
        return [];
    }
}

// Function to get all products with pagination
export async function getAllProducts(page: number = 1, limit: number = 12) {
    try {
        const offset = (page - 1) * limit;
        const allProducts = await db.query.products.findMany({
            offset: offset,
            limit: limit,
            with: {
                company: true
            },
            orderBy: (products, { desc }) => desc(products.createdAt),
        });
        return allProducts;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to get product count for pagination
export async function getProductsCount() {
    try {
        const countResult = await db.select({ count: count() }).from(products);
        return countResult[0].count;
    } catch (error) {
        console.error('Error fetching product count:', error);
        return 0;
    }
}

// Function to get user's company profile
export async function getUserCompany() {
    const token = (await cookies()).get('auth_token')?.value;
    
    if (!token) {
        return null;
    }
    
    const { verifyToken } = await import('@/lib/auth');
    const decodedToken = await verifyToken(token);
    
    if (!decodedToken) {
        return null;
    }

    const userId = decodedToken.userId;

    try {
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
            with: {
                products: true // Include products when fetching user's company
            }
        });
        return userCompany;
    } catch (error) {
        console.error('Error fetching user company:', error);
        return null;
    }
}

const createProductSchema = z.object({
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().optional(),
    moq: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    unitName: z.string().optional(),
    imageMain: z.string().optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
    try {
        // Get user ID from token
        const token = (await cookies()).get('auth_token')?.value;
        
        if (!token) {
            return { error: "You must be logged in to create a product." };
        }
        
        // Dynamically import verifyToken for Turbopack compatibility
        const { verifyToken } = await import('@/lib/auth');
        const decodedToken = await verifyToken(token);
        
        if (!decodedToken) {
            return { error: "Invalid or expired token." };
        }

        const userId = decodedToken.userId;

        // First, get the user's company
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (!userCompany) {
            return { error: "You must have a company profile to create products." };
        }

        const validatedFields = createProductSchema.safeParse({
            name: formData.get('name'),
            description: formData.get('description'),
            moq: formData.get('moq'),
            priceMin: formData.get('priceMin'),
            priceMax: formData.get('priceMax'),
            unitName: formData.get('unitName'),
            imageMain: formData.get('imageMain'),
        });

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }

        await db.insert(products).values({
            companyId: userCompany.idCompany,
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            moq: validatedFields.data.moq,
            priceMin: validatedFields.data.priceMin,
            priceMax: validatedFields.data.priceMax,
            unitName: validatedFields.data.unitName,
            imageMain: validatedFields.data.imageMain,
        });
    } catch (error) {
        console.error('Error in createProduct:', error);
        return { error: "Failed to create product. Please try again." };
    }

    revalidatePath('/profile');
    redirect('/profile');
}

// Function to get user's products
export async function getUserProducts() {
    const token = (await cookies()).get('auth_token')?.value;
    
    if (!token) {
        return [];
    }
    
    const { verifyToken } = await import('@/lib/auth');
    const decodedToken = await verifyToken(token);
    
    if (!decodedToken) {
        return [];
    }

    const userId = decodedToken.userId;

    try {
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (!userCompany) {
            return [];
        }

        const userProducts = await db.query.products.findMany({
            where: eq(products.companyId, userCompany.idCompany),
            orderBy: (products, { desc }) => desc(products.createdAt),
        });
        return userProducts;
    } catch (error) {
        console.error('Error fetching user products:', error);
        return [];
    }
}

const updateProductSchema = z.object({
    idProduct: z.string(),
    name: z.string().min(3, "Product name must be at least 3 characters"),
    description: z.string().optional(),
    moq: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    unitName: z.string().optional(),
    imageMain: z.string().optional(),
});

export async function updateProduct(prevState: any, formData: FormData) {
    try {
        const token = (await cookies()).get('auth_token')?.value;
        
        if (!token) {
            return { error: "You must be logged in to update a product." };
        }
        
        const { verifyToken } = await import('@/lib/auth');
        const decodedToken = await verifyToken(token);
        
        if (!decodedToken) {
            return { error: "Invalid or expired token." };
        }

        const userId = decodedToken.userId;

        // First, get the user's company
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (!userCompany) {
            return { error: "You must have a company profile to update products." };
        }

        const validatedFields = updateProductSchema.safeParse({
            idProduct: formData.get('idProduct'),
            name: formData.get('name'),
            description: formData.get('description'),
            moq: formData.get('moq'),
            priceMin: formData.get('priceMin'),
            priceMax: formData.get('priceMax'),
            unitName: formData.get('unitName'),
            imageMain: formData.get('imageMain'),
        });

        if (!validatedFields.success) {
            return {
                error: "Invalid fields",
                fieldErrors: validatedFields.error.flatten().fieldErrors,
            };
        }

        await db.update(products)
            .set({
                name: validatedFields.data.name,
                description: validatedFields.data.description,
                moq: validatedFields.data.moq,
                priceMin: validatedFields.data.priceMin,
                priceMax: validatedFields.data.priceMax,
                unitName: validatedFields.data.unitName,
                imageMain: validatedFields.data.imageMain,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(products.idProduct, validatedFields.data.idProduct),
                    eq(products.companyId, userCompany.idCompany)
                )
            );
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return { error: "Failed to update product. Please try again." };
    }

    revalidatePath('/profile');
    return { success: true };
}

export async function deleteProduct(productId: string) {
    try {
        const token = (await cookies()).get('auth_token')?.value;
        
        if (!token) {
            return { error: "You must be logged in to delete a product." };
        }
        
        const { verifyToken } = await import('@/lib/auth');
        const decodedToken = await verifyToken(token);
        
        if (!decodedToken) {
            return { error: "Invalid or expired token." };
        }

        const userId = decodedToken.userId;

        // First, get the user's company
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (!userCompany) {
            return { error: "You must have a company profile to delete products." };
        }

        await db.delete(products)
            .where(
                and(
                    eq(products.idProduct, productId),
                    eq(products.companyId, userCompany.idCompany)
                )
            );
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        return { error: "Failed to delete product. Please try again." };
    }

    revalidatePath('/profile');
    redirect('/profile');
}

export async function deleteProductAction(prevState: any, formData: FormData) {
    try {
        const productId = formData.get('productId') as string;
        
        if (!productId) {
            return { error: "Product ID is required." };
        }
        
        const token = (await cookies()).get('auth_token')?.value;
        
        if (!token) {
            return { error: "You must be logged in to delete a product." };
        }
        
        const { verifyToken } = await import('@/lib/auth');
        const decodedToken = await verifyToken(token);
        
        if (!decodedToken) {
            return { error: "Invalid or expired token." };
        }

        const userId = decodedToken.userId;

        // First, get the user's company
        const userCompany = await db.query.companies.findFirst({
            where: eq(companies.userId, userId),
        });

        if (!userCompany) {
            return { error: "You must have a company profile to delete products." };
        }

        await db.delete(products)
            .where(
                and(
                    eq(products.idProduct, productId),
                    eq(products.companyId, userCompany.idCompany)
                )
            );
    } catch (error) {
        console.error('Error in deleteProductAction:', error);
        return { error: "Failed to delete product. Please try again." };
    }

    revalidatePath('/profile');
    redirect('/profile');
}

// Function to search products
export async function searchProducts(query: string, page: number = 1, limit: number = 12) {
    try {
        if (!query) {
            return await getAllProducts(page, limit);
        }
        
        const offset = (page - 1) * limit;
        const searchResults = await db.query.products.findMany({
            where: or(
                ilike(products.name, `%${query}%`),
                ilike(products.description, `%${query}%`)
            ),
            offset: offset,
            limit: limit,
            with: {
                company: true
            },
            orderBy: (products, { desc }) => desc(products.createdAt),
        });
        
        return searchResults;
    } catch (error) {
        console.error('Error searching products:', error);
        return [];
    }
}
