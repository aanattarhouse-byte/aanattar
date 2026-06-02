import type { LucideIcon } from 'lucide-react';
import styles from './admin.module.css';

type StatsCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
};

export default function StatsCard({ label, value, icon: Icon }: StatsCardProps) {
  return (
    <article className={`${styles.card} ${styles.metric}`}>
      <div>
        <div className={styles.muted}>{label}</div>
        <div className={styles.metricValue}>{value}</div>
      </div>
      {Icon ? <Icon size={24} aria-hidden /> : null}
    </article>
  );
}
