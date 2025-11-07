'use server';

import { z } from 'zod';
import { db } from '@/db';
import { companies, products, users } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq, and, or, ilike } from 'drizzle-orm';
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
    // Get user ID from token
    const token = cookies().get('auth_token')?.value;
    
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

    try {
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
        console.error(error);
        return { error: "Failed to create company." };
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
