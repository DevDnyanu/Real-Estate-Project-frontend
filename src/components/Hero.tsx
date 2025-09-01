import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Search, MapPin, Home, Building, Bed } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

interface HeroProps {
  currentLang: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'Find Your Dream Property in Pune',
    searchPlaceholder: 'Search by location, property type...',
    buyTab: 'Buy',
    sellTab: 'Sell',
    rentTab: 'Rent',
    location: 'Location',
    propertyType: 'Property Type',
    budget: 'Budget',
    bedrooms: 'Bedrooms',
    searchButton: 'Search Properties',
    selectLocation: 'Select Location',
    selectType: 'Select Type',
    selectBudget: 'Select Budget',
    selectBedrooms: 'Bedrooms',
    apartment: 'Apartment',
    villa: 'Villa',
    house: 'House',
    office: 'Office',
    showroom: 'Showroom',
    anyBedroom: 'Any',
    underBudget: 'Under ₹50L',
    budget50to1cr: '₹50L - ₹1Cr',
    budget1to2cr: '₹1Cr - ₹2Cr',
    budget2to5cr: '₹2Cr - ₹5Cr',
    above5cr: 'Above ₹5Cr'
  },
  hi: {
    title: 'पुणे में अपनी सपनों की संपत्ति खोजें',
    searchPlaceholder: 'स्थान, संपत्ति प्रकार से खोजें...',
    buyTab: 'खरीदें',
    sellTab: 'बेचें',
    rentTab: 'किराया',
    location: 'स्थान',
    propertyType: 'संपत्ति प्रकार',
    budget: 'बजट',
    bedrooms: 'बेडरूम',
    searchButton: 'संपत्ति खोजें',
    selectLocation: 'स्थान चुनें',
    selectType: 'प्रकार चुनें',
    selectBudget: 'बजट चुनें',
    selectBedrooms: 'बेडरूम',
    apartment: 'अपार्टमेंट',
    villa: 'विला',
    house: 'मकान',
    office: 'कार्यालय',
    showroom: 'शोरूम',
    anyBedroom: 'कोई भी',
    underBudget: '₹50 लाख तक',
    budget50to1cr: '₹50 लाख - ₹1 करोड़',
    budget1to2cr: '₹1 करोड़ - ₹2 करोड़',
    budget2to5cr: '₹2 करोड़ - ₹5 करोड़',
    above5cr: '₹5 करोड़ से ऊपर'
  }
};

const puneLocations = ['Koregaon Park', 'Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Magarpatta', 'Aundh', 'Viman Nagar', 'Hadapsar', 'Katraj'];

export const Hero = ({ currentLang }: HeroProps) => {
  const [activeTab, setActiveTab] = useState('buy');
  const t = translations[currentLang];

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-overlay"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Hero Text */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">
            {t.title}
          </h1>
          

          {/* Search Card */}
          <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-elevated">
            

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {t.location}
                </label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t.selectLocation} />
                  </SelectTrigger>
                  <SelectContent>
                    {puneLocations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {t.propertyType}
                </label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">{t.apartment}</SelectItem>
                    <SelectItem value="villa">{t.villa}</SelectItem>
                    <SelectItem value="house">{t.house}</SelectItem>
                    <SelectItem value="office">{t.office}</SelectItem>
                    <SelectItem value="showroom">{t.showroom}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget/Bedrooms */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center">
                  {activeTab === 'rent' ? (
                    <>
                      <Bed className="w-4 h-4 mr-1" />
                      {t.bedrooms}
                    </>
                  ) : (
                    <>
                      <Home className="w-4 h-4 mr-1" />
                      {t.budget}
                    </>
                  )}
                </label>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={activeTab === 'rent' ? t.selectBedrooms : t.selectBudget} />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === 'rent' ? (
                      <>
                        <SelectItem value="any">{t.anyBedroom}</SelectItem>
                        <SelectItem value="1">1 BHK</SelectItem>
                        <SelectItem value="2">2 BHK</SelectItem>
                        <SelectItem value="3">3 BHK</SelectItem>
                        <SelectItem value="4">4+ BHK</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="under50">{t.underBudget}</SelectItem>
                        <SelectItem value="50to1cr">{t.budget50to1cr}</SelectItem>
                        <SelectItem value="1to2cr">{t.budget1to2cr}</SelectItem>
                        <SelectItem value="2to5cr">{t.budget2to5cr}</SelectItem>
                        <SelectItem value="above5cr">{t.above5cr}</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button className="h-12 bg-gradient-hero text-primary-foreground hover:opacity-90 font-medium">
                <Search className="w-5 h-5 mr-2" />
                {t.searchButton}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};