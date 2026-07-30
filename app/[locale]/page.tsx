import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Hero from '@/app/sections/Hero';
import StatsBar from '@/app/sections/StatsBar';
import Services from '@/app/sections/Services';
import DoctorProfile from '@/app/sections/DoctorProfile';
import HospitalGallery from '@/app/sections/HospitalGallery';
import Testimonials from '@/app/sections/Testimonials';
import FAQ from '@/app/sections/FAQ';
import CTAStrip from '@/app/sections/CTAStrip';
import Footer from '@/app/sections/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <TopBar />
      <NavBar />
      <Hero />
      <StatsBar />
      <Services />
      <DoctorProfile />
      <HospitalGallery />
      <Testimonials />
      <FAQ />
      <CTAStrip />
      <Footer />
    </main>
  );
}
