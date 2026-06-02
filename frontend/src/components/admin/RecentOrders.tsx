import OrderTable from './OrderTable';
import type { Order } from '@/types/store';

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return <OrderTable orders={orders} />;
}
