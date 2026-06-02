import styles from './admin.module.css';

type ChartItem = {
  _id: string;
  revenue: number;
  orders: number;
};

export default function DashboardChart({ data }: { data: ChartItem[] }) {
  const max = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Revenue Chart</h2>
      <div className={styles.chart}>
        {data.map((item) => (
          <div key={item._id} title={`${item._id}: ₹${item.revenue}`} className={styles.bar} style={{ height: `${Math.max(8, (item.revenue / max) * 190)}px` }} />
        ))}
      </div>
    </section>
  );
}
