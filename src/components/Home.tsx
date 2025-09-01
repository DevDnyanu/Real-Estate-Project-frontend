// components/Home.tsx
import React from "react";
import { Hero } from "@/components/Hero";
import { PackageSelection } from "@/components/PackageSelection";
import { Footer } from "@/components/Footer";
import Header from "./Header";
import Listings from "./Listings";
import ListingsPage from './ListingsPage';

type HomeProps = {
  currentLang: "en" | "hi";
  onLogout: () => void;
  userRole?: string;
  isAuthenticated: boolean;
};

const Home: React.FC<HomeProps> = ({ 
  currentLang, 
  onLogout, 
  userRole = 'buyer',
  isAuthenticated 
}) => {
  const handlePackageSelect = (packageType: string) => {
    console.log("Selected package:", packageType);
  };

  // Different content based on user role
  const renderContent = () => {
    if (userRole === 'seller') {
      return (
        <>
          {/* Seller को भी Hero Section दिखेगा */}
          <Hero currentLang={currentLang} />
          
         
          <ListingsPage />
        </>
      );
    }

    // Default buyer view
    return (
      <>
        <Hero currentLang={currentLang} />
        <Listings />
        <PackageSelection
          currentLang={currentLang}
          onSelectPackage={handlePackageSelect}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      

      <main>
        {renderContent()}
      </main>

      <Footer currentLang={currentLang} />
    </div>
  );
};

export default Home;