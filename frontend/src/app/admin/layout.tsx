import AdminShell from '@/components/admin/AdminShell';
import { requireAdminFromCookies } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Dashboard | The Aan Story'
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminFromCookies();
  } catch {
    redirect('/');
  }

  return <AdminShell>{children}</AdminShell>;
}
