import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminNav from '@/app/admin/components/AdminNav';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <AdminNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}