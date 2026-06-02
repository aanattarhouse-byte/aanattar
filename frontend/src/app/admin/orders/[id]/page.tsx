import Header from '@/components/admin/Header';
import styles from '@/components/admin/admin.module.css';
import { getOrderAction } from '@/app/actions/admin';
import OrderDetailsClient from './OrderDetailsClient';

type AdminOrderDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailsPage({ params }: AdminOrderDetailsPageProps) {
  const { id } = await params;
  const result = await getOrderResult(id);

  if (result.order) {
    return <OrderDetailsClient initialOrder={result.order} />;
  }

  return (
    <>
      <Header title="Order Details" subtitle={id} />
      <div className={styles.notice}>{result.message}</div>
      <div className={styles.emptyState}>Invalid order ID or order data is unavailable.</div>
    </>
  );
}

async function getOrderResult(id: string) {
  try {
    return { order: (await getOrderAction(id)).order, message: '' };
  } catch (error) {
    return {
      order: null,
      message: error instanceof Error ? error.message : 'Could not load order details'
    };
  }
}
