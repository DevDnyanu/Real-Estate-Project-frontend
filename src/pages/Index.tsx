// // pages/Index.jsx
// import { useState } from 'react';
// import { Hero } from '@/components/Hero';
// // import { PropertyListing } from '@/components/PropertyListing';
// import { PackageSelection } from '@/components/PackageSelection';
// import { Footer } from '@/components/Footer';

// const Index = () => {
//   const [currentLang, setCurrentLang] = useState<'en' | 'hi'>('en');

//   const handlePackageSelect = (packageType: 'silver' | 'gold' | 'premium') => {
//     console.log('Selected package:', packageType);
    
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header removed from here since it's already in App.jsx */}
      
//       <main>
//         <Hero currentLang={currentLang} />
//         {/* <PropertyListing currentLang={currentLang} /> */}
//         <PackageSelection 
//           currentLang={currentLang} 
//           onSelectPackage={handlePackageSelect}
//         />
//       </main>
      
//       <Footer currentLang={currentLang} />
//     </div>
//   );
// };

// export default Index;