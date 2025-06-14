import React from 'react';
import HeroSection from '../shares/HeroSection';
import TradingChart from '../shared/TradingChart';
import CryptoTable from '../shared/CryptoTable';

const Home = () => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      
      <div className="container mx-auto">
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
