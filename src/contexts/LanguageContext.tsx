
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  isArabic: boolean;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', ar: 'الرئيسية' },
  services: { en: 'Services', ar: 'الخدمات' },
  contactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
  scheduleVisit: { en: 'Schedule a Visit', ar: 'احجز موعد' },
  diagnosis: { en: 'Diagnosis', ar: 'التشخيص' },
  switchToEnglish: { en: 'Switch to English', ar: 'التبديل إلى الإنجليزية' },
  switchToArabic: { en: 'العربية', ar: 'التبديل إلى العربية' },
  
  // Hero Section
  heroTitle: { en: 'Your Smile, Our Passion', ar: 'ابتسامتك، شغفنا' },
  heroSubtitle: { 
    en: 'Providing the highest quality dental care, with a gentle touch, in a friendly and modern environment. Let us help you achieve the healthy, beautiful smile you deserve.',
    ar: 'نقدم أعلى مستوى من العناية بالأسنان، بلمسة لطيفة، في بيئة ودودة وحديثة. دعنا نساعدك في الحصول على الابتسامة الصحية والجميلة التي تستحقها.'
  },
  
  // Contact Info
  phone: { en: 'Phone', ar: 'الهاتف' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  hours: { en: 'Hours', ar: 'ساعات العمل' },
  workingHours: { en: 'Mon-Thu & Sat-Sun: 12PM-10PM', ar: 'الإثنين-الخميس والسبت-الأحد: 12ظ-10م' },
  
  // Services
  servicesTitle: { en: 'Our Premium Services', ar: 'خدماتنا المتميزة' },
  servicesSubtitle: { 
    en: 'We offer a comprehensive range of dental services using the latest technology to ensure your comfort and satisfaction.',
    ar: 'نقدم مجموعة شاملة من خدمات طب الأسنان باستخدام أحدث التقنيات لضمان راحتك ورضاك.'
  },
  cosmeticFillings: { en: 'Cosmetic Fillings', ar: 'حشوات تجميلية' },
  cosmeticFillingsDesc: { 
    en: 'Durable, tooth-colored fillings that restore your teeth while maintaining their natural appearance.',
    ar: 'حشوات متينة بلون الأسنان تعيد أسنانك مع الحفاظ على مظهرها الطبيعي.'
  },
  dentalImplants: { en: 'Dental Implants', ar: 'زراعة الأسنان' },
  dentalImplantsDesc: { 
    en: 'A permanent, reliable solution for missing teeth that looks and functions naturally.',
    ar: 'حل دائم وموثوق للأسنان المفقودة يبدو ويعمل بشكل طبيعي.'
  },
  maxillofacialSurgery: { en: 'Maxillofacial Surgery', ar: 'جراحات الوجه والفكين' },
  maxillofacialSurgeryDesc: { 
    en: 'Specialized surgical procedures for complex dental and facial conditions by expert surgeons.',
    ar: 'إجراءات جراحية متخصصة لحالات الأسنان والوجه المعقدة من قبل جراحين خبراء.'
  },
  
  // Diagnosis
  diagnosisTitle: { en: 'Professional Diagnosis', ar: 'التشخيص المهني' },
  diagnosisSubtitle: { 
    en: 'Our comprehensive diagnostic services help identify dental issues early, ensuring the best treatment outcomes for your oral health.',
    ar: 'خدماتنا التشخيصية الشاملة تساعد في تحديد مشاكل الأسنان مبكراً، مما يضمن أفضل نتائج العلاج لصحة فمك.'
  },
  digitalXrays: { en: 'Digital X-Rays', ar: 'الأشعة السينية الرقمية' },
  digitalXraysDesc: { 
    en: 'Advanced digital imaging for accurate diagnosis with minimal radiation exposure.',
    ar: 'تصوير رقمي متقدم للتشخيص الدقيق مع التعرض الأدنى للإشعاع.'
  },
  oralHealthAssessment: { en: 'Oral Health Assessment', ar: 'تقييم صحة الفم' },
  oralHealthAssessmentDesc: { 
    en: 'Comprehensive evaluation of your teeth, gums, and overall oral health condition.',
    ar: 'تقييم شامل لأسنانك ولثتك وحالة صحة فمك العامة.'
  },
  personalizedTreatment: { en: 'Personalized Treatment Plans', ar: 'خطط علاج مخصصة' },
  personalizedTreatmentDesc: { 
    en: 'Customized treatment recommendations based on your specific needs and goals.',
    ar: 'توصيات علاج مخصصة بناءً على احتياجاتك وأهدافك المحددة.'
  },
  
  // About Section
  welcomeTitle: { en: 'Welcome to SAFA Dental Center', ar: 'مرحباً بكم في مركز صفا لطب الأسنان' },
  welcomeText1: { 
    en: 'At SAFA Dental Center, we believe that a healthy smile is a gateway to a happy life. Our lead dentist, Dr. Hesham, and his dedicated team are committed to providing personalized and compassionate dental care.',
    ar: 'في مركز صفا لطب الأسنان، نؤمن أن الابتسامة الصحية هي بوابة الحياة السعيدة. طبيب الأسنان الرئيسي لدينا، الدكتور هشام، وفريقه المتفاني ملتزمون بتقديم رعاية أسنان شخصية ومتعاطفة.'
  },
  welcomeText2: { 
    en: 'We combine state-of-the-art technology with years of expertise to ensure your visits are comfortable, efficient, and effective.',
    ar: 'نجمع بين التكنولوجيا المتطورة وسنوات من الخبرة لضمان أن زياراتك مريحة وفعالة ومؤثرة.'
  },
  
  // Team Section
  teamTitle: { en: 'Meet Our Expert Team', ar: 'تعرف على فريقنا الخبير' },
  leadDentist: { en: 'Lead Dentist & Oral Surgeon', ar: 'طبيب أسنان رئيسي وجراح فم' },
  cosmeticDentist: { en: 'Cosmetic Dentist', ar: 'طبيب أسنان تجميلي' },
  orthodontist: { en: 'Orthodontist', ar: 'أخصائي تقويم أسنان' },
  experience: { en: 'experience', ar: 'سنوات خبرة' },
  
  // Testimonials
  testimonialsTitle: { en: 'What Our Patients Say', ar: 'ماذا يقول مرضانا' },
  testimonial1: { 
    en: 'Excellent service and caring staff. Dr. Hesham helped me get my perfect smile with dental implants.',
    ar: 'خدمة ممتازة وطاقم مهتم. الدكتور هشام ساعدني في الحصول على ابتسامتي المثالية بزراعة الأسنان.'
  },
  testimonial2: { 
    en: 'The best dental center in Cairo. Professional, caring, and always available when needed.',
    ar: 'أفضل مركز أسنان في القاهرة. مهني ومهتم ومتاح دائماً عند الحاجة.'
  },
  testimonial3: { 
    en: 'Outstanding care for my entire family. Highly recommend their dental services.',
    ar: 'رعاية متميزة لعائلتي بأكملها. أنصح بشدة بخدماتهم لطب الأسنان.'
  },
  
  // Appointment Form
  bookAppointment: { en: 'Book Your Appointment', ar: 'احجز موعدك' },
  appointmentSubtitle: { 
    en: 'Ready to transform your smile? Fill out the form below and we\'ll contact you to confirm your visit.',
    ar: 'مستعد لتحويل ابتسامتك؟ املأ النموذج أدناه وسنتصل بك لتأكيد زيارتك.'
  },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  phoneNumber: { en: 'Phone Number', ar: 'رقم الهاتف' },
  emailAddress: { en: 'Email Address', ar: 'عنوان البريد الإلكتروني' },
  preferredDate: { en: 'Preferred Date', ar: 'التاريخ المفضل' },
  availableTimeSlots: { en: 'Available Time Slots', ar: 'الأوقات المتاحة' },
  additionalMessage: { en: 'Additional Message (Optional)', ar: 'رسالة إضافية (اختيارية)' },
  enterFullName: { en: 'Enter your full name', ar: 'أدخل اسمك الكامل' },
  enterPhone: { en: 'Enter your phone number', ar: 'أدخل رقم هاتفك' },
  enterEmail: { en: 'Enter your email', ar: 'أدخل بريدك الإلكتروني' },
  selectTimeSlot: { en: 'Select a time slot', ar: 'اختر وقتاً' },
  loadingSlots: { en: 'Loading slots...', ar: 'جاري تحميل الأوقات...' },
  noSlots: { en: 'No available slots for this date', ar: 'لا توجد أوقات متاحة لهذا التاريخ' },
  additionalInfo: { en: 'Any additional information or special requests', ar: 'أي معلومات إضافية أو طلبات خاصة' },
  requestAppointment: { en: 'Request Appointment', ar: 'طلب موعد' },
  booking: { en: 'Booking...', ar: 'جاري الحجز...' }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isArabic, setIsArabic] = useState(false);

  const toggleLanguage = () => {
    setIsArabic(!isArabic);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[isArabic ? 'ar' : 'en'];
  };

  return (
    <LanguageContext.Provider value={{ isArabic, toggleLanguage, t }}>
      <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
