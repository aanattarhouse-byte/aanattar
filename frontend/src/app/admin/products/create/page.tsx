import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import ProductForm from '../ProductForm';

export default function CreateProductPage() {
  return (
    <>
      <Header title="Create Product" subtitle="Add product details, stock, pricing, and images." />
      <div className={styles.card}>
        <ProductForm />
      </div>
    </>
  );
}
