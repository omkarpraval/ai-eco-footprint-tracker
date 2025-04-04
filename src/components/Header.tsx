
import React from 'react';
import { Leaf } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-eco-leaf/90 to-eco-water/90 py-4 px-6 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-white" />
          <h1 className="text-xl font-bold text-white">AI Eco-Footprint Tracker</h1>
        </div>
        <div className="text-white text-sm">
          Tracking the environmental impact of AI usage
        </div>
      </div>
    </header>
  );
};

export default Header;
