import { createClerkClient } from '@clerk/clerk-sdk-node';
import { db } from '../db';
import { companies } from '../db/schema';
import { eq } from 'drizzle-orm';

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Interface for the user data structure you want to import
 * Modify this interface according to your existing user data structure
 */
interface UserData {
  email: string;
  password?: string; // Optional: if you have passwords in your existing data
  firstName?: string;
  lastName?: string;
  username?: string;
  companyData?: {
    companyName: string;
    email: string;
    phone?: string;
    slogan?: string;
    about?: string;
    website?: string;
    companySize?: string;
    establishedYear?: string;
    category?: string;
    status?: string;
  };
}

/**
 * Import users to Clerk
 * @param users Array of user data to import
 */
async function importUsersToClerk(users: UserData[]): Promise<{ success: number; failed: number; errors: string[]; createdUsers: Array<{clerkId: string, email: string, companyData?: any}> }> {
  let successCount = 0;
  let failedCount = 0;
  const errors: string[] = [];
  const createdUsers: Array<{clerkId: string, email: string, companyData?: any}> = [];

  console.log(`Starting import of ${users.length} users...`);

  for (const userData of users) {
    try {
      // Validate email format
      if (!userData.email || !isValidEmail(userData.email)) {
        errors.push(`Invalid email format for user: ${userData.email}`);
        failedCount++;
        continue;
      }

      // Check if user already exists
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [userData.email],
      });

      if (existingUsers.length > 0) {
        console.log(`User with email ${userData.email} already exists (Clerk ID: ${existingUsers[0].id}), skipping...`);
        continue;
      }

      // Create the user in Clerk
      const createdUser = await clerkClient.users.createUser({
        emailAddress: [userData.email],
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        password: userData.password,
        skipPasswordRequirement: !userData.password, // Set to true if no password provided
      });

      console.log(`Successfully created user: ${userData.email} with Clerk ID: ${createdUser.id}`);
      createdUsers.push({ 
        clerkId: createdUser.id, 
        email: userData.email, 
        companyData: userData.companyData 
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to create user with email ${userData.email}:`, error);
      errors.push(`Error creating user ${userData.email}: ${(error as Error).message}`);
      failedCount++;
    }
  }

  console.log(`Import completed: ${successCount} successful, ${failedCount} failed`);

  return {
    success: successCount,
    failed: failedCount,
    errors,
    createdUsers,
  };
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Update company records to link to the new Clerk user IDs
 * This function would update your database to associate existing company records
 * with the newly created Clerk user IDs
 */
async function updateCompanyRecords(createdUsers: Array<{clerkId: string, email: string, companyData?: any}>) {
  console.log('Updating company records with new Clerk user IDs...');
  
  let updatedCount = 0;
  let notFoundCount = 0;
  let createdCount = 0;
  const errors: string[] = [];

  for (const user of createdUsers) {
    try {
      if (user.companyData) {
        // Check if a company record already exists for this email
        const existingCompanies = await db.select().from(companies).where(eq(companies.email, user.email));
        
        if (existingCompanies.length > 0) {
          // Update existing company record with new Clerk userId
          const result = await db
            .update(companies)
            .set({ 
              userId: user.clerkId,
              ...user.companyData 
            })
            .where(eq(companies.email, user.email));

          if (result && result.length > 0) {
            console.log(`✓ Updated existing company record for ${user.email} with Clerk ID: ${user.clerkId}`);
            updatedCount++;
          } else {
            console.log(`⚠ No company record found to update for email: ${user.email}`);
            notFoundCount++;
          }
        } else {
          // Create new company record
          const result = await db
            .insert(companies)
            .values({
              userId: user.clerkId,
              email: user.companyData.email,
              companyName: user.companyData.companyName,
              phone: user.companyData.phone,
              slogan: user.companyData.slogan,
              about: user.companyData.about,
              website: user.companyData.website,
              companySize: user.companyData.companySize,
              establishedYear: user.companyData.establishedYear,
              category: user.companyData.category,
              status: user.companyData.status,
            });
            
          console.log(`✓ Created new company record for ${user.email} with Clerk ID: ${user.clerkId}`);
          createdCount++;
        }
      } else {
        // If no company data provided, just update the userId if a record exists
        const result = await db
          .update(companies)
          .set({ userId: user.clerkId })
          .where(eq(companies.email, user.email));

        if (result && result.length > 0) {
          console.log(`✓ Updated company record for ${user.email} with Clerk ID: ${user.clerkId}`);
          updatedCount++;
        } else {
          console.log(`⚠ No existing company record found for email: ${user.email} (this is normal if no company data provided)`);
          notFoundCount++;
        }
      }
    } catch (error) {
      console.error(`✗ Error processing company record for ${user.email}:`, error);
      errors.push(`Error processing ${user.email}: ${(error as Error).message}`);
    }
  }

  console.log('\n--- Company Records Update Summary ---');
  console.log(`Created: ${createdCount}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Not Found/No Changes: ${notFoundCount}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
}

/**
 * Import users and associate them with existing company data
 */
async function importUsersAndAssociateWithCompanies(users: UserData[]) {
  // Import users to Clerk
  const result = await importUsersToClerk(users);

  // Update company records if users were successfully created
  if (result.createdUsers.length > 0) {
    await updateCompanyRecords(result.createdUsers);
  }

  return result;
}

/**
 * Read user data from a JSON file
 * You can modify this function to read from your specific data source
 */
async function readUserDataFromJson(filePath: string): Promise<UserData[]> {
  console.log(`Reading user data from ${filePath}...`);
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if file exists
    if (!fs.existsSync(path.resolve(filePath))) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const data = fs.readFileSync(path.resolve(filePath), 'utf8');
    const jsonData = JSON.parse(data);
    
    // Validate data structure
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON file must contain an array of user objects');
    }
    
    // Validate each user object
    const validatedUsers: UserData[] = [];
    for (const [index, user] of jsonData.entries()) {
      if (!user.email) {
        console.warn(`User at index ${index} is missing required email field, skipping...`);
        continue;
      }
      
      validatedUsers.push({
        email: user.email,
        firstName: user.firstName || user.first_name || user.first,
        lastName: user.lastName || user.last_name || user.last,
        username: user.username || user.name,
        password: user.password,
        companyData: user.companyData || user.company_data
      });
    }
    
    console.log(`Successfully read ${validatedUsers.length} valid users from ${filePath}`);
    return validatedUsers;
  } catch (error) {
    console.error(`Error reading user data from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Read user data from a CSV file
 * You can modify this function to read from your specific data source
 */
async function readUserDataFromCsv(filePath: string): Promise<UserData[]> {
  console.log(`Reading user data from ${filePath}...`);
  
  try {
    const fs = require('fs');
    const csv = require('csv-parser');
    
    const results: UserData[] = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => {
          results.push({
            email: data.email,
            firstName: data.firstName || data.first_name || data.first,
            lastName: data.lastName || data.last_name || data.last,
            username: data.username || data.name,
            password: data.password,
            companyData: {
              companyName: data.companyName || data.company_name || data.company,
              email: data.companyEmail || data.company_email || data.email,
              phone: data.phone,
              slogan: data.slogan,
              about: data.about,
              website: data.website,
              companySize: data.companySize || data.company_size,
              establishedYear: data.establishedYear || data.established_year,
              category: data.category,
              status: data.status
            }
          });
        })
        .on('end', () => {
          console.log(`Successfully read ${results.length} users from ${filePath}`);
          resolve(results);
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error(`Error reading user data from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  // Check if required environment variables are set
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('Error: CLERK_SECRET_KEY environment variable is not set');
    console.error('Please set it before running this script');
    console.error('Example: CLERK_SECRET_KEY=sk_test_... yarn tsx scripts/import-users-to-clerk.ts');
    process.exit(1);
  }

  // Get command line arguments
  const args = process.argv.slice(2);
  const inputFile = args[0];
  
  if (!inputFile) {
    console.error('Error: Please provide the path to your user data file as an argument');
    console.error('Usage: yarn tsx scripts/import-users-to-clerk.ts <path-to-data-file>');
    console.error('Supported formats: JSON, CSV');
    process.exit(1);
  }

  try {
    // Determine file type and read data
    const fileExtension = inputFile.toLowerCase().split('.').pop();
    let userData: UserData[];
    
    switch (fileExtension) {
      case 'json':
        userData = await readUserDataFromJson(inputFile);
        break;
      case 'csv':
        userData = await readUserDataFromCsv(inputFile);
        break;
      default:
        throw new Error(`Unsupported file format: ${fileExtension}. Supported formats: JSON, CSV`);
    }

    if (!userData || userData.length === 0) {
      console.error('No valid user data found to import');
      process.exit(1);
    }

    console.log(`Found ${userData.length} users to import`);

    // Import users to Clerk
    const result = await importUsersAndAssociateWithCompanies(userData);

    console.log('\n--- Import Summary ---');
    console.log(`Successful: ${result.success}`);
    console.log(`Failed: ${result.failed}`);
    
    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    console.log('\n--- Next Steps ---');
    console.log('1. Verify the users were created correctly in your Clerk dashboard');
    console.log('2. If company records were updated, verify the connections in your database');
    console.log('3. Test login with a few of the imported accounts');
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export { importUsersToClerk, UserData };