import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import { getCurrentUserFromCookies } from '@/lib/auth';

export default async function AdminSettingsPage() {
  const user = await getCurrentUserFromCookies();

  return (
    <>
      <Header title="Settings" subtitle="Admin profile and authentication settings." />
      <div className={styles.card}>
        <p><strong>Name:</strong> {user?.name || 'Admin'}</p>
        <p><strong>Phone:</strong> {user?.phone || '-'}</p>
        <p><strong>Email:</strong> {user?.email || '-'}</p>
        <p className={styles.muted}>This dashboard uses server-side session verification. Admin access is controlled by backend role validation.</p>
      </div>
    </>
  );
}
