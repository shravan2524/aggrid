import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from 'logo-white.svg';
import { selectSecondaryMenuItems } from 'state/settings/settingsSlice';

import './CustomerTopMenu.scss';
import { getAuthFullNameFromLocal } from 'services/authService';
import CustomerTopMenuDropDown from './CustomerTopMenuDropDown';

function CustomerTopMenuCompaniesItem() {
  const [companies, setCompanies] = useState<any>(null);
  const companiesSelector = [];
  const selectedCompany = null;

  const setSelectedCompanyOption = (e) => {
    const companyId = e.currentTarget.value;
  };

  return (
    <li className="nav-item dropdown mx-2  my-2">
      <div className="bg-white rounded-pill text-dark d-flex justify-content-between align-items-center p-1">
        <strong className="rounded-circle bg-color-purple text-white p-1">
          <span className="badge rounded-pill bg-color-purple-dark p-2">P</span>
        </strong>
        <select
          onChange={setSelectedCompanyOption}
          className="form-select m-0 pt-1 pb-1 pl-0 pr-3 border-0 rounded-pill companies"
          aria-label="Default select example"
        >
          {!companies && (<option>No available Company</option>)}
          {companies && companies.map((c) => (<option key={c._id} value={c._id}>{c.title}</option>))}
        </select>
        <strong className="rounded-circle p-1">
          <button
            type="button"
            className="btn btn-sm btn-light bg-white border-0 rounded text-dark"
          >
            <i className="fa-solid fa-circle-plus" />
          </button>
        </strong>
      </div>
    </li>
  );
}

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
  const userFullName = useMemo(() => getAuthFullNameFromLocal(), []);

  const profileItems = useMemo(() => [
    {
      itemTitle: 'Profile',
      itemPath: '/customer/profile',
      icon: 'fa-solid fa-user',
    },
    {
      itemTitle: 'Customers',
      itemPath: '/customer/customers',
      icon: 'fa-solid fa-users',
    },
    {
      itemTitle: 'Companies',
      itemPath: '/customer/companies',
      icon: 'fa-solid fa-building',
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
    <div className="fixed-top">
      <nav className="navbar navbar-expand-md  navbar-dark bg-color-purple-dark">
        <div className="container-fluid">
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

              <CustomerTopMenuDropDown
                id="dropdown05"
                title={userFullName ?? ''}
                items={profileItems}
              />

              <li className="d-flex justify-content-between align-items-center mx-2 my-2">
                <NavLink to="/customer/notifications" className="btn btn-primary p-1 m-0 bg-color-purple-dark border-4 border-white position-relative rounded-pill">
                  <i className="fa-solid fa-bell m-1" />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    0
                    <span className="visually-hidden">unread messages</span>
                  </span>
                </NavLink>
              </li>

              <CustomerTopMenuCompaniesItem />

            </ul>
          </div>
        </div>
      </nav>

      <SecondaryCustomerTopMenu />

    </div>
  );
}
