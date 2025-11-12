import { User, Doctor, Appointment, TimeSlot } from './types';

// Initialize mock data on first load
export const initializeMockData = () => {
  const users = localStorage.getItem('users');
  
  if (!users) {
    // Create default users
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        email: 'admin@hospital.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin User',
        createdAt: new Date().toISOString()
      },
      {
        id: 'patient-1',
        email: 'patient@example.com',
        password: 'patient123',
        role: 'patient',
        name: 'John Doe',
        phone: '123-456-7890',
        createdAt: new Date().toISOString()
      }
    ];

    // Create doctors
    const doctors: Doctor[] = [
      {
        id: 'doctor-1',
        email: 'dr.smith@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Sarah Smith',
        phone: '123-456-7891',
        specialization: 'Cardiology',
        experience: 15,
        qualification: 'MD, FACC',
        rating: 4.8,
        fees: 150,
        about: 'Experienced cardiologist specializing in preventive cardiology and heart disease management.',
        availability: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'doctor-2',
        email: 'dr.johnson@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Michael Johnson',
        phone: '123-456-7892',
        specialization: 'Dermatology',
        experience: 10,
        qualification: 'MD, FAAD',
        rating: 4.6,
        fees: 120,
        about: 'Specialized in skin conditions, cosmetic dermatology, and skin cancer prevention.',
        availability: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'doctor-3',
        email: 'dr.williams@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Emily Williams',
        phone: '123-456-7893',
        specialization: 'Pediatrics',
        experience: 12,
        qualification: 'MD, FAAP',
        rating: 4.9,
        fees: 100,
        about: 'Compassionate pediatrician dedicated to child health and development.',
        availability: [],
        createdAt: new Date().toISOString()
      },
      {
        id: 'doctor-4',
        email: 'dr.brown@hospital.com',
        password: 'doctor123',
        role: 'doctor',
        name: 'Dr. Robert Brown',
        phone: '123-456-7894',
        specialization: 'Orthopedics',
        experience: 18,
        qualification: 'MD, FAAOS',
        rating: 4.7,
        fees: 180,
        about: 'Expert in joint replacement surgery and sports medicine.',
        availability: [],
        createdAt: new Date().toISOString()
      }
    ];

    // Generate time slots for doctors (next 7 days)
    const timeSlots: TimeSlot[] = [];
    doctors.forEach(doctor => {
      for (let day = 1; day <= 7; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Morning slots
        ['09:00', '10:00', '11:00'].forEach(time => {
          timeSlots.push({
            id: `slot-${doctor.id}-${dateStr}-${time}`,
            doctorId: doctor.id,
            date: dateStr,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
            isBooked: false
          });
        });
        
        // Afternoon slots
        ['14:00', '15:00', '16:00', '17:00'].forEach(time => {
          timeSlots.push({
            id: `slot-${doctor.id}-${dateStr}-${time}`,
            doctorId: doctor.id,
            date: dateStr,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
            isBooked: false
          });
        });
      }
    });

    // Create sample appointments
    const appointments: Appointment[] = [
      {
        id: 'appt-1',
        patientId: 'patient-1',
        patientName: 'John Doe',
        doctorId: 'doctor-1',
        doctorName: 'Dr. Sarah Smith',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '10:00',
        status: 'scheduled',
        reason: 'Regular checkup',
        createdAt: new Date().toISOString()
      }
    ];

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify([...defaultUsers, ...doctors]));
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
};
