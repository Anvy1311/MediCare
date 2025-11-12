import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';
import { storage } from '@/lib/storage';
import { Appointment, Doctor } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<Doctor | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    const allAppointments = storage.get<Appointment[]>('appointments', []);
    const doctorAppointments = allAppointments.filter(a => a.doctorId === user?.id);
    setAppointments(doctorAppointments);

    const allUsers = storage.get<any[]>('users', []);
    const doctorProfile = allUsers.find(u => u.id === user?.id) as Doctor;
    setProfile(doctorProfile);
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    const allAppointments = storage.get<Appointment[]>('appointments', []);
    const updated = allAppointments.map(a =>
      a.id === appointmentId ? { ...a, status: 'completed' as const } : a
    );
    storage.set('appointments', updated);
    loadData();

    toast({
      title: "Appointment completed",
      description: "The appointment has been marked as completed"
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
      description: "The appointment has been cancelled"
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

  const totalEarnings = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum) => sum + (profile?.fees || 0), 0);

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today && a.status === 'scheduled';
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Doctor Dashboard</h2>
          <p className="text-muted-foreground">Manage your appointments and profile</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
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
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(appointments.map(a => a.patientId)).size}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings}</div>
            </CardContent>
          </Card>
        </div>

        {profile && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your professional information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Specialization</p>
                  <p className="font-medium">{profile.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="font-medium">{profile.qualification}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="font-medium">{profile.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="font-medium">${profile.fees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-medium">⭐ {profile.rating}/5.0</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">About</p>
                  <p className="font-medium">{profile.about}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage your patient appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No appointments yet</p>
            ) : (
              <div className="space-y-4">
                {appointments
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(appointment => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{appointment.patientName}</h4>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm mt-1">
                          <span className="text-muted-foreground">Reason:</span> {appointment.reason}
                        </p>
                      </div>
                      {appointment.status === 'scheduled' && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleCompleteAppointment(appointment.id)}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
