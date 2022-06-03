import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerTopMenu from 'parts/menu/CustomerTopMenu';
import BaseFooter from 'parts/footer/BaseFooter';
import {
  fetchCustomers,
} from 'state/customers/customersSlice';
import { fetchCompanies } from 'state/companies/companiesSlice';
import { useAppDispatch, useCustomerTopMenuHeightDimension } from 'app/hooks';
import { useSelector } from 'react-redux';
import { isSecondaryMenuItemVisible } from 'state/settings/settingsSlice';

export default function CustomerLayout() {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const [menuResponsiveClass, setMenuResponsiveClass] = useState<string>('');
  const topMenuHeight = useCustomerTopMenuHeightDimension();
  const secondaryMenuItemVisible = useSelector(isSecondaryMenuItemVisible);

  // Fetch all companies and workspaces ...
  useEffect(() => {
    dispatch(fetchCustomers()).then(() => dispatch(fetchCompanies()));
  }, [dispatch]);

  // When we resize or use app in different screen sizes we need to automatically readjust some classes
  useEffect(() => {
    setMenuResponsiveClass('');

    if ((topMenuHeight === 118 && !secondaryMenuItemVisible) || (topMenuHeight === 162 && !secondaryMenuItemVisible)) {
      setMenuResponsiveClass('top-menu-responsive-1');
    }
    if ((topMenuHeight === 118 && secondaryMenuItemVisible) || (topMenuHeight === 162 && secondaryMenuItemVisible)) {
      setMenuResponsiveClass('top-menu-responsive-2');
    }
  }, [topMenuHeight, secondaryMenuItemVisible, location]);

  return (
    <>
      <header>
        <CustomerTopMenu />
      </header>
      <main className={menuResponsiveClass}>
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
