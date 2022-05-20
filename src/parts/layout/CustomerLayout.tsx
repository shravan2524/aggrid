import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerTopMenu from 'parts/menu/CustomerTopMenu';
import BaseFooter from 'parts/footer/BaseFooter';

import './CustomerLayout.scss';

export default function CustomerLayout() {
  return (
    <>
      <header>
        <CustomerTopMenu />
      </header>
      <main>
        <div className="container customer-container">
          <Outlet />
        </div>
      </main>
      <div className="b-example-divider" />
      <div className="container">
        <BaseFooter />
      </div>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
}
