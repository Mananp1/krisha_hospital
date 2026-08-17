import { Badge } from '@/components/ui/badge';
import { PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';
import LocaleSwitcher from './LocaleSwitcher';
import { CONTACT_EMAIL, CONTACT_EMAIL_HREF } from '@/lib/site-config';

export default function TopBar() {
  return (
    <div className="w-full bg-primary h-10.5">
      <div className="flex items-center justify-between h-full max-w-page mx-auto px-5 lg:px-gutter">
        {/* Left */}
        <div className="flex items-center gap-5.5">
          <a
            href="tel:+917862950676"
            className="flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium hover:opacity-80 transition-opacity"
          >
            <PhoneIcon size={13} />
            +91 78629 50676
          </a>
          <a
            href={CONTACT_EMAIL_HREF}
            className="hidden md:flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium hover:opacity-80 transition-opacity"
          >
            <MailIcon size={13} />
            {CONTACT_EMAIL}
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <Badge
            variant="secondary"
            asChild
            className="hidden md:inline-flex h-auto px-3.5 py-1 text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
          >
            <a href="#">Free PCOS Camp — 8 March</a>
          </Badge>
          <span className="hidden sm:flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium">
            <ClockIcon size={13} />
            OPD: Mon–Sat 11AM–2PM, 6PM–8PM • Sun 11AM–1PM
          </span>
          <span aria-hidden="true" className="hidden sm:block h-4 w-px bg-white/25" />
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
