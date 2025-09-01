import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  currentLang: 'en' | 'hi';
}

const translations = {
  en: {
    brand: 'PuneProperties',
    tagline: 'Your trusted partner in real estate',
    quickLinks: 'Quick Links',
    buy: 'Buy Properties',
    sell: 'Sell Properties',
    rent: 'Rent Properties',
    about: 'About Us',
    contact: 'Contact Us',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    contactInfo: 'Contact Information',
    address: 'Hinjewadi, Pune, Maharashtra 411057',
    phone: '+91 7499696621',
    email: 'info@puneproperties.com',
    newsletter: 'Newsletter',
    newsletterText: 'Subscribe to get latest property updates',
    subscribe: 'Subscribe',
    followUs: 'Follow Us',
    copyright: '© 2024 PuneProperties. All rights reserved.',
    sellerPackages: 'Seller Packages',
    silver: 'Silver Package',
    gold: 'Gold Package',
    premium: 'Premium Package',
    support: 'Support',
    faq: 'FAQ',
    helpCenter: 'Help Center'
  },
  hi: {
    brand: 'पुणे प्रॉपर्टीज',
    tagline: 'रियल एस्टेट में आपका विश्वसनीय साझेदार',
    quickLinks: 'त्वरित लिंक',
    buy: 'संपत्ति खरीदें',
    sell: 'संपत्ति बेचें',
    rent: 'संपत्ति किराए पर दें',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    privacy: 'गोपनीयता नीति',
    terms: 'नियम और शर्तें',
    contactInfo: 'संपर्क जानकारी',
    address: 'हिंजवडी, पुणे, महाराष्ट्र 411057',
    phone: '+91 7499696621',
    email: 'info@puneproperties.com',
    newsletter: 'न्यूज़लेटर',
    newsletterText: 'नवीनतम संपत्ति अपडेट प्राप्त करने के लिए सब्स्क्राइब करें',
    subscribe: 'सब्स्क्राइब करें',
    followUs: 'हमें फॉलो करें',
    copyright: '© 2024 पुणे प्रॉपर्टीज। सभी अधिकार सुरक्षित।',
    sellerPackages: 'विक्रेता पैकेज',
    silver: 'सिल्वर पैकेज',
    gold: 'गोल्ड पैकेज',
    premium: 'प्रीमियम पैकेज',
    support: 'सहायता',
    faq: 'पूछे जाने वाले प्रश्न',
    helpCenter: 'सहायता केंद्र'
  }
};

export const Footer = ({ currentLang }: FooterProps) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary-light" />
              <h3 className="text-xl font-bold">{t.brand}</h3>
            </div>
            <p className="text-background/80 text-sm">
              {t.tagline}
            </p>
            
            {/* Social Media */}
            <div className="space-y-3">
              <h4 className="font-semibold">{t.followUs}</h4>
              <div className="flex space-x-3">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:bg-primary/20">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.buy}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.sell}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.rent}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.about}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.contact}
                </Button>
              </li>
            </ul>
          </div>

          {/* Seller Packages */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.sellerPackages}</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-silver-light justify-start">
                  {t.silver}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-gold-light justify-start">
                  {t.gold}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-premium-light justify-start">
                  {t.premium}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.support}
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light justify-start">
                  {t.faq}
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">{t.contactInfo}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-light flex-shrink-0" />
                <span className="text-background/80">{t.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-light" />
                <span className="text-background/80">{t.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-light" />
                <span className="text-background/80">{t.email}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold">{t.newsletter}</h4>
              <p className="text-sm text-background/80">{t.newsletterText}</p>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter email" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                />
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 px-4">
                  {t.subscribe}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-background/20" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-background/80">{t.copyright}</p>
          <div className="flex space-x-6">
            <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light text-sm">
              {t.privacy}
            </Button>
            <Button variant="link" className="p-0 h-auto text-background/80 hover:text-primary-light text-sm">
              {t.terms}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};