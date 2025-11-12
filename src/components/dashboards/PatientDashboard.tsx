import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Search, X } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Appointment, Doctor } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, specialization, doctors]);

  const loadData = () => {
    const allAppointments = storage.get<Appointment[]>('appointments', []);
    const userAppointments = allAppointments.filter(a => a.patientId === user?.id);
    setAppointments(userAppointments);

    const allUsers = storage.get<any[]>('users', []);
    const doctorsList = allUsers.filter(u => u.role === 'doctor') as Doctor[];
    setDoctors(doctorsList);
    setFilteredDoctors(doctorsList);
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization !== 'all') {
      filtered = filtered.filter(d => d.specialization === specialization);
    }

    setFilteredDoctors(filtered);
  };

  const specializations = Array.from(new Set(doctors.map(d => d.specialization)));

  const handleBookAppointment = () => {
    if (!selectedDoctor || !bookingDate || !bookingTime || !bookingReason) {
      toast({
        title: "Missing information",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId: user!.id,
      patientName: user!.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date: bookingDate,
      time: bookingTime,
      status: 'scheduled',
      reason: bookingReason,
      createdAt: new Date().toISOString()
    };

    const allAppointments = storage.get<Appointment[]>('appointments', []);
    allAppointments.push(newAppointment);
    storage.set('appointments', allAppointments);

    setAppointments([...appointments, newAppointment]);
    setIsBookingOpen(false);
    setBookingDate('');
    setBookingTime('');
    setBookingReason('');
    setSelectedDoctor(null);

    toast({
      title: "Appointment booked",
      description: `Your appointment with ${selectedDoctor.name} has been scheduled`
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const allAppointments = storage.get<Appointment[]>('appointments', []);
    const updated = allAppointments.map(a =>
      a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a
    );
    storage.set('appointments', updated);
    loadData();

    toast({
      title: "Appointment cancelled",
      description: "Your appointment has been cancelled"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Patient Dashboard</h2>
          <p className="text-muted-foreground">Manage your appointments and find doctors</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'scheduled').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Appointments</CardTitle>
            <CardDescription>View and manage your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments yet</p>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{appointment.doctorName}</h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-sm mt-1">{appointment.reason}</p>
                    </div>
                    {appointment.status === 'scheduled' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Find a Doctor</CardTitle>
            <CardDescription>Browse and book appointments with our doctors</CardDescription>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Specialization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specializations</SelectItem>
                  {specializations.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDoctors.map(doctor => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{doctor.name}</CardTitle>
                        <CardDescription>{doctor.specialization}</CardDescription>
                      </div>
                      <Badge variant="secondary">{doctor.experience} years</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{doctor.qualification}</p>
                    <p className="text-sm mb-4">{doctor.about}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">${doctor.fees}</span>
                      <Dialog open={isBookingOpen && selectedDoctor?.id === doctor.id} onOpenChange={(open) => {
                        setIsBookingOpen(open);
                        if (!open) setSelectedDoctor(null);
                      }}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedDoctor(doctor)}>Book Appointment</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book Appointment with {doctor.name}</DialogTitle>
                            <DialogDescription>Fill in the details for your appointment</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                type="date"
                                min={getMinDate()}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor="time">Time</Label>
                              <Select value={bookingTime} onValueChange={setBookingTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="09:00">09:00 AM</SelectItem>
                                  <SelectItem value="10:00">10:00 AM</SelectItem>
                                  <SelectItem value="11:00">11:00 AM</SelectItem>
                                  <SelectItem value="14:00">02:00 PM</SelectItem>
                                  <SelectItem value="15:00">03:00 PM</SelectItem>
                                  <SelectItem value="16:00">04:00 PM</SelectItem>
                                  <SelectItem value="17:00">05:00 PM</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason for visit</Label>
                              <Textarea
                                id="reason"
                                placeholder="Describe your symptoms or reason for visit"
                                value={bookingReason}
                                onChange={(e) => setBookingReason(e.target.value)}
                              />
                            </div>
                            <Button onClick={handleBookAppointment} className="w-full">
                              Confirm Booking
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
