import React from 'react';
import InvestorSidebar from './InvestorSidebar';
import './InvestorLayout.css';

const InvestorLayout = ({ children }) => {
  return (
    <div className="investor-layout">
      <InvestorSidebar />
      <main className="investor-main-content">
        {children}
      </main>
    </div>
  );
};

export default InvestorLayout;