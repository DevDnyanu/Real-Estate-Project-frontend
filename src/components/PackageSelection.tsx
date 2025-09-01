import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Award, Star, Phone, Image, Calendar, TrendingUp } from 'lucide-react';

interface PackageSelectionProps {
  currentLang: 'en' | 'hi';
  onSelectPackage?: (packageType: 'silver' | 'gold' | 'premium') => void;
}

const translations = {
  en: {
    title: 'Choose Your Seller Package',
    subtitle: 'Unlock premium features to boost your property visibility',
    silverTitle: 'Silver Package',
    goldTitle: 'Gold Package',
    premiumTitle: 'Premium Package',
    price: '₹999/month',
    goldPrice: '₹1,999/month',
    premiumPrice: '₹2,999/month',
    popular: 'Most Popular',
    recommended: 'Recommended',
    selectPlan: 'Select Plan',
    features: {
      basicListing: 'Basic Property Listing',
      photos: 'photos',
      contactInfo: 'Contact Information Visible',
      prioritySupport: 'Priority Customer Support',
      featuredListing: 'Featured Listing Badge',
      socialMedia: 'Social Media Promotion',
      analytics: 'Property View Analytics',
      homePageBanner: 'Homepage Banner Placement',
      dedicatedManager: 'Dedicated Account Manager',
      premiumBadge: 'Premium Listing Badge',
      virtualTour: 'Virtual Tour Integration',
      leadGeneration: 'Lead Generation Tools'
    },
    silverFeatures: [
      'Contact Information Visible',
      'Up to 5 photos',
      'Basic Property Listing',
      'Email Support'
    ],
    goldFeatures: [
      'Everything in Silver',
      'Featured Listing Badge',
      'Up to 15 photos',
      'Priority Support',
      'Property Analytics',
      'Social Media Boost'
    ],
    premiumFeatures: [
      'Everything in Gold',
      'Homepage Banner Placement',
      'Unlimited Photos',
      'Virtual Tour Integration',
      'Dedicated Account Manager',
      'Premium Badge',
      'Lead Generation Tools'
    ]
  },
  hi: {
    title: 'अपना विक्रेता पैकेज चुनें',
    subtitle: 'अपनी संपत्ति की दृश्यता बढ़ाने के लिए प्रीमियम सुविधाओं को अनलॉक करें',
    silverTitle: 'सिल्वर पैकेज',
    goldTitle: 'गोल्ड पैकेज',
    premiumTitle: 'प्रीमियम पैकेज',
    price: '₹999/महीना',
    goldPrice: '₹1,999/महीना',
    premiumPrice: '₹2,999/महीना',
    popular: 'सबसे लोकप्रिय',
    recommended: 'अनुशंसित',
    selectPlan: 'प्लान चुनें',
    features: {
      basicListing: 'बुनियादी संपत्ति सूची',
      photos: 'फोटो',
      contactInfo: 'संपर्क जानकारी दिखाई',
      prioritySupport: 'प्राथमिकता ग्राहक सहायता',
      featuredListing: 'फीचर्ड लिस्टिंग बैज',
      socialMedia: 'सोशल मीडिया प्रमोशन',
      analytics: 'संपत्ति दृश्य विश्लेषण',
      homePageBanner: 'होमपेज बैनर प्लेसमेंट',
      dedicatedManager: 'समर्पित खाता प्रबंधक',
      premiumBadge: 'प्रीमियम लिस्टिंग बैज',
      virtualTour: 'वर्चुअल टूर एकीकरण',
      leadGeneration: 'लीड जेनरेशन टूल्स'
    },
    silverFeatures: [
      'संपर्क जानकारी दिखाई',
      '5 तक फोटो',
      'बुनियादी संपत्ति सूची',
      'ईमेल सहायता'
    ],
    goldFeatures: [
      'सिल्वर की सभी सुविधाएं',
      'फीचर्ड लिस्टिंग बैज',
      '15 तक फोटो',
      'प्राथमिकता सहायता',
      'संपत्ति विश्लेषण',
      'सोशल मीडिया बूस्ट'
    ],
    premiumFeatures: [
      'गोल्ड की सभी सुविधाएं',
      'होमपेज बैनर प्लेसमेंट',
      'असीमित फोटो',
      'वर्चुअल टूर एकीकरण',
      'समर्पित खाता प्रबंधक',
      'प्रीमियम बैज',
      'लीड जेनरेशन टूल्स'
    ]
  }
};

export const PackageSelection = ({ currentLang, onSelectPackage }: PackageSelectionProps) => {
  const t = translations[currentLang];

  const packages = [
    {
      id: 'silver',
      title: t.silverTitle,
      price: t.price,
      icon: Star,
      gradient: 'bg-gradient-silver',
      textColor: 'text-silver-foreground',
      features: t.silverFeatures,
      badge: null
    },
    {
      id: 'gold',
      title: t.goldTitle,
      price: t.goldPrice,
      icon: Award,
      gradient: 'bg-gradient-gold',
      textColor: 'text-gold-foreground',
      features: t.goldFeatures,
      badge: t.popular
    },
    {
      id: 'premium',
      title: t.premiumTitle,
      price: t.premiumPrice,
      icon: Crown,
      gradient: 'bg-gradient-premium',
      textColor: 'text-premium-foreground',
      features: t.premiumFeatures,
      badge: t.recommended
    }
  ];

  return (
    <section className="py-16 bg-accent/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
            {t.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const IconComponent = pkg.icon;
            const isPopular = pkg.badge === t.popular;
            
            return (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden ${
                  isPopular 
                    ? 'ring-2 ring-gold shadow-premium transform scale-105' 
                    : 'hover:shadow-elevated hover:-translate-y-2'
                } transition-all duration-300`}
              >
                {pkg.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-gold text-gold-foreground px-4 py-1 text-sm font-medium">
                    {pkg.badge}
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full ${pkg.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className={`w-8 h-8 ${pkg.textColor}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold mb-2">
                    {pkg.title}
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {pkg.price}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${pkg.gradient} ${pkg.textColor} hover:opacity-90 font-medium`}
                    onClick={() => onSelectPackage?.(pkg.id as 'silver' | 'gold' | 'premium')}
                  >
                    {t.selectPlan}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-background rounded-lg shadow-card p-8">
          <h3 className="text-2xl font-bold text-center mb-8 font-heading">
            Package Comparison
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Feature Icons Legend */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.features.contactInfo}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Image className="w-5 h-5 text-primary" />
                <span className="text-sm">Property Photos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.features.featuredListing}</span>
              </div>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm">{t.features.analytics}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};