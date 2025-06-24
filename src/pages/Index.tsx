
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      title: "Cosmetic Fillings",
      arabicTitle: "حشوات تجميلية",
      description: "Durable, tooth-colored fillings that restore your teeth while maintaining their natural appearance.",
      icon: "fas fa-tooth",
      bgColor: "from-sky-500 to-blue-600",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Dental Implants",
      arabicTitle: "زراعة اسنان",
      description: "A permanent, reliable solution for missing teeth that looks and functions naturally.",
      icon: "fas fa-seedling",
      bgColor: "from-emerald-500 to-teal-600",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Maxillofacial Surgery",
      arabicTitle: "جراحات الوجه و الفكين",
      description: "Specialized surgical procedures for complex dental and facial conditions by expert surgeons.",
      icon: "fas fa-user-md",
      bgColor: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % services.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch available time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: string) => {
    try {
      const { data, error } = await supabase.rpc('get_available_slots', {
        check_date: date
      });

      if (error) {
        console.error('Error fetching slots:', error);
        return;
      }

      const slots = data?.map((slot: any) => slot.time_slot) || [];
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'date') {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, time: '' })); // Reset time when date changes
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_name: formData.name,
            patient_email: formData.email,
            patient_phone: formData.phone,
            appointment_date: formData.date,
            appointment_time: formData.time,
            message: formData.message || null
          }
        ]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Time Slot Unavailable",
            description: "This time slot has been booked by another patient. Please select a different time.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Appointment Requested!",
        description: "Your appointment request has been submitted. We'll contact you shortly to confirm.",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        message: ''
      });
      setSelectedDate('');
      setAvailableSlots([]);

    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to submit appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50">
        <div className="bg-slate-100 text-slate-600 text-sm hidden md:block border-b border-slate-200">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <i className="fas fa-phone text-sky-500"></i>
                <span>Call: 010 04500116</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-sky-500"></i>
                <span>33 A Elkasr ELEINI St, Cairo, Egypt</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <i className="fas fa-clock text-sky-500"></i>
              <span>Open: Mon-Thu & Sat-Sun: 12pm - 10pm</span>
            </div>
          </div>
        </div>
        
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#home" className="flex items-center group">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <i className="fas fa-tooth text-white text-2xl"></i>
            </div>
            <div className="ml-4">
              <span className="font-bold text-xl text-slate-800 leading-tight">SAFA Dental</span>
              <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Center</span>
            </div>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-slate-600 hover:text-sky-600 font-medium transition duration-300">Home</a>
            <a href="#services" className="text-slate-600 hover:text-sky-600 font-medium transition duration-300">Services</a>
            <a href="#about" className="text-slate-600 hover:text-sky-600 font-medium transition duration-300">About</a>
            <a href="#contact" className="text-slate-600 hover:text-sky-600 font-medium transition duration-300">Contact</a>
          </div>
          <a href="#appointment" className="hidden md:block bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <i className="fas fa-calendar-plus mr-2"></i>Book Appointment
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-b from-sky-500 to-sky-700 text-white relative">
        <div className="container mx-auto px-6 py-32 md:py-48 text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your Smile, <span className="text-yellow-300">Our Passion</span>
          </h1>
          <p className="text-xl md:text-2xl text-sky-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            Providing the highest quality dental care, with a gentle touch, in a friendly and modern environment. 
            Let us help you achieve the healthy, beautiful smile you deserve.
          </p>
          <a href="#appointment" className="bg-white text-sky-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            <i className="fas fa-calendar-check mr-2"></i>Schedule a Visit
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-4">
              Our Premium Services
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
              We offer a comprehensive range of dental services using the latest technology to ensure your comfort and satisfaction.
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {services.map((service, index) => (
                  <div key={index} className={`min-w-full bg-gradient-to-br ${service.bgColor}`}>
                    <div className="flex flex-col md:flex-row items-center text-white p-8 md:p-12">
                      <div className="md:w-1/2 md:pr-8 text-center md:text-left mb-8 md:mb-0">
                        <i className={`${service.icon} text-6xl mb-6 opacity-80`}></i>
                        <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                        <p className="text-2xl font-semibold mb-4 font-cairo" dir="rtl">{service.arabicTitle}</p>
                        <p className="text-lg leading-relaxed mb-6">{service.description}</p>
                      </div>
                      <div className="md:w-1/2 h-64 md:h-80">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="rounded-2xl shadow-xl w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + services.length) % services.length)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
            >
              <i className="fas fa-chevron-left text-sky-600"></i>
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % services.length)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all"
            >
              <i className="fas fa-chevron-right text-sky-600"></i>
            </button>
            
            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentSlide === index ? 'bg-sky-500 w-8' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-33352da69e0d?q=80&w=800&auto=format&fit=crop" 
                alt="Dr. Hesham" 
                className="rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-8">
                Welcome to SAFA Dental Center
              </h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                At SAFA Dental Center, we believe that a healthy smile is a gateway to a happy life. Our lead dentist, 
                <strong className="text-sky-600"> Dr. Hesham</strong>, and his dedicated team are committed to providing 
                personalized and compassionate dental care.
              </p>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                We combine state-of-the-art technology with years of expertise to ensure your visits are comfortable, 
                efficient, and effective.
              </p>
              <a href="#appointment" className="inline-block bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <i className="fas fa-users mr-2"></i>Meet The Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="py-20 md:py-28 bg-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Book Your Appointment</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Ready to transform your smile? Fill out the form below and we'll contact you to confirm your visit.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-10 md:p-12 rounded-3xl shadow-2xl">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-slate-700 font-semibold mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-slate-700 font-semibold mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition" 
                    required 
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-slate-700 font-semibold mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition" 
                  required 
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="date" className="block text-slate-700 font-semibold mb-2">Preferred Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={formData.date}
                    onChange={handleInputChange}
                    min={today}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-slate-700 font-semibold mb-2">Preferred Time</label>
                  <select 
                    id="time" 
                    name="time" 
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition" 
                    required
                    disabled={!selectedDate}
                  >
                    <option value="">
                      {!selectedDate ? 'Select a date first' : availableSlots.length === 0 ? 'No slots available' : 'Choose time slot'}
                    </option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {formatTime(slot)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mb-8">
                <label htmlFor="message" className="block text-slate-700 font-semibold mb-2">Message (Optional)</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4} 
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition resize-none"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Request Appointment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-800 text-slate-300">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <a href="#home" className="flex items-center group mb-4">
                <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-xl shadow-lg">
                  <i className="fas fa-tooth text-white text-2xl"></i>
                </div>
                <div className="ml-4">
                  <span className="font-bold text-xl text-white leading-tight">SAFA Dental</span>
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Center</span>
                </div>
              </a>
              <p className="pr-8">
                Your trusted partner for a lifetime of healthy smiles. We are dedicated to providing exceptional 
                dental care in a welcoming and comfortable atmosphere.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-sky-400 transition">Home</a></li>
                <li><a href="#services" className="hover:text-sky-400 transition">Services</a></li>
                <li><a href="#about" className="hover:text-sky-400 transition">About Us</a></li>
                <li><a href="#appointment" className="hover:text-sky-400 transition">Appointments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <i className="fas fa-map-marker-alt text-sky-500 mt-1"></i>
                  <span>33 A Elkasr ELEINI Street, National Ahly Bank building, Cairo, Egypt</span>
                </li>
                <li className="flex items-center space-x-3">
                  <i className="fas fa-phone text-sky-500"></i>
                  <span>010 04500116</span>
                </li>
                <li className="flex items-center space-x-3">
                  <i className="fas fa-envelope text-sky-500"></i>
                  <span>dr.hesham_dent@hotmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm">
            <p>&copy; 2024 SAFA Dental Center. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
