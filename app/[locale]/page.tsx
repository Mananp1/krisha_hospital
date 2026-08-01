import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Hero from '@/app/sections/Hero';
import Services from '@/app/sections/Services';
import DoctorProfile from '@/app/sections/DoctorProfile';
import Team from '@/app/sections/Team';
import RevealBand from '@/app/sections/RevealBand';
import HospitalGallery from '@/app/sections/HospitalGallery';
import Testimonials from '@/app/sections/Testimonials';
import FAQ from '@/app/sections/FAQ';
import CTAStrip from '@/app/sections/CTAStrip';
import Footer from '@/app/sections/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/*
        Solid header, same as every other route: the plum contact strip over a
        solid nav. The hero photograph starts cleanly below it rather than
        running behind a transparent bar, which kept the white-plated logo and
        the nav links from having to hold contrast against the changing image.
      */}
      <TopBar />
      <NavBar />
      <Hero />
      <Services />
      <DoctorProfile />
      <Team />
      <RevealBand />
      <HospitalGallery />
      <Testimonials />
      <FAQ />
      <CTAStrip />
      <Footer />
    </main>
  );
}
