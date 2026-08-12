import {
  LayoutDashboardIcon,
  CalendarIcon,
  CalendarDaysIcon,
  MessageSquareIcon,
  UsersIcon,
  SettingsIcon,
} from 'lucide-react';

/** Shared by the desktop sidebar (AdminNav) and the mobile drawer (MobileNav). */
export const navLinks = [
  { label: 'Dashboard',    href: '/admin',              icon: LayoutDashboardIcon },
  { label: 'Appointments', href: '/admin/appointments', icon: CalendarIcon },
  { label: 'Schedule',     href: '/admin/calendar',     icon: CalendarDaysIcon },
  { label: 'Patients',     href: '/admin/patients',     icon: UsersIcon },
  { label: 'Inquiries',    href: '/admin/inquiries',    icon: MessageSquareIcon },
  { label: 'Settings',     href: '/admin/settings',     icon: SettingsIcon },
];
