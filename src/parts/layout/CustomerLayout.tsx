import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerTopMenu from 'parts/menu/CustomerTopMenu';
import BaseFooter from 'parts/footer/BaseFooter';

export default function CustomerLayout() {
  return (
    <>
      <header>
        <CustomerTopMenu />
      </header>
      <main>
        <Outlet />
      </main>
      <div className="b-example-divider" />
      <div className="container-fluid m-0 p-0">
        <BaseFooter />
      </div>
      <Toaster position="bottom-left" reverseOrder={false} />
    </>
  );
}
