import { listProductsAction } from '@/app/actions/admin';
import ProductsClient from './ProductsClient';

export default async function AdminProductsPage() {
  const { products } = await listProductsAction();
  return <ProductsClient initialProducts={products} />;
}
