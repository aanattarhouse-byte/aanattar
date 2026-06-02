'use client';

import Link from 'next/link';
import type { User } from '@/types/store';
import styles from './admin.module.css';

type UserTableProps = {
  users: User[];
  onBlockToggle?: (id: string, blocked: boolean) => void;
};

export default function UserTable({ users, onBlockToggle }: UserTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td><Link href={`/admin/users/${user._id}`}>{user.name || 'Customer'}</Link></td>
              <td>{user.phone}</td>
              <td>{user.email || '-'}</td>
              <td>{user.role}</td>
              <td>{user.blocked ? 'Blocked' : 'Active'}</td>
              <td>
                <button className={styles.button} type="button" onClick={() => onBlockToggle?.(user._id, !user.blocked)}>
                  {user.blocked ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
