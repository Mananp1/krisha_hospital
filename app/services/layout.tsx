import TopBar from '@/app/components/TopBar';
import NavBar from '@/app/components/NavBar';
import Footer from '@/app/components/Footer';

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
