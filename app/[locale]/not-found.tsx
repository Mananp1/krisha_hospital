import Link from 'next/link';
import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Footer from '@/app/sections/Footer';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <NavBar />

      <main className="flex-1 flex items-center justify-center bg-surface-subtle py-20 px-5">
        <div className="max-w-[520px] w-full text-center">

          <p className="text-[96px] lg:text-[120px] font-extrabold text-primary-100 leading-none select-none">
            404
          </p>

          <h1 className="text-[26px] lg:text-[32px] font-extrabold text-text-base mt-2 mb-4">
            Page Not Found
          </h1>

          <p className="text-[15px] text-text-muted leading-[26px] mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Head back to the homepage or explore our services.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/"
              className="px-6 py-3 text-[14px] font-semibold text-text-inverse bg-secondary rounded-md hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
            <Link
              href="/#services"
              className="px-6 py-3 text-[14px] font-semibold text-primary border-[1.5px] border-primary rounded-md hover:bg-primary hover:text-text-inverse transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
