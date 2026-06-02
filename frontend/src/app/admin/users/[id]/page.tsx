import { getUserDetailsAction } from '@/app/actions/admin';
import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import UserDetailsClient from './UserDetailsClient';

type AdminUserDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailsPage({ params }: AdminUserDetailsPageProps) {
  const { id } = await params;
  const result = await getUserResult(id);

  if (result.user) {
    return <UserDetailsClient initialUser={result.user} orders={result.orders} />;
  }

  return (
    <>
      <Header title="User Details" subtitle={id} />
      <div className={styles.notice}>{result.message}</div>
      <div className={styles.emptyState}>Invalid user ID or user data is unavailable.</div>
    </>
  );
}

async function getUserResult(id: string) {
  try {
    const data = await getUserDetailsAction(id);
    return { user: data.user, orders: data.orders, message: '' };
  } catch (error) {
    return {
      user: null,
      orders: [],
      message: error instanceof Error ? error.message : 'Could not load user details'
    };
  }
}
