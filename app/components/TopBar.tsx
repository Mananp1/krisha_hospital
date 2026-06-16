export default function TopBar() {
  return (
    <div className="w-full bg-primary h-10.5">
      <div className="flex items-center justify-between h-full max-w-360 mx-auto px-5 lg:px-25">
        {/* Left */}
        <div className="flex items-center gap-5.5">
          <a
            href="tel:+917862950676"
            className="flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium hover:opacity-80 transition-opacity"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.77 19.79 19.79 0 01.91 1.12 2 2 0 012.92.01h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0121 14.92v2z" />
            </svg>
            +91 78629 50676
          </a>
          <a
            href="mailto:care@krishawomenshospital.in"
            className="hidden md:flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium hover:opacity-80 transition-opacity"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
            </svg>
            care@krishawomenshospital.in
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            className="hidden md:flex items-center px-3.5 py-1 rounded-[20px] bg-secondary text-text-inverse text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
          >
            Free PCOS Camp — 8 March
          </a>
          <span className="hidden sm:flex items-center gap-1.5 text-text-inverse text-[13.5px] font-medium">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            Mon–Sat 8AM–8PM
          </span>
        </div>
      </div>
    </div>
  );
}
