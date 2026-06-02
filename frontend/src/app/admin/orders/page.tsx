import { listOrdersAction } from '@/app/actions/admin';
import OrdersClient from './OrdersClient';

export default async function AdminOrdersPage() {
  const { orders } = await listOrdersAction();
  return <OrdersClient initialOrders={orders} />;
}
