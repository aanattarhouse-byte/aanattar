'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import type { Order, OrderStatus } from '@/types/store';
import { getOrderAction, updateOrderStatusAction } from '@/app/actions/admin';

const statuses: OrderStatus[] = ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

type OrderDetailsClientProps = {
  initialOrder: Order;
};

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function formatCurrency(value: number) {
  return `INR ${value.toLocaleString('en-IN')}`;
}

function DetailItem({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className={styles.detailItem}>
      <dt>{label}</dt>
      <dd>{value ?? '-'}</dd>
    </div>
  );
}

export default function OrderDetailsClient({ initialOrder }: OrderDetailsClientProps) {
  const [order, setOrder] = useState(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(initialOrder.orderStatus);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const user = typeof order.userId === 'object' ? order.userId : null;
  const subtotal = useMemo(
    () => order.products.reduce((total, item) => total + item.price * item.quantity, 0),
    [order.products]
  );
  const shippingCharge = Math.max(order.amount - subtotal, 0);
  const discount = Math.max(subtotal + shippingCharge - order.amount, 0);

  const updateStatus = () => {
    startTransition(async () => {
      try {
        setError('');
        setMessage('');
        await updateOrderStatusAction(order._id, selectedStatus);
        const refreshed = await getOrderAction(order._id);
        setOrder(refreshed.order);
        setSelectedStatus(refreshed.order.orderStatus);
        setMessage('Order status updated successfully.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not update order status');
      }
    });
  };

  return (
    <>
      <Header
        title="Order Details"
        subtitle={order._id}
        actions={user ? <Link className={styles.button} href={`/admin/users/${user._id}`}>View User</Link> : undefined}
      />

      {message ? <div className={`${styles.notice} ${styles.successNotice}`}>{message}</div> : null}
      {error ? <div className={styles.notice}>{error}</div> : null}
      {isPending ? <div className={styles.notice}>Refreshing order data...</div> : null}

      <div className={styles.detailGrid}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Order Information</h2>
          <dl className={styles.detailList}>
            <DetailItem label="Order ID" value={order._id} />
            <DetailItem label="Order Date" value={formatDate(order.createdAt)} />
            <DetailItem label="Current Status" value={order.orderStatus} />
            <DetailItem label="Payment Method" value={order.razorpayOrderId || order.razorpayPaymentId ? 'Razorpay' : 'Razorpay'} />
            <DetailItem label="Payment Status" value={order.paymentStatus} />
            <DetailItem label="Total Amount" value={formatCurrency(order.amount)} />
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Status Management</h2>
          <div className={styles.statusControls}>
            <label className={styles.field}>
              Order Status
              <select className={styles.select} value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as OrderStatus)}>
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <button className={styles.button} type="button" onClick={updateStatus} disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Customer Information</h2>
          <dl className={styles.detailList}>
            <DetailItem label="Full Name" value={user?.name || order.shippingAddress.fullName} />
            <DetailItem label="Phone Number" value={user?.phone || order.shippingAddress.phone} />
            <DetailItem label="Email" value={user?.email} />
            <DetailItem label="User ID" value={user?._id} />
            <DetailItem label="Account Creation Date" value={formatDate(user?.createdAt)} />
          </dl>
        </section>

        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Shipping Information</h2>
          <dl className={styles.detailList}>
            <DetailItem label="Full Address" value={[order.shippingAddress.line1, order.shippingAddress.line2].filter(Boolean).join(', ')} />
            <DetailItem label="City" value={order.shippingAddress.city} />
            <DetailItem label="State" value={order.shippingAddress.state} />
            <DetailItem label="Postal Code" value={order.shippingAddress.pincode} />
            <DetailItem label="Country" value={order.shippingAddress.country || 'India'} />
          </dl>
        </section>
      </div>

      <section className={`${styles.card} ${styles.fullSection}`}>
        <h2 className={styles.sectionTitle}>Ordered Products</h2>
        {order.products.length ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Variant/Size</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item) => (
                  <tr key={`${item.name}-${item.price}-${item.quantity}`}>
                    <td>
                      <div className={styles.productCell}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {item.image ? <img className={styles.productImage} src={item.image} alt={item.name} /> : <div className={styles.productImagePlaceholder}>No image</div>}
                        <span>{item.name || 'Product'}</span>
                      </div>
                    </td>
                    <td>{item.variant || item.size || '-'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>No products found for this order.</div>
        )}
      </section>

      <section className={`${styles.card} ${styles.summaryCard}`}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        <dl className={styles.summaryList}>
          <DetailItem label="Subtotal" value={formatCurrency(subtotal)} />
          <DetailItem label="Shipping Charge" value={formatCurrency(shippingCharge)} />
          <DetailItem label="Discount" value={formatCurrency(discount)} />
          <DetailItem label="Total" value={formatCurrency(order.amount)} />
        </dl>
      </section>
    </>
  );
}
