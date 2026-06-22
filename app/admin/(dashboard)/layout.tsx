import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminNav from '@/app/admin/components/AdminNav';
import { MobileNav } from '@/app/admin/components/MobileNav';

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
    <div className="flex h-screen overflow-hidden bg-surface-subtle">
      <AdminNav />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}