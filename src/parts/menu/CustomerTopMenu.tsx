import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from 'logo-white.svg';
import { selectSecondaryMenuItems } from 'state/settings/settingsSlice';
import { UserFullNameMenuItem } from './UserFullNameMenuItem';

import './CustomerTopMenu.scss';

function SecondaryCustomerTopMenu() {
  const secondaryMenuItems = useSelector(selectSecondaryMenuItems);

  if (!secondaryMenuItems) {
    return null;
  }

  if (!secondaryMenuItems.length) {
    return null;
  }

  return (
    <div className="nav-scroller bg-color-purple-light">
      <div className="container">
        <nav className="nav nav-underline" aria-label="Secondary navigation">
          {secondaryMenuItems.map((itm, i) => <NavLink key={`${itm.path}${i}`} to={itm.path} replace className="nav-link">{itm.text}</NavLink>)}
        </nav>
      </div>
    </div>
  );
}

export default function CustomerTopMenu() {
  return (
    <div className="fixed-top">
      <nav className="navbar navbar-expand-md  navbar-dark bg-color-purple-dark">
        <div className="container">
          <NavLink to="/" className="navbar-brand">
            <img src={logo} alt="Finkraft" width={90} />
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label=""
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink to="/customer/dashboard" className="nav-link">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/customer/reconciliation" className="nav-link">
                  Reconciliation
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/customer/admin" className="nav-link">
                  Admin
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-md-0">
              <li className="d-flex justify-content-between align-items-center">
                <NavLink to="/customer/notifications" className="p-1 m-0 btn btn-primary bg-color-purple-dark border-4 border-white position-relative rounded-pill ">
                  <i className="fa-solid fa-bell m-1" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <UserFullNameMenuItem />
                <ul className="dropdown-menu" aria-labelledby="dropdown05">
                  <li>
                    <NavLink to="/customer/profile" className="dropdown-item">
                      <i className="fa-solid fa-user" />
                      {' '}
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/customer/customers" className="dropdown-item">
                      <i className="fa-solid fa-users" />
                      {' '}
                      Customers
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/customer/companies" className="dropdown-item">
                      <i className="fa-solid fa-building" />
                      {' '}
                      Companies
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink to="/auth/logout" className="dropdown-item">
                      <i className="fa-solid fa-right-from-bracket" />
                      {' '}
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <SecondaryCustomerTopMenu />

    </div>
  );
}
