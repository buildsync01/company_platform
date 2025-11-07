# User Migration to Clerk

This script helps you migrate your existing user data to Clerk so users can log in to your platform.

## Prerequisites

1. You need a Clerk account and API keys
2. Access to your existing user data in JSON or CSV format
3. Your existing company data (if you want to link it to the new Clerk users)

## Setup

1. **Get your Clerk API keys**:
   - Go to your [Clerk Dashboard](https://dashboard.clerk.dev)
   - Navigate to "API Keys" section
   - Copy your "Secret Key" (starts with `sk_test_...` or `sk_live_...`)

2. **Install dependencies**:
   ```bash
   yarn add @clerk/clerk-sdk-node
   ```

3. **Prepare your environment**:
   ```bash
   cp .env.example .env
   ```
   Then add your Clerk secret key:
   ```
   CLERK_SECRET_KEY=your_secret_key_here
   ```

4. **Prepare your user data**:
   - Format your existing user data as JSON or CSV
   - Required field: `email` (users will log in with this)
   - Optional fields: `firstName`, `lastName`, `username`, `password`

## Usage

### Import from JSON file:
```bash
CLERK_SECRET_KEY=your_secret_key_here yarn tsx scripts/import-users-to-clerk.ts scripts/sample-users.json
```

### Import from CSV file:
```bash
CLERK_SECRET_KEY=your_secret_key_here yarn tsx scripts/import-users-to-clerk.ts scripts/sample-users.csv
```

### Using the predefined script (recommended):
```bash
CLERK_SECRET_KEY=your_secret_key_here yarn users:import scripts/sample-users.json
```

## Data Format

### JSON Format
```json
[
  {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "password": "SecurePassword123!"  // Optional
  }
]
```

### CSV Format
```csv
email,firstName,lastName,username,password
john.doe@example.com,John,Doe,johndoe,SecurePassword123!
```

## Important Notes

1. **Password Security**: If you're importing passwords, ensure they meet your security requirements. Note that Clerk validates passwords against breach databases, so commonly used passwords will be rejected. If you don't provide passwords, users will need to reset them on first login.

2. **Data Association**: After running the script, the company records in your database need to be updated to link to the new Clerk user IDs. The script provides output with the new Clerk user IDs.

3. **Duplicate Handling**: The script checks for existing users with the same email before creating new ones, preventing duplicates.

4. **Production Safety**: Test this script with a small set of data first before running on your full user base in production.

## Linking Existing Company Records

After importing users, you may need to update your existing company records to link them to the new Clerk user IDs. Use the separate update script for this:

```bash
CLERK_SECRET_KEY=your_secret_key_here yarn tsx scripts/update-company-records.ts
```

This will fetch all users from your Clerk account and attempt to match them to company records by email address.

## Troubleshooting

- If you get an "invalid API key" error, verify that your `CLERK_SECRET_KEY` is correct
- If you see permission errors, ensure your Clerk API key has user creation permissions
- If you get password breach errors, use stronger passwords that are not in public breach databases
- Check the Clerk dashboard after import to verify users were created correctly
- If the import script fails with TypeScript errors, ensure all dependencies are installed

## Security Warning

⚠️ **Important**: The deprecated `@clerk/clerk-sdk-node` package is used for this script as it's the most straightforward way to import users. The warning indicates this package will reach end-of-life, and you may need to migrate to `@clerk/express` in the future. For user import/migration purposes, the current implementation will continue to work.

## Migration Process for Your Data

1. Export your existing user data to JSON or CSV format
2. Map your existing fields to the script's expected format (email, firstName, lastName, username, password)
3. Test with a small subset of your data first
4. Run the import script with your full dataset
5. Run the company records update script to link existing company data to new Clerk user IDs
6. Test login functionality with a few imported accounts

## Sample Data Files

The repository includes sample data files:
- `scripts/sample-users.json` - Example JSON format
- `scripts/sample-users.csv` - Example CSV format

You can use these as templates for your own data.