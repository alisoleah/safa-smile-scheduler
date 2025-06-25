
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, Clock, MapPin, Phone, Mail, User, Heart, Shield, Users, Award, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ClickableAddress from "@/components/ClickableAddress";
import { Link } from "react-router-dom";

const Index = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    appointment_date: "",
    appointment_time: "",
    message: ""
  });
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const clinicAddress = "123 Health Street, Medical Center, City, State 12345";

  useEffect(() => {
    if (formData.appointment_date) {
      fetchAvailableSlots(formData.appointment_date);
    }
  }, [formData.appointment_date]);

  const fetchAvailableSlots = async (date: string) => {
    setSlotsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_available_slots', {
        check_date: date
      });

      if (error) throw error;
      
      const slots = data?.map((slot: any) => slot.time_slot) || [];
      setAvailableSlots(slots);
    } catch (error: any) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch available time slots');
      setAvailableSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Appointment booked successfully! You will receive a confirmation once approved.');
      
      // Reset form
      setFormData({
        patient_name: "",
        patient_email: "",
        patient_phone: "",
        appointment_date: "",
        appointment_time: "",
        message: ""
      });
      setAvailableSlots([]);
    } catch (error: any) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlot = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const services = [
    {
      icon: Heart,
      title: "Cardiology",
      description: "Comprehensive heart care and cardiovascular health services"
    },
    {
      icon: Shield,
      title: "General Medicine",
      description: "Primary healthcare and preventive medicine for all ages"
    },
    {
      icon: Users,
      title: "Family Practice",
      description: "Complete family healthcare from pediatrics to geriatrics"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      image: "/placeholder.svg",
      experience: "15+ years"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "General Practitioner",
      image: "/placeholder.svg",
      experience: "12+ years"
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Family Medicine",
      image: "/placeholder.svg",
      experience: "10+ years"
    }
  ];

  const testimonials = [
    {
      name: "John Smith",
      rating: 5,
      text: "Excellent service and caring staff. Dr. Johnson helped me get my heart condition under control."
    },
    {
      name: "Maria Garcia",
      rating: 5,
      text: "The best medical center in town. Professional, caring, and always available when needed."
    },
    {
      name: "David Wilson",
      rating: 5,
      text: "Outstanding care for my entire family. Highly recommend their services."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Medical Center</h1>
          <p className="text-lg text-gray-600 mb-4">Your trusted healthcare partner</p>
          <div className="flex justify-center mb-4">
            <ClickableAddress address={clinicAddress} />
          </div>
          <div className="flex justify-center">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="flex items-center space-x-3 p-4">
              <Phone className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-3 p-4">
              <Mail className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">info@medicalcenter.com</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center space-x-3 p-4">
              <Clock className="text-blue-600" size={24} />
              <div>
                <p className="font-semibold">Hours</p>
                <p className="text-gray-600">Mon-Fri: 12PM-9PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <service.icon className="mx-auto mb-4 text-blue-600" size={48} />
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-blue-600 mb-2">{member.specialty}</p>
                        <p className="text-gray-600 text-sm">{member.experience} experience</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Patients Say</h2>
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <div className="flex justify-center mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="text-yellow-500 fill-current" size={20} />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                        <p className="font-semibold">- {testimonial.name}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* Appointment Form */}
        <section id="appointment">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="text-blue-600" size={24} />
                <span>Book an Appointment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_name" className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Full Name</span>
                    </Label>
                    <Input
                      id="patient_name"
                      type="text"
                      value={formData.patient_name}
                      onChange={(e) => handleInputChange('patient_name', e.target.value)}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient_email" className="flex items-center space-x-2">
                      <Mail size={16} />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="patient_email"
                      type="email"
                      value={formData.patient_email}
                      onChange={(e) => handleInputChange('patient_email', e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_phone" className="flex items-center space-x-2">
                      <Phone size={16} />
                      <span>Phone Number</span>
                    </Label>
                    <Input
                      id="patient_phone"
                      type="tel"
                      value={formData.patient_phone}
                      onChange={(e) => handleInputChange('patient_phone', e.target.value)}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointment_date" className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Preferred Date</span>
                    </Label>
                    <Input
                      id="appointment_date"
                      type="date"
                      value={formData.appointment_date}
                      onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {formData.appointment_date && (
                  <div className="space-y-2">
                    <Label htmlFor="appointment_time" className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>Available Time Slots</span>
                    </Label>
                    <Select
                      value={formData.appointment_time}
                      onValueChange={(value) => handleInputChange('appointment_time', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={slotsLoading ? "Loading slots..." : "Select a time slot"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.length > 0 ? (
                          availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {formatTimeSlot(slot)}
                            </SelectItem>
                          ))
                        ) : (
                          !slotsLoading && (
                            <SelectItem value="no-slots" disabled>
                              No available slots for this date
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Any additional information or special requests"
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !formData.appointment_time}
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;
