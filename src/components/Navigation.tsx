
import { useState } from 'react';
import { Menu, X, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isArabic, toggleLanguage, t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: t('home'), action: () => scrollToSection('home') },
    { name: t('services'), action: () => scrollToSection('services') },
    { name: t('contactUs'), action: () => scrollToSection('contact') },
    { name: t('scheduleVisit'), action: () => scrollToSection('appointment') },
    { name: t('diagnosis'), action: () => scrollToSection('diagnosis') }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className={`flex items-center space-x-3 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-lg">
              <img 
                src="/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png" 
                alt="SAFA Dental Center Logo" 
                className="w-8 h-8 object-contain filter brightness-0 invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=64&h=64';
                  target.className = "w-8 h-8 object-contain";
                }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                {isArabic ? 'مركز صفا لطب الأسنان' : 'SAFA Dental Center'}
              </h1>
              <p className="text-sm text-slate-600">
                {isArabic ? 'SAFA Dental Center' : 'مركز صفا لطب الأسنان'}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center space-x-8 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 text-slate-700 hover:text-sky-600 font-medium transition-colors duration-200 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <Globe size={16} />
              <span>{isArabic ? 'EN' : 'العربية'}</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className={`hidden lg:flex items-center space-x-4 text-sm text-slate-600 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className={`flex items-center space-x-1 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Phone size={16} />
              <span>010 04500116</span>
            </div>
            <div className={`flex items-center space-x-1 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <Mail size={16} />
              <span>dr.hesham_dent@hotmail.com</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`text-slate-700 hover:text-sky-600 font-medium transition-colors duration-200 ${isArabic ? 'text-right' : 'text-left'}`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center space-x-2 text-slate-700 hover:text-sky-600 font-medium transition-colors duration-200 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <Globe size={16} />
                <span>{t('switchToEnglish')}</span>
              </button>
              
              <div className="pt-4 border-t">
                <div className="flex flex-col space-y-2 text-sm text-slate-600">
                  <div className={`flex items-center space-x-2 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Phone size={16} />
                    <span>010 04500116</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Mail size={16} />
                    <span>dr.hesham_dent@hotmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
