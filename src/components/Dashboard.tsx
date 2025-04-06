
import React, { useState, useEffect } from 'react';
import Header from './Header';
import FootprintCounter from './FootprintCounter';
import FootprintChart from './FootprintChart';
import EcoTips from './EcoTips';
import AuthForm from './AuthForm';
import { isAuthenticated, logoutUser, getCurrentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check authentication status on mount
    setIsLoggedIn(isAuthenticated());
  }, []);
  
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };
  
  const currentUser = getCurrentUser();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        {isLoggedIn ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">
                  {currentUser?.name || 'User'}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <FootprintCounter />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FootprintChart />
                <EcoTips />
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto mt-10">
            <AuthForm onAuthSuccess={handleAuthSuccess} />
          </div>
        )}
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>AI Eco-Footprint Tracker &copy; 2025</p>
        <p className="text-xs mt-1">Helping reduce the environmental impact of AI, one prompt at a time.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
