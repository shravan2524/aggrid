/* eslint-disable */
import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { BACKEND_API } from 'app/config';
import logo from 'logo-white.svg';
import ShowOnAuth from 'components/ShowOnAuth';
import HideOnAuth from 'components/HideOnAuth';
import { getAuthFullNameFromLocal } from 'services/authService';
import CustomerTopMenuDropDown from './CustomerTopMenuDropDown';

export function PublicTopMenu() {
  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);
  const profileItems = useMemo(() => [
    {
      itemTitle: 'Dashboard',
      itemPath: '/customer/dashboard',
      icon: 'fa-solid fa-gauge',
    },
    {
      divider: true,
    },
    {
      itemTitle: 'Logout',
      itemPath: '/auth/logout',
      icon: 'fa-solid fa-right-from-bracket',
    },
  ], []);
  return (
    <nav className="navbar navbar-expand-md fixed-top bg-white topHeader">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Finkraft" width={120} />
        </NavLink>
        <button
          className="navbar-toggler closeIcon"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label=""
        >
        </button>
      </div>
    </nav>
  );
}
