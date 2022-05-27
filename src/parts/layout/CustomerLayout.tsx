import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerTopMenu from 'parts/menu/CustomerTopMenu';
import BaseFooter from 'parts/footer/BaseFooter';
import { fetchCustomers } from 'state/customers/customersSlice';
import { fetchCompanies } from 'state/companies/companiesSlice';
import { useAppDispatch } from 'app/hooks';

export default function CustomerLayout() {
  const dispatch = useAppDispatch();

  // Fetch all companies and customers ...
  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchCompanies());
  }, [dispatch]);

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
