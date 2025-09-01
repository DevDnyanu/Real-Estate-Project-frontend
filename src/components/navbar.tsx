import React from "react";

type NavbarProps = {
  currentLang: "en" | "hi";
  onLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ currentLang, onLogout }) => {
  return (
    <nav className="navbar">
    
      
    </nav>
  );
};

export default Navbar;
