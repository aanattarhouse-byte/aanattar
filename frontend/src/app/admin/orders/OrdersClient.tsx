'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Header from '@/components/admin/Header';
import OrderTable from '@/components/admin/OrderTable';
import styles from '@/components/admin/admin.module.css';
import type { Order } from '@/types/store';
import { listOrdersAction, updateOrderStatusAction } from '@/app/actions/admin';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

type OrdersClientProps = {
  initialOrders: Order[];
};

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [status, setStatus] = useState('');
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
          const data = await listOrdersAction(status, search);
          setOrders(data.orders);
          setError('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not load orders');
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [status, search]);

  const updateStatus = async (id: string, orderStatus: string) => {
    const data = await updateOrderStatusAction(id, orderStatus);
    setOrders((current) => current.map((order) => (order._id === id ? data.order : order)));
  };

  return (
    <>
      <Header title="Orders" subtitle="Search, filter, and update order status." />
      <div className={styles.toolbar}>
        <input className={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order ID" />
        <select className={styles.select} value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      {error ? <div className={styles.notice}>{error}</div> : null}
      {isPending ? <div className={styles.notice}>Loading orders...</div> : null}
      <OrderTable orders={orders} onStatusChange={updateStatus} />
    </>
  );
}
