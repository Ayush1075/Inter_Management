import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainContent } from './styled/StyledComponents';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
      <Sidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </div>
  );
};

export default Layout;
