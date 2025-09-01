// components/Router.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import SignUpPage from './Signup';
import CreateListing from './CreateListing';
import Listings from './Listings';
import EditListing from './EditListing';
import ListingsPage from './ListingsPage';
import ListingDetailsPage from './ListingDetailsPage';
import Profile from './Profile';

interface RouterProps {
  isAuthenticated: boolean;
  userRole: string;
  onLogin: (token: string, role: string, userId: string) => void;
  onLogout: () => void;
  currentLang: "en" | "hi";
}

const Router: React.FC<RouterProps> = ({ 
  isAuthenticated, 
  userRole, 
  onLogin, 
  onLogout,
  currentLang 
}) => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <Home 
            currentLang={currentLang}
            onLogout={onLogout} 
            userRole={userRole}
            isAuthenticated={isAuthenticated}
          />
        } 
      />
      
      <Route 
        path="/properties" 
        element={
          isAuthenticated ? (
            <ListingsPage />
          ) : (
            <Navigate to="/login?redirect=/properties" />
          )
        } 
      />
      
      <Route 
        path="/listing/:id" 
        element={
          isAuthenticated ? (
            <ListingDetailsPage />
          ) : (
            <Navigate to="/login?redirect=/listing/:id" />
          )
        } 
      />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login onLogin={onLogin} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/signup"
        element={
          !isAuthenticated ? (
            <SignUpPage onLogin={onLogin} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          isAuthenticated ? (
            <Profile userRole={userRole} onLogout={onLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Seller Only Routes */}
      <Route
        path="/create-listing"
        element={
          isAuthenticated && userRole === 'seller' ? (
            <CreateListing />
          ) : isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Navigate to="/login?role=seller" />
          )
        }
      />

      <Route
        path="/listings"
        element={
          isAuthenticated ? (
            <ListingsPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/edit/:id"
        element={
          isAuthenticated && userRole === 'seller' ? (
            <EditListing />
          ) : isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;