import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/schema';
import { hash } from 'bcrypt';
import { createId } from '@paralleldrive/cuid2';
import 'dotenv/config';

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('Using DATABASE_URL:', process.env.DATABASE_URL); // For debugging

const db = drizzle(pool, { schema });

// Sample data generators
const sampleUsers = [
  { email: 'john.smith@example.com', password: 'Password123!' },
  { email: 'emily.johnson@example.com', password: 'Password123!' },
  { email: 'michael.brown@example.com', password: 'Password123!' },
  { email: 'sarah.davis@example.com', password: 'Password123!' },
  { email: 'david.wilson@example.com', password: 'Password123!' },
  { email: 'jessica.miller@example.com', password: 'Password123!' },
  { email: 'robert.moore@example.com', password: 'Password123!' },
  { email: 'lisa.taylor@example.com', password: 'Password123!' },
  { email: 'james.anderson@example.com', password: 'Password123!' },
  { email: 'jennifer.thomas@example.com', password: 'Password123!' },
];

const sampleCompanies = [
  {
    username: 'tech_vision',
    companyName: 'Tech Vision Inc.',
    phone: '+1234567890',
    slogan: 'Innovating the future of technology',
    imageProfile: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    cityName: 'San Francisco',
    countryName: 'USA',
    companySize: '50-100',
    about: 'Leading technology company specializing in software solutions and digital transformation services.',
    website: 'https://techvision.com',
    companyType: 'private_company',
    establishedYear: '2015',
    category: 'technology',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'eco_products',
    companyName: 'Eco Products Ltd.',
    phone: '+1234567891',
    slogan: 'Sustainable products for a greener future',
    imageProfile: 'https://images.unsplash.com/photo-1579579202860-3ea12ec646bc?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    cityName: 'Portland',
    countryName: 'USA',
    companySize: '20-50',
    about: 'Eco-friendly manufacturing company producing sustainable consumer goods.',
    website: 'https://ecoproducts.com',
    companyType: 'private_company',
    establishedYear: '2018',
    category: 'fashion',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'global_traders',
    companyName: 'Global Traders Co.',
    phone: '+1234567892',
    slogan: 'Connecting businesses worldwide',
    imageProfile: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=1200',
    cityName: 'New York',
    countryName: 'USA',
    companySize: '100-200',
    about: 'International trading company specializing in electronics and consumer goods.',
    website: 'https://globaltraders.com',
    companyType: 'private_company',
    establishedYear: '2012',
    category: 'electronics',
    status: 'active',
    tradeRole: 'Distributor',
    isManufacture: false,
  },
  {
    username: 'precision_mfg',
    companyName: 'Precision Manufacturing',
    phone: '+1234567893',
    slogan: 'Precision in every product',
    imageProfile: 'https://images.unsplash.com/photo-1567532939604-b6b5b0e1607d?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1200',
    cityName: 'Detroit',
    countryName: 'USA',
    companySize: '200-500',
    about: 'High-precision manufacturing solutions with cutting-edge technology.',
    website: 'https://precisionmfg.com',
    companyType: 'private_company',
    establishedYear: '2010',
    category: 'machinery',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'health_plus',
    companyName: 'Health Plus Solutions',
    phone: '+1234567894',
    slogan: 'Innovating healthcare for better lives',
    imageProfile: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200',
    cityName: 'Boston',
    countryName: 'USA',
    companySize: '50-100',
    about: 'Innovative healthcare solutions and medical device manufacturing.',
    website: 'https://healthplus.com',
    companyType: 'private_company',
    establishedYear: '2017',
    category: 'healthcare',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'auto_parts_inc',
    companyName: 'Auto Parts Inc.',
    phone: '+1234567895',
    slogan: 'Quality automotive solutions',
    imageProfile: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200',
    cityName: 'Detroit',
    countryName: 'USA',
    companySize: '100-200',
    about: 'Leading manufacturer of automotive parts and components.',
    website: 'https://autopartsinc.com',
    companyType: 'private_company',
    establishedYear: '2005',
    category: 'automotive',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'food_suppliers',
    companyName: 'Premium Food Suppliers',
    phone: '+1234567896',
    slogan: 'Quality food products for all',
    imageProfile: 'https://images.unsplash.com/photo-1509087352064-47f26a09b43d?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200',
    cityName: 'Chicago',
    countryName: 'USA',
    companySize: '50-100',
    about: 'Premium supplier of organic and natural food products.',
    website: 'https://foodsuppliers.com',
    companyType: 'private_company',
    establishedYear: '2014',
    category: 'food',
    status: 'active',
    tradeRole: 'Supplier',
    isManufacture: false,
  },
  {
    username: 'innovate_construction',
    companyName: 'Innovate Construction Co.',
    phone: '+1234567897',
    slogan: 'Building the future',
    imageProfile: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200',
    cityName: 'Miami',
    countryName: 'USA',
    companySize: '200-500',
    about: 'Innovative construction solutions and sustainable building practices.',
    website: 'https://innovateconstruction.com',
    companyType: 'private_company',
    establishedYear: '2008',
    category: 'construction',
    status: 'active',
    tradeRole: 'Contractor',
    isManufacture: false,
  },
  {
    username: 'fashion_hub',
    companyName: 'Fashion Hub International',
    phone: '+1234567898',
    slogan: 'Style meets innovation',
    imageProfile: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8061?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200',
    cityName: 'Los Angeles',
    countryName: 'USA',
    companySize: '100-200',
    about: 'Global fashion manufacturing and design solutions.',
    website: 'https://fashionhub.com',
    companyType: 'private_company',
    establishedYear: '2013',
    category: 'fashion',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
  {
    username: 'smart_devices',
    companyName: 'Smart Devices Corp',
    phone: '+1234567899',
    slogan: 'Smart technology for everyday life',
    imageProfile: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=400',
    imageBanner: 'https://images.unsplash.com/photo-1600003263720-95b45a4035d5?w=1200',
    cityName: 'Austin',
    countryName: 'USA',
    companySize: '50-100',
    about: 'Innovative electronics and smart device manufacturing.',
    website: 'https://smartdevices.com',
    companyType: 'private_company',
    establishedYear: '2016',
    category: 'electronics',
    status: 'active',
    tradeRole: 'Manufacturer',
    isManufacture: true,
  },
];

const sampleProducts = [
  {
    name: 'Smart Home Hub',
    description: 'Advanced smart home control system with AI capabilities',
    imageMain: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600',
    moq: '100',
    priceMin: '$50',
    priceMax: '$75',
    unitName: 'pcs',
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad with multiple device support',
    imageMain: 'https://images.unsplash.com/photo-1592750475650-3aeee40d83a0?w=600',
    moq: '200',
    priceMin: '$15',
    priceMax: '$25',
    unitName: 'pcs',
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Premium organic cotton t-shirt with sustainable design',
    imageMain: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
    moq: '1000',
    priceMin: '$8',
    priceMax: '$12',
    unitName: 'pcs',
  },
  {
    name: 'Bamboo Fiber Towels',
    description: 'Eco-friendly bamboo fiber towels',
    imageMain: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600',
    moq: '500',
    priceMin: '$3',
    priceMax: '$5',
    unitName: 'pcs',
  },
  {
    name: 'High-End Smartphone',
    description: 'Latest generation smartphone with advanced features',
    imageMain: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
    moq: '50',
    priceMin: '$400',
    priceMax: '$500',
    unitName: 'pcs',
  },
  {
    name: 'Wireless Earbuds',
    description: 'Premium quality wireless earbuds with noise cancellation',
    imageMain: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600',
    moq: '200',
    priceMin: '$30',
    priceMax: '$45',
    unitName: 'pcs',
  },
  {
    name: 'Industrial Drill Press',
    description: 'High-precision industrial drill press for manufacturing',
    imageMain: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600',
    moq: '10',
    priceMin: '$800',
    priceMax: '$1200',
    unitName: 'pcs',
  },
  {
    name: 'CNC Machine',
    description: 'Computer numerical control machine for precision manufacturing',
    imageMain: 'https://images.unsplash.com/photo-1504148455328-c376907d157d?w=600',
    moq: '5',
    priceMin: '$15000',
    priceMax: '$20000',
    unitName: 'pcs',
  },
  {
    name: 'Medical Thermometer',
    description: 'Digital infrared medical thermometer',
    imageMain: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600',
    moq: '100',
    priceMin: '$12',
    priceMax: '$18',
    unitName: 'pcs',
  },
  {
    name: 'Blood Pressure Monitor',
    description: 'Digital blood pressure monitor with app connectivity',
    imageMain: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600',
    moq: '50',
    priceMin: '$25',
    priceMax: '$35',
    unitName: 'pcs',
  },
  {
    name: 'Car Engine Parts',
    description: 'High-quality car engine components',
    imageMain: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600',
    moq: '20',
    priceMin: '$150',
    priceMax: '$300',
    unitName: 'pcs',
  },
  {
    name: 'Brake System',
    description: 'Complete automotive brake system',
    imageMain: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600',
    moq: '15',
    priceMin: '$80',
    priceMax: '$120',
    unitName: 'pcs',
  },
  {
    name: 'Organic Honey',
    description: 'Premium organic raw honey from sustainable farms',
    imageMain: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600',
    moq: '100',
    priceMin: '$8',
    priceMax: '$12',
    unitName: 'kg',
  },
  {
    name: 'Gluten-Free Bread',
    description: 'Fresh gluten-free bread made with organic ingredients',
    imageMain: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
    moq: '200',
    priceMin: '$6',
    priceMax: '$8',
    unitName: 'pcs',
  },
  {
    name: 'Steel Beams',
    description: 'High-grade steel beams for construction',
    imageMain: 'https://images.unsplash.com/photo-1629909135278-1a1cca8d9e3d?w=600',
    moq: '10',
    priceMin: '$150',
    priceMax: '$200',
    unitName: 'tons',
  },
  {
    name: 'Concrete Mixers',
    description: 'Heavy-duty concrete mixers for construction projects',
    imageMain: 'https://images.unsplash.com/photo-1509087352064-47f26a09b43d?w=600',
    moq: '5',
    priceMin: '$3000',
    priceMax: '$5000',
    unitName: 'pcs',
  },
  {
    name: 'Designer Jeans',
    description: 'Premium designer jeans with sustainable materials',
    imageMain: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    moq: '500',
    priceMin: '$45',
    priceMax: '$65',
    unitName: 'pcs',
  },
  {
    name: 'Winter Jacket',
    description: 'Warm winter jacket with waterproof features',
    imageMain: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
    moq: '300',
    priceMin: '$75',
    priceMax: '$100',
    unitName: 'pcs',
  },
  {
    name: 'Smart TV',
    description: '4K Smart TV with streaming capabilities',
    imageMain: 'https://images.unsplash.com/photo-1593305841991-9d3d8a82e2f7?w=600',
    moq: '20',
    priceMin: '$400',
    priceMax: '$600',
    unitName: 'pcs',
  },
  {
    name: 'Gaming Console',
    description: 'Latest gaming console with VR support',
    imageMain: 'https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=600',
    moq: '15',
    priceMin: '$350',
    priceMax: '$450',
    unitName: 'pcs',
  },
];

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Start a transaction
    await db.transaction(async (tx) => {
      // Clear existing data (in reverse order to respect foreign key constraints)
      await tx.delete(schema.productImages).execute();
      await tx.delete(schema.productVideos).execute();
      await tx.delete(schema.products).execute();
      await tx.delete(schema.companies).execute();
      await tx.delete(schema.users).execute();

      console.log('Cleared existing data.');

      // Create users and companies with their products
      for (let i = 0; i < 10; i++) {
        const user = sampleUsers[i];
        const company = sampleCompanies[i];
        
        // Hash the password
        const hashedPassword = await hash(user.password, 10);
        
        // Create user
        const [createdUser] = await tx.insert(schema.users).values({
          idUser: createId(),
          email: user.email,
          password: hashedPassword,
        }).returning({ idUser: schema.users.idUser });
        
        // Create company for the user
        const [createdCompany] = await tx.insert(schema.companies).values({
          ...company,
          idCompany: createId(),
          userId: createdUser.idUser,
        }).returning({ idCompany: schema.companies.idCompany });
        
        // Create 2 products for the company
        for (let j = 0; j < 2; j++) {
          const productIndex = i * 2 + j; // This ensures we use different products for each company
          const product = sampleProducts[productIndex % sampleProducts.length];
          
          await tx.insert(schema.products).values({
            ...product,
            idProduct: createId(),
            companyId: createdCompany.idCompany,
          }).execute();
        }
        
        console.log(`Created user ${i + 1}/10: ${user.email}`);
      }
    });

    console.log('Database seeding completed successfully!');
    await pool.end();
  } catch (error) {
    console.error('Error during database seeding:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };