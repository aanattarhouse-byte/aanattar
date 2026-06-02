'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import Header from '@/components/admin/Header';
import ProductTable from '@/components/admin/ProductTable';
import styles from '@/components/admin/admin.module.css';
import type { Product } from '@/types/store';
import { deleteProductAction, listProductsAction } from '@/app/actions/admin';

type ProductsClientProps = {
  initialProducts: Product[];
};

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await listProductsAction(search);
          setProducts(data.products);
          setError('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not load products');
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  const deleteProduct = async (id: string) => {
    await deleteProductAction(id);
    setProducts((current) => current.filter((product) => product._id !== id));
  };

  return (
    <>
      <Header
        title="Products"
        subtitle="Create, edit, delete, manage stock, and upload images."
        actions={<Link className={styles.button} href="/admin/products/create"><Plus size={18} /> Add Product</Link>}
      />
      <div className={styles.toolbar}>
        <input className={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
      </div>
      {error ? <div className={styles.notice}>{error}</div> : null}
      {isPending ? <div className={styles.notice}>Loading products...</div> : null}
      <ProductTable products={products} onDelete={deleteProduct} />
    </>
  );
}
