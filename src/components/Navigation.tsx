
import { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { name: 'Home', action: () => scrollToSection('home') },
    { name: 'Services', action: () => scrollToSection('services') },
    { name: 'Contact Us', action: () => scrollToSection('contact') },
    { name: 'Schedule a Visit', action: () => scrollToSection('appointment') },
    { name: 'Know Your يهشلرخسهس', action: () => scrollToSection('about') }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2 rounded-lg">
              <img 
                src="/lovable-uploads/7fd75df0-7b05-4b90-9328-a1f1817bab0d.png" 
                alt="SAFA Dental Center Logo" 
                className="w-8 h-8 object-contain filter brightness-0 invert"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SAFA Dental Center</h1>
              <p className="text-sm text-slate-600">مركز صفا لطب الأسنان</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="text-slate-700 hover:text-sky-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Phone size={16} />
              <span>010 04500116</span>
            </div>
            <div className="flex items-center space-x-1">
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
                  className="text-slate-700 hover:text-sky-600 font-medium text-left transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 border-t">
                <div className="flex flex-col space-y-2 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} />
                    <span>010 04500116</span>
                  </div>
                  <div className="flex items-center space-x-2">
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
