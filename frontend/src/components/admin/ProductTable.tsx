'use client';

import Link from 'next/link';
import type { Product } from '@/types/store';
import styles from './admin.module.css';

type ProductTableProps = {
  products: Product[];
  onDelete?: (id: string) => void;
};

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price.toLocaleString('en-IN')}</td>
              <td>{product.stock}</td>
              <td>{product.featured ? 'Yes' : 'No'}</td>
              <td>
                <Link className={`${styles.button} ${styles.secondaryButton}`} href={`/admin/products/edit/${product._id}`}>Edit</Link>{' '}
                <button className={`${styles.button} ${styles.dangerButton}`} type="button" onClick={() => onDelete?.(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
