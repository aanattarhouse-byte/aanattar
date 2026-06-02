'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/components/admin/admin.module.css';
import { saveProductAction, uploadProductImagesAction } from '@/app/actions/admin';
import type { Product, ProductImage } from '@/types/store';

type ProductFormProps = {
  product?: Product;
};

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    stock: product?.stock || '',
    featured: product?.featured || false,
    images: product?.images || [] as ProductImage[]
  });
  const [error, setError] = useState('');

  const setField = (key: string, value: string | boolean | ProductImage[]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const payload = new FormData();
    Array.from(files).forEach((file) => payload.append('images', file));
    const data = await uploadProductImagesAction(payload);
    setField('images', [...form.images, ...data.images]);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock)
    };
    try {
      await saveProductAction(payload, product?._id);
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save product');
    }
  };

  return (
    <form className={styles.form} onSubmit={save}>
      {error ? <div className={`${styles.notice} ${styles.wide}`}>{error}</div> : null}
      <label className={styles.field}>Name<input className={styles.input} value={form.name} onChange={(event) => setField('name', event.target.value)} required /></label>
      <label className={styles.field}>Category<input className={styles.input} value={form.category} onChange={(event) => setField('category', event.target.value)} required /></label>
      <label className={styles.field}>Price<input className={styles.input} type="number" value={form.price} onChange={(event) => setField('price', event.target.value)} required /></label>
      <label className={styles.field}>Discount Price<input className={styles.input} type="number" value={form.discountPrice} onChange={(event) => setField('discountPrice', event.target.value)} /></label>
      <label className={styles.field}>Stock<input className={styles.input} type="number" value={form.stock} onChange={(event) => setField('stock', event.target.value)} required /></label>
      <label className={styles.field}>Images<input className={styles.input} type="file" multiple accept="image/*" onChange={(event) => uploadImages(event.target.files).catch((err: Error) => setError(err.message))} /></label>
      <label className={`${styles.field} ${styles.wide}`}>Description<textarea className={styles.textarea} value={form.description} onChange={(event) => setField('description', event.target.value)} required /></label>
      <label className={styles.field}>Featured<input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} /></label>
      <div className={styles.wide}>
        <button className={styles.button} type="submit">{product ? 'Update Product' : 'Create Product'}</button>
      </div>
    </form>
  );
}
