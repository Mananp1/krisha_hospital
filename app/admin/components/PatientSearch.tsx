'use client';

import { SearchIcon, PhoneIcon } from 'lucide-react';
import { SearchField } from './SearchField';

/**
 * Name and phone filters for the patients list.
 *
 * Only two fields, unlike the appointments screen: date, status and attendance
 * describe a single booking, and a patient is a group of bookings spanning all
 * of them. Filtering a patient by "cancelled" would be asking a question with
 * no single answer.
 */
export function PatientSearch() {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <SearchField param="name"  placeholder="Search by name..."  icon={SearchIcon} />
      <SearchField param="phone" placeholder="Search by phone..." icon={PhoneIcon} />
    </div>
  );
}
