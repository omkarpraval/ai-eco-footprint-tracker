
import React from 'react';
import Header from './Header';
import FootprintCounter from './FootprintCounter';
import FootprintChart from './FootprintChart';
import EcoTips from './EcoTips';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 gap-8">
          <FootprintCounter />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FootprintChart />
            <EcoTips />
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>AI Eco-Footprint Tracker &copy; 2025</p>
        <p className="text-xs mt-1">Helping reduce the environmental impact of AI, one prompt at a time.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
