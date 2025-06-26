
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, Clock, MapPin, Phone, Mail, User, Heart, Sprout, Stethoscope, Star } from "lucide-react";
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

  const clinicAddress = "33 A Elkasr ELEINI St, Cairo, Egypt";

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
      title: "Cosmetic Fillings",
      arabicTitle: "حشوات تجميلية",
      description: "Durable, tooth-colored fillings that restore your teeth while maintaining their natural appearance.",
      gradient: "from-sky-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop"
    },
    {
      icon: Sprout,
      title: "Dental Implants", 
      arabicTitle: "زراعة اسنان",
      description: "A permanent, reliable solution for missing teeth that looks and functions naturally.",
      gradient: "from-emerald-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop"
    },
    {
      icon: Stethoscope,
      title: "Maxillofacial Surgery",
      arabicTitle: "جراحات الوجه و الفكين", 
      description: "Specialized surgical procedures for complex dental and facial conditions by expert surgeons.",
      gradient: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Hesham",
      specialty: "Lead Dentist & Oral Surgeon",
      image: "https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop",
      experience: "15+ years"
    },
    {
      name: "Dr. Sarah Ahmed",
      specialty: "Cosmetic Dentist",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
      experience: "12+ years"
    },
    {
      name: "Dr. Mohamed Ali",
      specialty: "Orthodontist",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
      experience: "10+ years"
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      rating: 5,
      text: "Excellent service and caring staff. Dr. Hesham helped me get my perfect smile with dental implants."
    },
    {
      name: "Fatma Mohamed",
      rating: 5,
      text: "The best dental center in Cairo. Professional, caring, and always available when needed."
    },
    {
      name: "Omar Mahmoud",
      rating: 5,
      text: "Outstanding care for my entire family. Highly recommend their dental services."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="bg-slate-100 text-slate-600 text-sm py-2 border-b border-slate-200">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-sky-500" />
              <span>Call: 010 04500116</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-sky-500" />
              <ClickableAddress address={clinicAddress} className="text-sm hover:text-sky-600" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-500" />
            <span>Open: Mon-Thu & Sat-Sun: 12pm - 10pm</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl shadow-lg mr-4">
              <Heart className="text-white text-3xl" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-1">SAFA Dental Center</h1>
              <p className="text-sm font-semibold text-slate-500 tracking-wider uppercase">Your Smile, Our Passion</p>
            </div>
          </div>
          <div className="flex justify-center">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-sky-500 to-sky-700 text-white rounded-3xl mb-12 relative overflow-hidden">
          <div className="container mx-auto px-6 py-20 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Your Smile, <span className="text-yellow-300">Our Passion</span>
            </h2>
            <p className="text-xl text-sky-100 max-w-4xl mx-auto mb-10 leading-relaxed">
              Providing the highest quality dental care, with a gentle touch, in a friendly and modern environment. 
              Let us help you achieve the healthy, beautiful smile you deserve.
            </p>
            <a href="#appointment" className="inline-block bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <Calendar className="inline mr-2" size={20} />
              Schedule a Visit
            </a>
          </div>
        </section>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-3 p-6">
              <Phone className="text-sky-600" size={24} />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600">010 04500116</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-3 p-6">
              <Mail className="text-sky-600" size={24} />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">dr.hesham_dent@hotmail.com</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center space-x-3 p-6">
              <Clock className="text-sky-600" size={24} />
              <div>
                <p className="font-semibold">Hours</p>
                <p className="text-gray-600">Mon-Thu & Sat-Sun: 12PM-10PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Our Premium Services
            </span>
          </h2>
          <p className="text-slate-600 text-lg text-center max-w-3xl mx-auto mb-12 leading-relaxed">
            We offer a comprehensive range of dental services using the latest technology to ensure your comfort and satisfaction.
          </p>
          
          <div className="max-w-6xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {services.map((service, index) => (
                  <CarouselItem key={index}>
                    <Card className={`text-center hover:shadow-xl transition-shadow bg-gradient-to-br ${service.gradient} text-white overflow-hidden`}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row items-center h-full">
                          <div className="md:w-1/2 p-8 md:p-12 text-center md:text-left">
                            <service.icon className="mx-auto md:mx-0 mb-6 opacity-80" size={64} />
                            <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                            <p className="text-2xl font-semibold mb-4" style={{fontFamily: 'Cairo'}} dir="rtl">
                              {service.arabicTitle}
                            </p>
                            <p className="text-lg leading-relaxed">{service.description}</p>
                          </div>
                          <div className="md:w-1/2 h-64 md:h-80">
                            <img 
                              src={service.image} 
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
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

        {/* About Section */}
        <section className="mb-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop" 
                alt="Dr. Hesham" 
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  Welcome to SAFA Dental Center
                </span>
              </h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                At SAFA Dental Center, we believe that a healthy smile is a gateway to a happy life. 
                Our lead dentist, <strong className="text-sky-600">Dr. Hesham</strong>, and his dedicated team 
                are committed to providing personalized and compassionate dental care.
              </p>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                We combine state-of-the-art technology with years of expertise to ensure your visits 
                are comfortable, efficient, and effective.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Expert Team</h2>
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {teamMembers.map((member, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="text-center hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                        <p className="text-sky-600 mb-2">{member.specialty}</p>
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
                    <Card className="hover:shadow-lg transition-shadow">
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
          <Card className="max-w-3xl mx-auto bg-white shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-4xl mb-4">
                <Calendar className="text-sky-600" size={32} />
                <span>Book Your Appointment</span>
              </CardTitle>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Ready to transform your smile? Fill out the form below and we'll contact you to confirm your visit.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_name" className="flex items-center space-x-2 font-semibold">
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
                      className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient_phone" className="flex items-center space-x-2 font-semibold">
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
                      className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient_email" className="flex items-center space-x-2 font-semibold">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </Label>
                  <Input
                    id="patient_email"
                    type="email"
                    value={formData.patient_email}
                    onChange={(e) => handleInputChange('patient_email', e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment_date" className="flex items-center space-x-2 font-semibold">
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
                    className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                  />
                </div>

                {formData.appointment_date && (
                  <div className="space-y-2">
                    <Label htmlFor="appointment_time" className="flex items-center space-x-2 font-semibold">
                      <Clock size={16} />
                      <span>Available Time Slots</span>
                    </Label>
                    <Select
                      value={formData.appointment_time}
                      onValueChange={(value) => handleInputChange('appointment_time', value)}
                      required
                    >
                      <SelectTrigger className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3">
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
                  <Label htmlFor="message" className="font-semibold">Additional Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Any additional information or special requests"
                    rows={4}
                    className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                  disabled={loading || !formData.appointment_time}
                >
                  {loading ? 'Booking...' : (
                    <>
                      <Calendar className="mr-2" size={20} />
                      Request Appointment
                    </>
                  )}
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
