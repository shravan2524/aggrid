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
          <img src={logo} alt="Finkraft" width={110} />
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
          <span />
          <span />
          <span />
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

          </ul>

          <ShowOnAuth>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0 topRight">
              <CustomerTopMenuDropDown
                id="dropdown06"
                title={userFullName ?? ''}
                items={profileItems}
              />
            </ul>
          </ShowOnAuth>

          <HideOnAuth>
            <div className="text-end ms-auto mb-2 mb-md-0">
              <a href={`${BACKEND_API}/api/v1/auth/login`} role="button" className="btn btn-warning me-2">
                <i className="fa-solid fa-right-to-bracket" />
                {' '}
                Login
              </a>
            </div>
          </HideOnAuth>

        </div>
      </div>
    </nav>
  );
}
