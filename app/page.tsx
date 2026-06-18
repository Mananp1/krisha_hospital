import TopBar from '@/app/sections/TopBar';
import NavBar from '@/app/sections/NavBar';
import Hero from '@/app/sections/Hero';
import StatsBar from '@/app/sections/StatsBar';
import Services from '@/app/sections/Services';
import DoctorProfile from '@/app/sections/DoctorProfile';
import HospitalGallery from '@/app/sections/HospitalGallery';
// import AppointmentForm from '@/app/sections/AppointmentForm';
// import WhyChooseUs from '@/app/sections/WhyChooseUs';
// import HealthPackages from '@/app/sections/HealthPackages';
import Testimonials from '@/app/sections/Testimonials';
// import Blog from '@/app/sections/Blog';
import CTAStrip from '@/app/sections/CTAStrip';
import Footer from '@/app/sections/Footer';
import WhatsAppFAB from '@/app/sections/WhatsAppFAB';

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
      <CTAStrip />
      <Footer />
      <WhatsAppFAB />
      {/*
      <AppointmentForm />
      <WhyChooseUs />
      <HealthPackages />
      <Blog />
      */}
    </main>
  );
}
