import NavBar from '@/app/sections/NavBar';
import Hero from '@/app/sections/Hero';
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
      {/*
        No TopBar here: the bar floats transparently over the hero photograph,
        which a solid contact strip above it would break. The number stays one
        tap away in the bar itself, on the WhatsApp FAB and in the footer.
        Every other route keeps the TopBar and the solid nav.
      */}
      <NavBar overlay />
      <Hero />
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
