import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'products.ts');
const tempJsPath = path.join(__dirname, 'temp_products.js');

// 1. Read TypeScript products file
let tsContent = fs.readFileSync(tsFilePath, 'utf8');

// 2. Remove TypeScript type definitions using regex
// Remove Product type block
tsContent = tsContent.replace(/export type Product = \{[\s\S]*?\};/, '');

// Remove type annotations on variable and parameter declarations
tsContent = tsContent.replace(/: Record<string, string>/g, '');
tsContent = tsContent.replace(/: Record<string, number>/g, '');
tsContent = tsContent.replace(/: Product\[\]/g, '');
tsContent = tsContent.replace(/: Pick<[\s\S]*?>/g, '');
tsContent = tsContent.replace(/: string/g, '');
tsContent = tsContent.replace(/: number/g, '');
tsContent = tsContent.replace(/: Product/g, '');


// Write to temporary JS file
fs.writeFileSync(tempJsPath, tsContent, 'utf8');
console.log('Created temporary products JS file.');

// 3. Connect to DB and seed
import connectDB from './config/db.js';
import ProductModel from './models/Product.js';

async function seed() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected!');

    // Import products from the temporary JS file
    const { products } = await import('./temp_products.js');
    console.log(`Loaded ${products.length} products from products.ts.`);

    // Clear existing products
    console.log('Clearing existing products...');
    await ProductModel.deleteMany({});
    console.log('Database cleared.');

    // Seed products
    const dbProducts = products.map(p => {
      // In the database:
      // price = original price (calculated as: Math.round(salePrice / (1 - discountPercent / 100)))
      // discountPrice = sale price
      const discountPercent = p.discountPercent || 20;
      const originalPrice = Math.round(p.price / (1 - discountPercent / 100));

      return {
        name: p.name,
        slug: p.slug,
        description: p.description || p.shortDescription,
        category: p.category,
        price: originalPrice, // DB price = original price
        discountPrice: p.price, // DB discountPrice = sale price
        stock: 100, // default stock
        featured: p.premium || false,
        images: [{ url: p.image, key: '' }]
      };
    });

    console.log('Seeding products...');
    const result = await ProductModel.insertMany(dbProducts);
    console.log(`Successfully seeded ${result.length} products into the database!`);

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempJsPath)) {
      fs.unlinkSync(tempJsPath);
      console.log('Removed temporary file.');
    }
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();
