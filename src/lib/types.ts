export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  experience: number;
  qualification: string;
  rating: number;
  fees: number;
  about: string;
  availability: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason: string;
  createdAt: string;
}
