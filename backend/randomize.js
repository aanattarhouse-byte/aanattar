import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'lib', 'products.ts');

if (!fs.existsSync(filePath)) {
  console.error(`File not found at: ${filePath}`);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Find all slugs in productCatalog
const catalogRegex = /slug:\s*["']([^"']+)["']/g;
const slugs = [];
let match;
while ((match = catalogRegex.exec(content)) !== null) {
  slugs.push(match[1]);
}

console.log(`Found ${slugs.length} slugs in productCatalog.`);

// Separate signature and non-signature
const signatureSlugs = slugs.filter(s => s !== 'salim-luxury-attar');

const newPrices = {};
const newDiscounts = {};

// Randomize prices for signature products without adjacent duplicates
let lastPrice = null;
for (const slug of signatureSlugs) {
  let price;
  do {
    price = Math.floor(Math.random() * (90 - 70 + 1)) + 70; // 70 to 90
  } while (price === lastPrice);
  lastPrice = price;
  newPrices[slug] = price;
  newDiscounts[slug] = Math.floor(Math.random() * (35 - 10 + 1)) + 10; // 10% to 35%
}

// For salim-luxury-attar, also randomize it
if (slugs.includes('salim-luxury-attar')) {
  let price;
  do {
    price = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
  } while (price === newPrices[signatureSlugs[0]]); // Avoid duplication with the first signature product
  newPrices['salim-luxury-attar'] = price;
  newDiscounts['salim-luxury-attar'] = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
}

// Update the prices in the catalog
for (const slug of slugs) {
  const slugMarker = `slug: "${slug}",`;
  const slugIndex = content.indexOf(slugMarker);
  if (slugIndex === -1) {
    console.error(`Could not find slug: ${slug}`);
    process.exit(1);
  }
  
  const afterSlug = content.substring(slugIndex);
  const priceMatch = afterSlug.match(/price:\s*(\d+),/);
  if (!priceMatch) {
    console.error(`Could not find price after slug: ${slug}`);
    process.exit(1);
  }
  
  const originalPriceStr = priceMatch[0];
  const newPriceStr = `price: ${newPrices[slug]},`;
  
  const priceIndex = slugIndex + priceMatch.index;
  content = content.substring(0, priceIndex) + newPriceStr + content.substring(priceIndex + originalPriceStr.length);
}

// Replace the discount percents block
const discountBlockStart = 'export const productDiscountPercents: Record<string, number> = {';
const discountBlockEnd = '};';

const startIdx = content.indexOf(discountBlockStart);
if (startIdx === -1) {
  console.error('Could not find productDiscountPercents start');
  process.exit(1);
}
const endIdx = content.indexOf(discountBlockEnd, startIdx);
if (endIdx === -1) {
  console.error('Could not find productDiscountPercents end');
  process.exit(1);
}

let newDiscountBlock = discountBlockStart + '\n';
for (const slug of slugs) {
  if (newDiscounts[slug] !== undefined) {
    newDiscountBlock += `  "${slug}": ${newDiscounts[slug]},\n`;
  }
}

content = content.substring(0, startIdx) + newDiscountBlock + content.substring(endIdx);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated prices and discounts in products.ts!');
console.log('Prices:', newPrices);
console.log('Discounts:', newDiscounts);

// Save generated config to a JSON file so that database seeder can read and match the exact values
fs.writeFileSync(path.join(__dirname, 'generated_prices.json'), JSON.stringify({ prices: newPrices, discounts: newDiscounts }, null, 2), 'utf8');
console.log('Saved generated_prices.json');
