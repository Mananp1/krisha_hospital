import Image from 'next/image';

export default function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/917862950676"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 drop-shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
    >
      <Image
        src="/whatsapp-svgrepo-com.svg"
        alt="WhatsApp"
        width={56}
        height={56}
        className="w-full h-full"
      />
    </a>
  );
}
