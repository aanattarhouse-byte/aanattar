import { listUsersAction } from '@/app/actions/admin';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
  const { users } = await listUsersAction();
  return <UsersClient initialUsers={users} />;
}
