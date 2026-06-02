'use client';

import { useState } from 'react';
import Header from '@/components/admin/Header';
import OrderTable from '@/components/admin/OrderTable';
import styles from '@/components/admin/admin.module.css';
import type { Order, User } from '@/types/store';
import { toggleUserBlockedAction } from '@/app/actions/admin';

type UserDetailsClientProps = {
  initialUser: User;
  orders: Order[];
};

export default function UserDetailsClient({ initialUser, orders }: UserDetailsClientProps) {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState('');
  const latestOrder = orders[0];

  const toggleBlocked = async () => {
    try {
      const data = await toggleUserBlockedAction(user._id, !user.blocked);
      setUser(data.user);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update user');
    }
  };

  return (
    <>
      <Header title="User Details" subtitle={user.phone} actions={<button className={styles.button} type="button" onClick={toggleBlocked}>{user.blocked ? 'Unblock User' : 'Block User'}</button>} />
      {error ? <div className={styles.notice}>{error}</div> : null}
      <div className={styles.detailGrid}>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Customer Profile</h2>
          <dl className={styles.detailList}>
            <div className={styles.detailItem}>
              <dt>Name</dt>
              <dd>{user.name || 'Customer'}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Phone Number</dt>
              <dd>{user.phone || '-'}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Email</dt>
              <dd>{user.email || '-'}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Registration Date</dt>
              <dd>{new Date(user.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</dd>
            </div>
          </dl>
        </section>
        <section className={styles.card}>
          <h2 className={styles.sectionTitle}>Order Snapshot</h2>
          <dl className={styles.detailList}>
            <div className={styles.detailItem}>
              <dt>Total Orders</dt>
              <dd>{orders.length}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Latest Order Status</dt>
              <dd>{latestOrder?.orderStatus || 'No orders yet'}</dd>
            </div>
            <div className={styles.detailItem}>
              <dt>Account Status</dt>
              <dd>{user.blocked ? 'Blocked' : 'Active'}</dd>
            </div>
          </dl>
        </section>
      </div>
      <div className={styles.fullSection}>
        <Header title="User Orders" />
        <OrderTable orders={orders} />
      </div>
    </>
  );
}
