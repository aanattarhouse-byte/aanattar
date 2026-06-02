import { Clock, IndianRupee, ReceiptText, Users } from 'lucide-react';
import { getDashboardAction } from '@/app/actions/admin';
import DashboardChart from '@/components/admin/DashboardChart';
import Header from '@/components/admin/Header';
import RecentOrders from '@/components/admin/RecentOrders';
import StatsCard from '@/components/admin/StatsCard';
import styles from '@/components/admin/admin.module.css';

export default async function AdminDashboardPage() {
  const data = await getDashboardAction();

  return (
    <>
      <Header title="Dashboard" subtitle="Orders, revenue, customers, and store health." />
      <section className={styles.grid}>
        <StatsCard label="Total Orders" value={data.stats.totalOrders} icon={ReceiptText} />
        <StatsCard label="Total Revenue" value={`INR ${data.stats.totalRevenue.toLocaleString('en-IN')}`} icon={IndianRupee} />
        <StatsCard label="Total Users" value={data.stats.totalUsers} icon={Users} />
        <StatsCard label="Pending Orders" value={data.stats.pendingOrders} icon={Clock} />
      </section>
      <section className={styles.twoColumn}>
        <DashboardChart data={data.revenueChart} />
        <div className={styles.card}>
          <h2 className={styles.title}>Order Status Summary</h2>
          {data.statusSummary.map((item) => (
            <p key={item._id} className={styles.muted}>{item._id}: {item.count}</p>
          ))}
        </div>
      </section>
      <section className={styles.card} style={{ marginTop: 16 }}>
        <Header title="Recent Orders" />
        <RecentOrders orders={data.recentOrders} />
      </section>
    </>
  );
}
