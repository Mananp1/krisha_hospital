import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
