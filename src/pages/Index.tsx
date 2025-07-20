import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Calendar, Clock, MapPin, Phone, Mail, User, Heart, Sprout, Stethoscope, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClinicSettings } from "@/hooks/useClinicSettings";

const Index = () => {
  const { isArabic, t } = useLanguage();
  const { settings } = useClinicSettings();
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
      title: t('cosmeticFillings'),
      description: t('cosmeticFillingsDesc'),
      gradient: "from-sky-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop"
    },
    {
      icon: Sprout,
      title: t('dentalImplants'),
      description: t('dentalImplantsDesc'),
      gradient: "from-emerald-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop"
    },
    {
      icon: Stethoscope,
      title: t('maxillofacialSurgery'),
      description: t('maxillofacialSurgeryDesc'),
      gradient: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Hesham",
      specialty: t('leadDentist'),
      image: "Dr.Hesham.jpg",
      // image: "https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop",
      experience: `15+ ${t('experience')}`
    },
    {
      name: "Dr. Sarah Ahmed",
      specialty: t('cosmeticDentist'),
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
      experience: `12+ ${t('experience')}`
    },
    {
      name: "Dr. Mohamed Ali",
      specialty: t('orthodontist'),
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
      experience: `10+ ${t('experience')}`
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Hassan",
      rating: 5,
      text: t('testimonial1')
    },
    {
      name: "Fatma Mohamed",
      rating: 5,
      text: t('testimonial2')
    },
    {
      name: "Omar Mahmoud",
      rating: 5,
      text: t('testimonial3')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-sky-500 to-sky-700 text-white rounded-3xl mb-12 relative overflow-hidden">
            <div className="container mx-auto px-6 py-20 text-center relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                {t('heroTitle').split(', ')[0]}, <span className="text-yellow-300">{t('heroTitle').split(', ')[1]}</span>
              </h2>
              <p className="text-xl text-sky-100 max-w-4xl mx-auto mb-10 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <a href="#appointment" className="inline-block bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                <Calendar className={`inline ${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                {t('scheduleVisit')}
              </a>
            </div>
          </section>

          {/* Contact Info */}
          <div id="contact" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className={`flex items-center space-x-3 p-6 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Phone className="text-sky-600" size={24} />
                <div>
                  <p className="font-semibold">{t('phone')}</p>
                  <p className="text-gray-600" dir="ltr">{settings.phone_number}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className={`flex items-center space-x-3 p-6 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Mail className="text-sky-600" size={24} />
                <div>
                  <p className="font-semibold">{t('email')}</p>
                  <p className="text-gray-600" dir="ltr">{settings.email}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className={`flex items-center space-x-3 p-6 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Clock className="text-sky-600" size={24} />
                <div>
                  <p className="font-semibold">{t('hours')}</p>
                  <p className="text-gray-600">{isArabic ? settings.working_hours_ar : settings.working_hours_en}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <section id="services" className="mb-12">
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                {t('servicesTitle')}
              </span>
            </h2>
            <p className="text-slate-600 text-lg text-center max-w-3xl mx-auto mb-12 leading-relaxed">
              {t('servicesSubtitle')}
            </p>
            
            <div className="max-w-6xl mx-auto">
              <Carousel className="w-full">
                <CarouselContent>
                  {services.map((service, index) => (
                    <CarouselItem key={index}>
                      <Card className={`text-center hover:shadow-xl transition-shadow bg-gradient-to-br ${service.gradient} text-white overflow-hidden`}>
                        <CardContent className="p-0">
                          <div className={`flex flex-col md:flex-row items-center h-full ${isArabic ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-1/2 p-8 md:p-12 text-center md:text-left">
                              <service.icon className={`mx-auto ${isArabic ? 'md:mx-0' : 'md:mx-0'} mb-6 opacity-80`} size={64} />
                              <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                              <p className="text-lg leading-relaxed">{service.description}</p>
                            </div>
                            <div className="md:w-1/2 h-64 md:h-80">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80';
                  }}
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

          {/* Diagnosis Section */}
          <section id="diagnosis" className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  {t('diagnosisTitle')}
                </span>
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
                {t('diagnosisSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Stethoscope className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('digitalXrays')}</h3>
                  <p className="text-gray-600">{t('digitalXraysDesc')}</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('oralHealthAssessment')}</h3>
                  <p className="text-gray-600">{t('oralHealthAssessmentDesc')}</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="text-white" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('personalizedTreatment')}</h3>
                  <p className="text-gray-600">{t('personalizedTreatmentDesc')}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="mb-12">
            <div className={`flex flex-col lg:flex-row items-center gap-16 ${isArabic ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop" 
                  alt="Dr. Hesham" 
                  className="rounded-3xl shadow-2xl w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop';
                  }}
                />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                    {t('welcomeTitle')}
                  </span>
                </h2>
                <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                  {t('welcomeText1')}
                </p>
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                  {t('welcomeText2')}
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">{t('teamTitle')}</h2>
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
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop';
                            }}
                          />
                          <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                          <p className="text-sky-600 mb-2">{member.specialty}</p>
                          <p className="text-gray-600 text-sm">{member.experience}</p>
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
            <h2 className="text-3xl font-bold text-center mb-8">{t('testimonialsTitle')}</h2>
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
                <CardTitle className={`flex items-center justify-center space-x-2 text-4xl mb-4 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Calendar className="text-sky-600" size={32} />
                  <span>{t('bookAppointment')}</span>
                </CardTitle>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  {t('appointmentSubtitle')}
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient_name" className={`flex items-center space-x-2 font-semibold ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <User size={16} />
                        <span>{t('fullName')}</span>
                      </Label>
                      <Input
                        id="patient_name"
                        type="text"
                        value={formData.patient_name}
                        onChange={(e) => handleInputChange('patient_name', e.target.value)}
                        required
                        placeholder={t('enterFullName')}
                        className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient_phone" className={`flex items-center space-x-2 font-semibold ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Phone size={16} />
                        <span>{t('phoneNumber')}</span>
                      </Label>
                      <Input
                        id="patient_phone"
                        type="tel"
                        value={formData.patient_phone}
                        onChange={(e) => handleInputChange('patient_phone', e.target.value)}
                        required
                        placeholder={t('enterPhone')}
                        className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient_email" className={`flex items-center space-x-2 font-semibold ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Mail size={16} />
                      <span>{t('emailAddress')}</span>
                    </Label>
                    <Input
                      id="patient_email"
                      type="email"
                      value={formData.patient_email}
                      onChange={(e) => handleInputChange('patient_email', e.target.value)}
                      required
                      placeholder={t('enterEmail')}
                      className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="appointment_date" className={`flex items-center space-x-2 font-semibold ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <Calendar size={16} />
                      <span>{t('preferredDate')}</span>
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
                      <Label htmlFor="appointment_time" className={`flex items-center space-x-2 font-semibold ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Clock size={16} />
                        <span>{t('availableTimeSlots')}</span>
                      </Label>
                      <Select
                        value={formData.appointment_time}
                        onValueChange={(value) => handleInputChange('appointment_time', value)}
                        required
                      >
                        <SelectTrigger className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3">
                          <SelectValue placeholder={slotsLoading ? t('loadingSlots') : t('selectTimeSlot')} />
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
                                {t('noSlots')}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-semibold">{t('additionalMessage')}</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder={t('additionalInfo')}
                      rows={4}
                      className="border-2 border-slate-200 focus:border-sky-500 rounded-xl px-4 py-3 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                    disabled={loading || !formData.appointment_time}
                  >
                    {loading ? t('booking') : (
                      <>
                        <Calendar className={`${isArabic ? 'ml-2' : 'mr-2'}`} size={20} />
                        {t('requestAppointment')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Index;
