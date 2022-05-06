import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import BaseFooter from 'parts/footer/BaseFooter';
import { PublicTopMenu } from '../menu/PublicTopMenu';

export default function PublicLayout() {
  return (
    <>
      <header>
        <PublicTopMenu />
      </header>
      <main>
        <div className="container">
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
