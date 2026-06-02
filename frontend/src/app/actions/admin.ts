'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { backendFetch } from '@/lib/backendApi';
import type { Order as OrderType, Product as ProductType, ProductImage, User as UserType } from '@/types/store';

type ProductInput = {
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  stock: number;
  featured: boolean;
  images: ProductImage[];
};

async function cookieHeader() {
  const store = await cookies();
  return store
    .getAll()
    .map((cookie) => `${cookie.name}=${encodeURIComponent(cookie.value)}`)
    .join('; ');
}

async function api(path: string, init: RequestInit = {}) {
  return backendFetch(path, {
    ...init,
    headers: {
      Cookie: await cookieHeader(),
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init.headers
    },
    cache: 'no-store'
  });
}

function query(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const value = search.toString();
  return value ? `?${value}` : '';
}

export async function listUsersAction(search = '') {
  const data = await api(`/api/admin/users${query({ search })}`);
  return { users: data.users as UserType[] };
}

export async function getDashboardAction() {
  const data = await api('/api/admin/dashboard');
  return {
    stats: data.stats,
    recentOrders: data.recentOrders as OrderType[],
    revenueChart: data.revenueChart as { _id: string; revenue: number; orders: number }[],
    statusSummary: data.statusSummary as { _id: string; count: number }[]
  };
}

export async function toggleUserBlockedAction(id: string, blocked: boolean) {
  const data = await api(`/api/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ blocked })
  });

  revalidatePath('/admin/users');
  revalidatePath(`/admin/users/${id}`);

  return { user: data.user as UserType };
}

export async function getUserDetailsAction(id: string) {
  const data = await api(`/api/admin/users/${id}`);
  return { user: data.user as UserType, orders: data.orders as OrderType[] };
}

export async function listProductsAction(search = '') {
  const data = await api(`/api/products${query({ search })}`);
  return { products: data.products as ProductType[] };
}

export async function getProductAction(id: string) {
  const data = await api(`/api/products/${id}`);
  return { product: data.product as ProductType };
}

export async function saveProductAction(product: ProductInput, id?: string) {
  const data = await api(id ? `/api/products/${id}` : '/api/products', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(product)
  });

  revalidatePath('/admin/products');
  if (id) revalidatePath(`/admin/products/edit/${id}`);

  return { product: data.product as ProductType };
}

export async function deleteProductAction(id: string) {
  await api(`/api/products/${id}`, { method: 'DELETE' });

  revalidatePath('/admin/products');
  return { success: true };
}

export async function uploadProductImagesAction(formData: FormData) {
  const data = await api('/api/upload/products', {
    method: 'POST',
    body: formData
  });

  return { images: data.images as ProductImage[] };
}

export async function listOrdersAction(status = '', search = '') {
  const data = await api(`/api/admin/orders${query({ status, search })}`);
  return { orders: data.orders as OrderType[] };
}

export async function getOrderAction(id: string) {
  const data = await api(`/api/admin/orders/${id}`);
  return { order: data.order as OrderType };
}

export async function updateOrderStatusAction(id: string, orderStatus: string) {
  const data = await api(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ orderStatus })
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);

  return { order: data.order as OrderType };
}
