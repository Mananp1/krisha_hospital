import TopBar from '@/app/components/TopBar';
import NavBar from '@/app/components/NavBar';
import Hero from '@/app/components/Hero';
import StatsBar from '@/app/components/StatsBar';
import Services from '@/app/components/Services';
import DoctorProfile from '@/app/components/DoctorProfile';
import HospitalGallery from '@/app/components/HospitalGallery';
// import AppointmentForm from '@/app/components/AppointmentForm';
// import WhyChooseUs from '@/app/components/WhyChooseUs';
// import HealthPackages from '@/app/components/HealthPackages';
import Testimonials from '@/app/components/Testimonials';
// import Blog from '@/app/components/Blog';
import CTAStrip from '@/app/components/CTAStrip';
import Footer from '@/app/components/Footer';
// import WhatsAppFAB from '@/app/components/WhatsAppFAB';

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
      {/*
      <AppointmentForm />
      <WhyChooseUs />
      <HealthPackages />
      <Blog />
      <WhatsAppFAB /> */}
    </main>
  );
}
