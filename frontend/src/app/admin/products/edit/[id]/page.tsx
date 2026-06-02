import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import { getProductAction } from '@/app/actions/admin';
import ProductForm from '../../ProductForm';

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const { product } = await getProductAction(id);

  return (
    <>
      <Header title="Edit Product" subtitle="Update product details, images, and stock." />
      <div className={styles.card}>
        <ProductForm product={product} />
      </div>
    </>
  );
}
