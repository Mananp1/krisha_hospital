export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'staff';
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  email: string | null;
  appointment_date: string;
  appointment_time: string;
  message: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  patient_name: string;
  rating: number;
  review: string;
  approved: boolean;
  created_at: string;
  approved_by: string | null;
}

export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'updated_by'>;
export type ContactInquiryInsert = Omit<ContactInquiry, 'id' | 'created_at' | 'resolved_at' | 'resolved_by'>;
