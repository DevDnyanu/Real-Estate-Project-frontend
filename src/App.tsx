import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import RouterComponent from './components/Router';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [currentLang, setCurrentLang] = useState<"en" | "hi">("en"); // ✅ strict typing
  const { toast } = useToast();

  const handleLogin = (token: string, role: string, userId: string): void => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(userId);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
  };

  const handleLogout = (): void => {
    setIsAuthenticated(false);
    setUserRole('');
    setUserId('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
  };

  // ✅ enforce type to only allow "en" or "hi"
  const handleLanguageChange = (lang: "en" | "hi"): void => {
    setCurrentLang(lang);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');
    
    if (token && role && userId) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(userId);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentLang={currentLang} 
          onLanguageChange={handleLanguageChange} 
          isLoggedIn={isAuthenticated} 
          onLogout={handleLogout} 
          userRole={userRole} 
        />

        <RouterComponent 
          isAuthenticated={isAuthenticated}
          userRole={userRole}
          currentLang={currentLang} // ✅ now correctly passed
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
