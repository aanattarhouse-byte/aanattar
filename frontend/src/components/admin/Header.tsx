import styles from './admin.module.css';

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
