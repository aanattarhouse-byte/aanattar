import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/Product.js';

async function run() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected!');
    
    const count = await Product.countDocuments();
    console.log(`Total products in DB: ${count}`);
    
    const products = await Product.find({}).lean();
    console.log('Products:', products.map(p => ({ id: p._id, name: p.name, slug: p.slug, price: p.price, discountPrice: p.discountPrice, category: p.category })));
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
