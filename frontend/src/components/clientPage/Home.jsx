import React from 'react';
import HeroSection from '../shares/HeroSection';
import TradingChart from '../shared/TradingChart';
import CryptoTable from '../shared/CryptoTable';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">

          {/* Main Chart */}
         <div className="mb-8">
            <TradingChart />
         </div>
          
   
        
        {/* Cryptocurrency Table */}
        <div className="mb-8">
          <CryptoTable />
        </div>
      </div>
    </div>
  );
};

export default Home;
