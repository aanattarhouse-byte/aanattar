'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Header from '@/components/admin/Header';
import UserTable from '@/components/admin/UserTable';
import styles from '@/components/admin/admin.module.css';
import type { User } from '@/types/store';
import { listUsersAction, toggleUserBlockedAction } from '@/app/actions/admin';

type UsersClientProps = {
  initialUsers: User[];
};

export default function UsersClient({ initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const data = await listUsersAction(search);
          setUsers(data.users);
          setError('');
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Could not load users');
        }
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [search]);

  const toggleBlocked = async (id: string, blocked: boolean) => {
    const data = await toggleUserBlockedAction(id, blocked);
    setUsers((current) => current.map((user) => (user._id === id ? data.user : user)));
  };

  return (
    <>
      <Header title="Users" subtitle="Search customers, inspect accounts, block or unblock access." />
      <div className={styles.toolbar}>
        <input className={styles.input} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, or email" />
      </div>
      {error ? <div className={styles.notice}>{error}</div> : null}
      {isPending ? <div className={styles.notice}>Loading users...</div> : null}
      <UserTable users={users} onBlockToggle={toggleBlocked} />
    </>
  );
}
