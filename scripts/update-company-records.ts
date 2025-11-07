/**
 * Script to update company records with Clerk user IDs
 * This is a separate script to manually update your database after user import
 * 
 * Usage: 
 * CLERK_SECRET_KEY=your_key_here yarn tsx scripts/update-company-records.ts
 */

require('dotenv').config();

import { createClerkClient } from '@clerk/clerk-sdk-node';

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Interface for company data that needs to be updated
 */
interface CompanyUpdateData {
  email: string;      // The email to match the company record
  clerkUserId: string; // The Clerk user ID to associate with the company
}

/**
 * Update company records in your database to link them to Clerk user IDs
 */
async function updateCompanyRecords(updates: CompanyUpdateData[]) {
  console.log(`Updating ${updates.length} company records...`);

  // Import your database connection and schema
  const { db } = await import('../db'); // Adjust path as needed
  const { companies } = await import('../db/schema'); // Adjust path as needed
  const { eq } = await import('drizzle-orm'); // Adjust path as needed

  let updatedCount = 0;
  let notFoundCount = 0;
  const errors: string[] = [];

  for (const update of updates) {
    try {
      // Update the company record with the new Clerk user ID
      const result = await db
        .update(companies)
        .set({ userId: update.clerkUserId })
        .where(eq(companies.email, update.email)); // Adjust the field as needed

      if (result && result.length > 0) {
        console.log(`✓ Updated company record for ${update.email} with Clerk ID: ${update.clerkUserId}`);
        updatedCount++;
      } else {
        console.log(`⚠ No company record found for email: ${update.email}`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`✗ Error updating company record for ${update.email}:`, error);
      errors.push(`Error updating ${update.email}: ${(error as Error).message}`);
    }
  }

  console.log('\n--- Update Summary ---');
  console.log(`Updated: ${updatedCount}`);
  console.log(`Not Found: ${notFoundCount}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }
}

/**
 * Fetch all users from Clerk to build an update mapping
 */
async function fetchClerkUsers(): Promise<CompanyUpdateData[]> {
  console.log('Fetching users from Clerk...');
  
  const users = await clerkClient.users.getUserList({
    limit: 500 // Adjust as needed
  });

  return users.map(user => {
    // Assuming the primary email is what you want to match on
    const primaryEmail = user.emailAddresses.find(ea => ea.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!primaryEmail) {
      console.warn(`User ${user.id} has no primary email address`);
    }
    
    return {
      email: primaryEmail || '',
      clerkUserId: user.id
    };
  }).filter(update => update.email !== ''); // Filter out users without email
}

/**
 * Main function
 */
async function main() {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error('Error: CLERK_SECRET_KEY environment variable is not set');
    process.exit(1);
  }

  try {
    // Option 1: Fetch all users from Clerk and update company records
    console.log('Fetching user data from Clerk...');
    const updates = await fetchClerkUsers();
    
    if (updates.length === 0) {
      console.log('No users found in Clerk to update company records');
      process.exit(0);
    }
    
    await updateCompanyRecords(updates);
    
    console.log('\nAll done! Company records have been updated.');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { updateCompanyRecords, fetchClerkUsers };