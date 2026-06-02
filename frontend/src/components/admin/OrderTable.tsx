'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types/store';
import styles from './admin.module.css';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

type OrderTableProps = {
  orders: Order[];
  onStatusChange?: (id: string, status: string) => void;
};

export default function OrderTable({ orders, onStatusChange }: OrderTableProps) {
  const router = useRouter();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const user = typeof order.userId === 'object' ? order.userId : null;
            const openOrder = () => router.push(`/admin/orders/${order._id}`);

            return (
              <tr
                key={order._id}
                className={styles.clickableRow}
                role="link"
                tabIndex={0}
                onClick={openOrder}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openOrder();
                  }
                }}
              >
                <td><Link href={`/admin/orders/${order._id}`}>{order._id.slice(-8)}</Link></td>
                <td>{user?.name || user?.phone || 'Customer'}</td>
                <td>&#8377;{order.amount.toLocaleString('en-IN')}</td>
                <td>{order.paymentStatus}</td>
                <td>
                  <select
                    className={styles.select}
                    value={order.orderStatus}
                    onClick={(event) => event.stopPropagation()}
                    onKeyDown={(event) => event.stopPropagation()}
                    onChange={(event) => onStatusChange?.(order._id, event.target.value)}
                  >
                    {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
